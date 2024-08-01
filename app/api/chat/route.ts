import { notesIndex } from "@/lib/db/pinecone";
import prisma from "@/lib/db/prisma";
import { getEmbedding, openai } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { ChatCompletionMessage } from "openai/resources/index.mjs";
import {OpenAIStream, StreamingTextResponse} from "ai";
export async function POST(req: NextRequest, res: NextResponse) {

    const body = await req.json();
    const messages: ChatCompletionMessage[] = body.messages;

    // slicing the last 6 conversation only
    const messageTruncated = messages.slice(-6);

    // embedding the truncated message

    /* 
    * eg...
    * user: hey what is my favourite food
    * ai: your favourite food is chicken biriyani
    * user: any other
    * ai: egg biriyani
    * user: Thank you!
    * ai : you're welcome
    */

    const embedding = await getEmbedding(
        messageTruncated.map((message) => message.content).join("\n")
    );

    const {userId} = auth();

    // querying the similar results from vector db
    const vectorQuery = await notesIndex.query({
        vector: embedding,
        topK: 3,
        filter: {userId} // filtering only for the particular user's data
    });

    // give the fetched similar data's id into mongodb database and query the related data
    const relevantNotes = await prisma.note.findMany({
        where: {
            id: {
                in: vectorQuery.matches.map((match) => match.id)
            }
        }
    });

    // send the related data to llm along with the query
    const systemMessage: ChatCompletionMessage = {
        role: "assistant",
        content: "You are an intelligent note-taking app. You answer the user's questions based on the query" + 
        "The relevant queries are : \n" + 
        relevantNotes.map((note) => `Title: ${note.title}, content: ${note.content}`)
        .join("\n\n")
    };

    const response = await openai.chat.completions.create({
        model:"gpt-3.5-turbo",
        stream: true,
        messages: [systemMessage, ...messageTruncated]
    });

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
}