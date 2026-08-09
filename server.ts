import express from "express";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initializer for Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper to parse cookies
function parseCookies(cookieHeader?: string): Record<string, string> {
  const list: Record<string, string> = {};
  if (!cookieHeader) return list;
  cookieHeader.split(";").forEach((cookie) => {
    const parts = cookie.split("=");
    const key = parts.shift()?.trim();
    if (key) {
      list[key] = decodeURIComponent(parts.join("="));
    }
  });
  return list;
}

// Authentication endpoints
app.post("/api/auth", (req, res) => {
  const { password } = req.body || {};
  const validPasswords = ["promptiq2025", "piq-marketing-2025"];
  if (validPasswords.includes(password)) {
    res.setHeader(
      "Set-Cookie",
      `piq-access=${encodeURIComponent(password)}; Path=/; Max-Age=${30 * 24 * 60 * 60}; SameSite=Lax`
    );
    return res.json({ ok: true });
  }
  return res.status(401).json({ ok: false });
});

app.get("/api/auth/check", (req, res) => {
  const cookies = parseCookies(req.headers.cookie);
  const cookieVal = cookies["piq-access"];
  const validPasswords = ["promptiq2025", "piq-marketing-2025"];
  if (cookieVal && validPasswords.includes(cookieVal)) {
    return res.json({ authenticated: true });
  }
  return res.json({ authenticated: false });
});

app.post("/api/auth/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    "piq-access=; Path=/; Max-Age=0; SameSite=Lax"
  );
  return res.json({ ok: true });
});

// API endpoint for AI Prompt Generator / Customizer
app.post("/api/generate-prompt", async (req, res) => {
  try {
    const { role, task, context, goal } = req.body;
    if (!task && !role) {
      return res.status(400).json({ error: "Пожалуйста, укажите роль или задачу." });
    }

    const ai = getGeminiClient();
    const promptText = `
Ты — профессиональный эксперт по маркетингу, контент-стратегиям и специалист по составлению инженерных AI-промптов.
Создай идеальный, детальный промпт для маркетинга и контента на русском языке, используя СТРОГУЮ ФОРМУЛУ из 5 элементов:
1. Роль (Role)
2. Задача (Task)
3. Контекст (Context)
4. Формат (Format)
5. Ограничения (Constraints)

Исходные данные пользователя:
- Желаемая роль: ${role || "Chief Marketing Officer / Head of Content"}
- Задача: ${task || "Разработать контент-план и продающие тексты"}
- Контекст: ${context || "Продвижение продукта или бренда"}
- Дополнительная цель: ${goal || "Повысить конверсию и вовлеченность аудитории"}

Сгенерируй ответ в строгом JSON-формате без markdown разметки вокруг JSON, со следующей структурой:
{
  "title": "Название промпта из 3-5 слов",
  "targetAudience": "Для кого полезен данный промпт",
  "role": "Описание роли для ИИ",
  "task": "Четкая формулировка задачи",
  "context": "Детальный контекст с переменными в квадратных скобках, например [Описание продукта/ЦА]",
  "format": "Требуемый формат ответа",
  "constraints": "Ограничения и правила выполнения",
  "fullPromptText": "Полный текст сгенерированного промпта с блоками Роль, Задача, Контекст, Формат, Ограничения"
}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: promptText,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    const parsed = JSON.parse(jsonText);
    res.json({ success: true, prompt: parsed });
  } catch (err: any) {
    console.error("Error generating prompt:", err);
    res.status(500).json({
      error: "Не удалось сгенерировать промпт. Убедитесь, что настроен ключ GEMINI_API_KEY.",
      details: err.message,
    });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
