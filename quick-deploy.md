# ⚡ Быстрый деплой - 5 минут

## 1. Создай GitHub репозиторий
- Перейди на [github.com/new](https://github.com/new)
- Название: `my-markdown-blog` (или любое другое)
- Сделай **Public**
- НЕ добавляй README
- Нажми "Create repository"

## 2. Подключи локальный код
Скопируй команды из GitHub и выполни в папке `markdown-site`:

```bash
git remote add origin https://github.com/ВАШ_USERNAME/my-markdown-blog.git
git branch -M main
git push -u origin main
```

## 3. Получи Convex Deploy Key
- Открой [dashboard.convex.dev](https://dashboard.convex.dev)
- Settings → Deploy Keys → Create Deploy Key
- Скопируй ключ (начинается с `prod:`)

## 4. Настрой Netlify
- Перейди на [netlify.com](https://www.netlify.com)
- "Add new site" → "Import an existing project" → "GitHub"
- Выбери свой репозиторий

**Build settings:**
- Build command: `npm ci --include=dev && npx convex deploy --cmd 'npm run build'`
- Publish directory: `dist`

**Environment variables:**
- `CONVEX_DEPLOY_KEY` = твой ключ из шага 3
- `VITE_CONVEX_URL` = `https://grateful-oriole-573.convex.cloud`

## 5. Деплой!
- Нажми "Deploy site"
- Дождись завершения (3-5 минут)
- Получи ссылку на свой сайт! 🎉

## Обновление контента
```bash
# Обновить контент в продакшн
npm run sync:prod

# Обновить код сайта
git add .
git commit -m "Update content"
git push
```

**Готово!** Твой блог теперь в интернете и обновляется автоматически.