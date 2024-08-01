import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINCONE_API_KEY;

if(!apiKey) throw Error("Pinecone is not set") ;
const pc = new Pinecone({ apiKey: apiKey });

export const notesIndex = pc.index('notes-ai');