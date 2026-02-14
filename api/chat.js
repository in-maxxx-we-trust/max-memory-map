// api/chat.js — Vercel Serverless Function
// Ключи ТОЛЬКО в process.env — фронтенд их не видит никогда

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { text, knownConcepts, provider } = req.body;
  if (!text) return res.status(400).json({ error: 'No text' });

  const SYSTEM = `Ты извлекаешь концепты из речи человека для 3D карты личности.
Отвечай ТОЛЬКО валидным JSON без маркдауна и без пояснений.
Формат: {"concepts":[{"name":"1-3 слова","category":"категория","connections":["имя концепта если связан"]}]}
Категории (строго одна из): желание, ценность, привычка, мечта, человек, интерес, место, страх, другое.
Извлекай 3-7 самых ключевых НОВЫХ концептов. Имена короткие, на русском.`;

  const USER = `Речь: "${text}"\nИзвестные: [${(knownConcepts||[]).join(', ')||'нет'}]\nИзвлеки только новые.`;

  try {
    let raw;
    if (provider === 'openai') {
      const KEY = process.env.OPENAI_API_KEY;
      if (!KEY) return res.status(500).json({ error: 'OPENAI_API_KEY не задан в Vercel' });
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}` },
        body: JSON.stringify({ model: 'gpt-4.1-nano-2025-04-14', max_tokens: 600, messages: [{ role: 'system', content: SYSTEM },{ role: 'user', content: USER }] }),
      });
      const d = await r.json();
      if (d.error) return res.status(400).json({ error: d.error.message });
      raw = d.choices[0].message.content;
    } else {
      const KEY = process.env.ANTHROPIC_API_KEY;
      if (!KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY не задан в Vercel' });
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-api-key': KEY, 'anthropic-version': '2023-06-01' },
        body: JSON.stringify({ model: 'claude-haiku-4-5-20251001', max_tokens: 600, system: SYSTEM, messages: [{ role: 'user', content: USER }] }),
      });
      const d = await r.json();
      if (d.error) return res.status(400).json({ error: d.error.message });
      raw = d.content[0].text;
    }
    const clean = raw.replace(/```json?/g,'').replace(/```/g,'').trim();
    return res.status(200).json(JSON.parse(clean));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
