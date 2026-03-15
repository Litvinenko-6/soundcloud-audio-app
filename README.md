# Soundcloud Audio App

Веб-приложение на React + TypeScript в стиле SoundCloud: черная главная страница, авторизация через модальное окно и личная страница для загрузки аудиофайлов с отображением метаданных в таблице.

## Демо

- Production: https://litvinenko-6.github.io/soundcloud-audio-app/
- Репозиторий: https://github.com/Litvinenko-6/soundcloud-audio-app

## Функциональность

- Черная landing-страница с акцентами в стиле SoundCloud
- Модальное окно авторизации
- Тестовый вход (email + пароль отображаются в модалке)
- Защищенный переход на основную страницу после успешного входа
- Загрузка аудиофайлов (`audio/*`)
- Таблица с данными по каждому файлу:
  - Название
  - MIME-тип
  - Размер (KB)
  - Длительность (автоопределение)
  - Дата/время загрузки
- Выход из аккаунта

## Тестовые данные для входа

- Email: `demo@soundcloud.local`
- Пароль: `demo12345`

## Технологии

- React 18
- TypeScript
- Redux Toolkit
- React Router
- Tailwind CSS
- shadcn/ui (используемые UI-компоненты)
- Vite

## Локальный запуск

```bash
npm install
npm run dev
```

Приложение будет доступно по адресу, который покажет Vite (обычно `http://localhost:5173`).

## Сборка

```bash
npm run build
npm run preview
```

## Деплой

Деплой настроен на **GitHub Pages** через **GitHub Actions**.

- Workflow: `.github/workflows/deploy.yml`
- При пуше в `main` автоматически запускается сборка и публикация

## Структура проекта

```text
src/
  app/               # store, hooks, router
  components/        # auth modal + ui компоненты
  features/
    auth/            # auth slice
    audio/           # audio slice
  pages/             # landing и dashboard страницы
  types/             # типы (AudioItem)
```
