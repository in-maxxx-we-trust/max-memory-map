# Деплой MAX Memory Map на Vercel — план для дебила

## Что у нас за структура:

```
max-memory-map/
├── api/
│   └── chat.js          ← бэкенд (serverless function, ключи здесь)
├── public/
│   └── index.html       ← фронтенд (3D визуализация)
├── vercel.json          ← конфиг Vercel
└── .env.example         ← пример переменных (в git без ключей)
```

---

## ШАГ 1 — GitHub (5 минут)

1. Идёшь на github.com → кнопка "New repository"
2. Называешь: `max-memory-map`
3. Нажимаешь "Create repository"
4. На своём компьютере открываешь Terminal / командную строку
5. Пишешь:

```bash
cd /куда/скачал/папку/max-memory-map
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/ТВОЙ_НИК/max-memory-map.git
git push -u origin main
```

---

## ШАГ 2 — Подключаешь Vercel (3 минуты)

1. Идёшь на vercel.com → войти через GitHub
2. "Add New Project" → выбираешь репозиторий `max-memory-map`
3. Vercel сам определит настройки (Framework: Other)
4. НЕ нажимаешь Deploy ещё! Сначала Step 3.

---

## ШАГ 3 — Добавляешь секретные ключи (2 минуты)

На экране перед деплоем есть раздел **"Environment Variables"**
(или после деплоя: Settings → Environment Variables)

Добавляешь ПО ОДНОМУ:

| Name | Value |
|------|-------|
| `ANTHROPIC_API_KEY` | `sk-ant-api03-твой-ключ` |
| `OPENAI_API_KEY` | `sk-proj-твой-ключ` |

Для каждого:
- Поле "Key" = название из таблицы
- Поле "Value" = твой ключ
- Кнопка "Add"

---

## ШАГ 4 — Deploy (1 минута)

Нажимаешь **"Deploy"**.
Через 30 секунд получаешь URL типа: `https://max-memory-map.vercel.app`

---

## ШАГ 5 — Подключаешь свой домен

1. Vercel → твой проект → Settings → **Domains**
2. Нажимаешь "Add Domain"
3. Вводишь свой домен: `map.maxapp.com` (или что там у тебя)
4. Vercel скажет добавить DNS запись:
   - Type: **CNAME**
   - Name: `map` (или `@` если корневой)
   - Value: `cname.vercel-dns.com`
5. Идёшь к своему регистратору домена (где покупал)
6. Добавляешь эту DNS запись
7. Ждёшь 5-30 минут — и сайт работает на твоём домене

---

## Как обновлять сайт после изменений:

```bash
git add .
git commit -m "update"
git push
```
Vercel автоматически передеплоивает. Ключи не нужно добавлять заново.

---

## Если что-то сломалось:

- Vercel → проект → **Logs** — смотришь ошибки
- Самая частая: ключ не добавлен в env → переходишь Settings → Environment Variables

---

## Цены за реальную сессию (~10 минут разговора):

- **Anthropic Haiku 4.5**: ~$0.002  
- **OpenAI GPT-4.1 nano**: ~$0.0003  
- Web Speech API (распознавание речи): **бесплатно**

