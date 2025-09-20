// src/ingest.ts
import fs from "fs";
import pdfParse from "pdf-parse";
import { OpenAIEmbeddings } from "@langchain/openai"
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

const loadPdfText = async (path: string): Promise<string> => {
  const dataBuffer = fs.readFileSync(path);
  const pdfData = await pdfParse(dataBuffer);
  return pdfData.text;
};

export const embedPdf = async () => {
  const text = await loadPdfText("data/Patel_Resume.pdf");
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await splitter.createDocuments([text]);

  const vectorStore = await MemoryVectorStore.fromDocuments(
    chunks,
    new OpenAIEmbeddings()
  );

  return vectorStore;
};
