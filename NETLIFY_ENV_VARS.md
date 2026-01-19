# Переменные окружения для Netlify

После создания сайта в Netlify, добавь эти переменные в Site settings → Environment variables:

## Обязательные переменные:

**CONVEX_DEPLOY_KEY**
```
prod:grateful-oriole-573|eyJ2MiI6IjViMDQzNDY0NGUyNzRhY2Y4YTI4ODFmYTFjNjNiYzhjIn0=
```

**VITE_CONVEX_URL**
```
https://grateful-oriole-573.convex.cloud
```

## Опциональные (для полного функционала):

**SITE_URL** (замени на свой Netlify URL)
```
https://your-site-name.netlify.app
```

**NODE_VERSION**
```
18
```

## Как добавить в Netlify:
1. Site settings → Environment variables
2. Add variable
3. Вставь название и значение
4. Save

После добавления переменных нажми "Trigger deploy" для пересборки.