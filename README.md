# Mini Shop - Telegram Mini App

Telegram Mini App магазин, построенный на React + Vite + TypeScript.

## Технологический стек

- **React 18** + **TypeScript**
- **Vite** - быстрая сборка и разработка
- **React Router** - клиентская маршрутизация
- **TanStack Query** - управление серверным состоянием
- **Zustand** - управление клиентским состоянием
- **React Hook Form + Zod** - формы и валидация
- **Tailwind CSS** - стилизация
- **shadcn/ui** - UI компоненты
- **@telegram-apps/sdk** - Telegram Mini Apps SDK

## Установка

```bash
npm install
# или
yarn install
```

## Разработка

```bash
npm run dev
# или
yarn dev
```

Приложение будет доступно на `http://localhost:3000`

## Сборка

```bash
npm run build
# или
yarn build
```

Собранные файлы будут в папке `dist/`

## Переменные окружения

Создайте файл `.env` в корне проекта:

```env
VITE_API_URL=https://your-backend-url.com/api
VITE_ADMIN_IDS=123456789,987654321
VITE_PUBLIC_URL=https://your-frontend-url.com
```

## Структура проекта

```
src/
├── components/       # React компоненты
├── contexts/         # React контексты
├── hooks/            # Custom hooks
├── lib/              # Утилиты и библиотеки
├── stores/           # Zustand stores
├── types/            # TypeScript типы
└── styles/           # Глобальные стили
```

## Цветовая схема

Приложение использует темную тему с акцентными цветами:
- **Фон**: `#0B0C10` (очень темный)
- **Вторичный фон**: `#1F2833` (темный серо-синий)
- **Текст**: `#C5C6C7` (светло-серый)
- **Акцент**: `#66FCF1` (яркий бирюзовый)
- **Muted акцент**: `#45A29E` (muted teal)

## Линтинг и форматирование

```bash
npm run lint
npm run format
```
