import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

type CourseLeadRequest = {
  name?: string;
  contact?: string;
  level?: "zero" | "has_blog" | "working";
  pageUrl?: string;
};

type CourseLead = {
  id: string;
  created_at: string;
};

type TelegramSendResult = {
  ok: boolean;
  result?: {
    message_id?: number;
  };
  description?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const botToken = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const adminUsername = (Deno.env.get("TELEGRAM_ADMIN_USERNAME") ?? "Adilkan_07")
  .replace(/^@/, "")
  .trim();
const adminChatId = Deno.env.get("TELEGRAM_ADMIN_CHAT_ID")?.trim();

const supabaseAdmin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}

function clean(value: unknown, maxLength: number) {
  return String(value ?? "").trim().replace(/\s+/g, " ").slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function levelLabel(level: CourseLeadRequest["level"]) {
  if (level === "has_blog") return "Блогум бар";
  if (level === "working") return "Иштейм";
  return "0дон";
}

async function resolveAdminChatId() {
  if (adminChatId) return adminChatId;
  if (!adminUsername) return null;

  const { data, error } = await supabaseAdmin
    .from("telegram_subscriptions")
    .select("chat_id")
    .eq("is_active", true)
    .ilike("username", adminUsername)
    .limit(1)
    .returns<Array<{ chat_id: number }>>();

  if (error) throw error;
  return data?.[0]?.chat_id ? String(data[0].chat_id) : null;
}

async function sendTelegram(chatId: string, text: string) {
  if (!botToken) throw new Error("TELEGRAM_BOT_TOKEN is not configured");

  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  const payload = (await response.json().catch(() => null)) as TelegramSendResult | null;

  if (!response.ok) {
    throw new Error(payload?.description ?? response.statusText);
  }

  return payload;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = (await req.json().catch(() => ({}))) as CourseLeadRequest;
    const name = clean(body.name, 120);
    const contact = clean(body.contact, 120);
    const level = body.level === "has_blog" || body.level === "working" ? body.level : "zero";
    const pageUrl = clean(body.pageUrl, 500);
    const userAgent = clean(req.headers.get("user-agent"), 500);

    if (name.length < 2) return json({ error: "Name is required" }, 400);
    if (contact.length < 3) return json({ error: "Contact is required" }, 400);

    const { data: lead, error: insertError } = await supabaseAdmin
      .from("course_leads")
      .insert({
        name,
        contact,
        level,
        page_url: pageUrl || null,
        user_agent: userAgent || null,
        telegram_status: "pending",
      })
      .select("id, created_at")
      .single<CourseLead>();

    if (insertError || !lead) throw insertError ?? new Error("Lead was not created");

    try {
      const chatId = await resolveAdminChatId();
      if (!chatId) {
        await supabaseAdmin
          .from("course_leads")
          .update({
            telegram_status: "skipped",
            telegram_error: `Admin chat is not configured for @${adminUsername}`,
          })
          .eq("id", lead.id);

        return json({ ok: true, id: lead.id, telegramSent: false });
      }

      const message = [
        "<b>Новая заявка: МЕН ПРОДЮСЕР</b>",
        `Имя: <b>${escapeHtml(name)}</b>`,
        `Контакт: <code>${escapeHtml(contact)}</code>`,
        `Уровень: ${escapeHtml(levelLabel(level))}`,
        `Дата: ${escapeHtml(new Date(lead.created_at).toLocaleString("ru-RU", { timeZone: "Asia/Bishkek" }))}`,
        "",
        `Lead ID: <code>${escapeHtml(lead.id)}</code>`,
      ].join("\n");

      const sent = await sendTelegram(chatId, message);
      await supabaseAdmin
        .from("course_leads")
        .update({
          telegram_status: "sent",
          telegram_message_id: sent?.result?.message_id ?? null,
          telegram_error: null,
        })
        .eq("id", lead.id);

      return json({ ok: true, id: lead.id, telegramSent: true });
    } catch (error) {
      await supabaseAdmin
        .from("course_leads")
        .update({
          telegram_status: "failed",
          telegram_error: error instanceof Error ? error.message : "Telegram send failed",
        })
        .eq("id", lead.id);

      return json({ ok: true, id: lead.id, telegramSent: false });
    }
  } catch (error) {
    console.error(error);
    return json({ error: "Lead submit failed" }, 500);
  }
});
