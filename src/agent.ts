// src/agent.ts
import {ChatOpenAI} from "@langchain/openai"
import { RetrievalQAChain } from "langchain/chains";
import { embedPdf } from "./ingest.js";

let qaChain: RetrievalQAChain;

export const initAgent = async () => {
  const vectorStore = await embedPdf();
  const retriever = vectorStore.asRetriever();

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: "gpt-4", // or gpt-3.5-turbo
  });

  qaChain = RetrievalQAChain.fromLLM(model, retriever);
};

export const askAgent = async (question: string): Promise<string> => {
  if (!qaChain) throw new Error("Agent not initialized.");
  const res = await qaChain.call({ query: question });
  return res.text;
};
