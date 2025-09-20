import {ChatOpenAI} from "@langchain/openai"

// src/server.ts
import express from "express";
import dotenv from "dotenv";
import { initAgent, askAgent } from "./agent.js";

dotenv.config();

const model = new ChatOpenAI({model: "gpt-4o", temperature: 0});

const app = express();
app.use(express.json());

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  if (!question) return res.status(400).send("No question provided");

  try {
    const answer = await askAgent(question);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error answering question");
  }
});

const PORT = 3000;
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  await initAgent();
});




