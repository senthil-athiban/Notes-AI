import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function getEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: "text-embedding-ada-002",
        input: text
    });

    const embedding = response.data[0].embedding;

    if(!embedding) throw Error("Embedding not found");

    console.log(" embedding : ", embedding);

    return embedding;
}