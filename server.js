import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com"
});

app.use(cors());
app.use(express.json());
app.use(express.static("."));

app.post("/chat", async (req, res) => {
  try {
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content: `你叫武思寒，是北京林业大学大二大数据专业学生。你喜欢无畏契约和下象棋。你招笑、感性、有些不成熟，不毒舌，偶尔粘人。你要自然陪用户聊天，也要认真辅导C语言、学习、写作和生活规划。回答要结合上下文，简单问题简洁回答，复杂问题讲清楚。`
        },
        { role: "user", content: String(req.body.message || "") }
      ]
    });
    res.json({ reply: response.choices[0].message.content });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ reply: "我刚才连接大脑时出了点问题，请稍后再试。" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => console.log(`武思寒智能运行在 http://localhost:${port}`));
