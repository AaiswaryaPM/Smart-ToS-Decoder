import Chunk from "../models/Chunk.js";
import { createEmbedding } from "./embeddingService.js";

// Cosine Similarity
function cosineSimilarity(vecA, vecB){
    let dot = 0;
    let magA = 0;
    let magB = 0;
    for (let i=0; i<vecA.length; i++){
        dot += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);
    if (magA === 0 || magB === 0){
        return 0;
    }
    return dot / (magA * magB);
}

export async function retrieveRelevantChunks(question, topK = 5) {
    // Creating embedding for user question
    const questionEmbedding = await createEmbedding(question);

    // Fetch all chunks
    const chunks = await Chunk.find();

    // Calculate similarity
    const scoredChunks = chunks.map(chunk => ({
        text: chunk.text,
        score: cosineSimilarity(
            questionEmbedding,
            chunk.embedding
        )
    }));

    const count = await Chunk.countDocuments();

    // Highlight similarity first
    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, topK);
}
