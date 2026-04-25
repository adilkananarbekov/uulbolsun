create table if not exists public.course_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 2 and 120),
  contact text not null check (char_length(trim(contact)) between 3 and 120),
  level text not null default 'zero' check (level in ('zero', 'has_blog', 'working')),
  page_url text,
  user_agent text,
  telegram_status text not null default 'pending' check (
    telegram_status in ('pending', 'sent', 'skipped', 'failed')
  ),
  telegram_message_id bigint,
  telegram_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists course_leads_touch_updated_at on public.course_leads;
create trigger course_leads_touch_updated_at
before update on public.course_leads
for each row execute function public.touch_updated_at();

alter table public.course_leads enable row level security;

drop policy if exists course_leads_staff_select on public.course_leads;
create policy course_leads_staff_select
on public.course_leads
for select
to authenticated
using (app_private.current_user_role() in ('admin', 'teacher'));

create index if not exists course_leads_created_at_idx
  on public.course_leads(created_at desc);

create index if not exists course_leads_telegram_status_idx
  on public.course_leads(telegram_status, created_at desc);
