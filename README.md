# Uulbolsun Producer Web

Responsive landing page for Uulbolsun Almazbek's "МЕН ПРОДЮСЕР" course. The site presents the program, formats, mentor positioning, motion-led course visuals, and a lead form connected to Supabase Edge Functions and Telegram notifications.

## Возможности

- адаптивный лендинг React + Vite для курса "МЕН ПРОДЮСЕР";
- плавный скролл через Lenis и motion-анимации с поддержкой `prefers-reduced-motion`;
- hero-блок, программа, тарифы, автор, видео-блок и финальная форма заявки;
- форма заявки сохраняет лиды в таблицу `course_leads`;
- Supabase Edge Function `submit-course-lead` отправляет уведомление администратору в Telegram;
- fallback-сообщения для состояния загрузки, ошибки и успешной отправки;
- SEO-мета для публичной страницы курса.

## Технологии

- React + TypeScript + Vite;
- Supabase Functions + Postgres;
- Lenis для плавного скролла;
- lucide-react для интерфейсных иконок;
- адаптивный CSS без UI-kit зависимости.

## Запуск

```bash
npm install
npm run dev
```

Локальный адрес: `http://127.0.0.1:5173`.

Без `.env.local` лендинг откроется, но отправка формы покажет сообщение о том, что Supabase не подключен. Для реального подключения создайте `.env.local`:

```bash
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_your_key_or_anon_key"
```

## Supabase

1. Создайте проект в Supabase.
2. Примените миграции из `supabase/migrations/`, включая `20260425190000_course_leads.sql`.
3. Вставьте URL и publishable/anon key в `.env.local`.
4. Задеплойте Edge Function `submit-course-lead`.
5. Добавьте секреты для Telegram-уведомлений.

## Telegram bot

В проекте есть Telegram-интеграция через Supabase Edge Functions:

- `telegram-webhook` принимает `/start` и `/stop` от Telegram;
- `send-attendance-report` остался для отчетов из предыдущего модуля;
- `submit-course-lead` принимает заявку с лендинга, сохраняет ее в `course_leads`
  и отправляет уведомление администратору в Telegram.

В Supabase Edge Function Secrets должны быть заданы:

```bash
TELEGRAM_BOT_TOKEN="token-from-botfather"
TELEGRAM_WEBHOOK_SECRET="random-secret"
TELEGRAM_ALLOWED_USERNAMES="Adilkan_07"
TELEGRAM_ADMIN_USERNAME="Adilkan_07"
# optional fallback, если нужен прямой numeric chat_id
TELEGRAM_ADMIN_CHAT_ID="123456789"
```

После деплоя webhook нужно зарегистрировать в Telegram:

```bash
https://api.telegram.org/bot<token>/setWebhook?url=https://kwnliopkbeotibzkrbki.supabase.co/functions/v1/telegram-webhook&secret_token=<random-secret>
```

Пользователь `@Adilkan_07` должен открыть бота и нажать `/start`. После этого
заявки с лендинга будут приходить ему в Telegram. Если Telegram webhook еще не
настроен, можно временно задать `TELEGRAM_ADMIN_CHAT_ID` numeric chat id.

Заявки лендинга сохраняются в `course_leads`. Статус Telegram-уведомления:
`pending`, `sent`, `skipped`, `failed`.

## GitHub Pages

Workflow для деплоя находится в `.github/workflows/pages.yml`. Он собирает Vite-приложение с base path `/uulbolsun/`, Supabase URL и publishable key, затем публикует `dist` в GitHub Pages. Целевой адрес проекта: `https://adilkan.com/uulbolsun/`.

## Дальнейшие улучшения

- заменить placeholder-ссылки соцсетей на реальные Instagram, Telegram, YouTube;
- подключить настоящий видео-URL в блоке "Видео түшүндүрмө";
- добавить аналитику событий: клик CTA, отправка формы, ошибка формы;
- вынести тексты курса в отдельный JSON/TS-файл, чтобы проще обновлять лендинг без правки компонента.

## Проверка

```bash
npm run build
```

Скриншоты локальной проверки лежат в `output/playwright/`.
