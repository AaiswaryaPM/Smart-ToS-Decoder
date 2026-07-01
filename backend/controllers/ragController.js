import { retrieveRelevantChunks } from "../services/retrievalService.js";
import ai from "../config/gemini.js";

export const askDocument = async(req, res) => {
    try{
        const { question, documentId } = req.body;
        
        if (!question || !documentId) {
            return res.status(400).json({
                success: false,
                message: "Question and documentId are required"
            });
        }

        // Retrieve relevant chunks
        const chunks = await retrieveRelevantChunks(question, documentId, 5);
        
        // Merge into one context
        const context = chunks.map((chunk) => chunk.text).join("\n\n");
      
        // Build RAG prompt
        const prompt = `
You are an intelligent document assistant.

Answer ONLY using the information provided in the CONTEXT below.

Rules:
- Do NOT make up information.
- If the answer is not present in the context, reply:
"I couldn't find that information in the uploaded document."
- Keep answers concise and easy to understand.

=========================
CONTEXT
=========================

${context}

=========================
QUESTION
=========================

${question}

=========================
ANSWER
=========================
`;

        // Ask Gemini
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        const answer = response.text;

        res.json({
            success: true,
            answer,
            retrievedChunks: chunks
        });
    }

    catch(error){
        console.log(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};