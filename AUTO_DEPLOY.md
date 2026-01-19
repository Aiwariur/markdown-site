# 🤖 Автоматический деплой - ДЕЛАЙ ПО ПОРЯДКУ!

## 1. Создай GitHub репозиторий (30 сек)
**Открой:** https://github.com/new
- Название: `my-markdown-blog`
- Public
- НЕ добавляй README
- Create repository

## 2. Подключи репозиторий (скопируй команды из GitHub)
```bash
git remote add origin https://github.com/ВАШ_USERNAME/my-markdown-blog.git
git branch -M main
git push -u origin main
```

## 3. Создай Netlify сайт (1 минута)
**Открой:** https://app.netlify.com/start
- Deploy with GitHub
- Выбери свой репозиторий `my-markdown-blog`
- Build settings уже настроены в `netlify.toml`
- Deploy site

## 4. Добавь переменные окружения
В Netlify: Site settings → Environment variables → Add variable

**CONVEX_DEPLOY_KEY:**
```
prod:grateful-oriole-573|eyJ2MiI6IjViMDQzNDY0NGUyNzRhY2Y4YTI4ODFmYTFjNjNiYzhjIn0=
```

**VITE_CONVEX_URL:**
```
https://grateful-oriole-573.convex.cloud
```

## 5. Пересобери сайт
- Deploys → Trigger deploy
- Дождись завершения (3-5 минут)

## 🎉 ГОТОВО!
Твой блог будет доступен по ссылке из Netlify!

**Обновление контента:**
```bash
npm run sync:prod  # Обновить посты
git push          # Обновить код
```