
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("NEX AI Server is online 🤖");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    name: "NEX-1A"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return res.status(503).json({
        error: "API key is not configured"
      });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "NEX-IA"
        },
        body: JSON.stringify({
          model: process.env.OPENROUTER_MODEL || "openrouter/auto",
          messages: [
            {
              role: "system",
              content: "You are NEX-1A, a helpful AI assistant. Be intelligent, direct and friendly. Respond in the user's language."
            },
            {
              role: "user",
              content: message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenRouter error:", data);
      return res.status(502).json({
        error: "AI service error"
      });
    }

    const reply = data.choices?.[0]?.message?.content;

    if (!reply) {
      return res.status(502).json({
        error: "No response from AI"
      });
    }

    res.json({ reply });

  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      error: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`NEX-1A online on port ${PORT}`);
});
