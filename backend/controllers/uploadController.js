import extractTextFromPDF from "../services/pdfService.js";
import chunkText from "../services/chunckService.js";
import Chunk from "../models/Chunk.js";
import { createEmbedding } from "../services/embeddingService.js";

const uploadDocument = async(req, res) => {
    try{
        if(!req.file){
            return res.status(400).json({
                success: false,
                message: "No File Uploaded",
            });
        }
        
        const text = await  extractTextFromPDF(req.file.path);

        const chunks = chunkText(text);

        const savedChunks = [];
        for (let i=0; i<chunks.length; i++){
            console.log(`Embedding Chunk ${i + 1}/${chunks.length}`);
            const embedding = await createEmbedding(chunks[i]);
            const chunk = await Chunk.create({
                documentName: req.file.originalname,
                chunkIndex: i,
                text: chunks[i],
                embedding
            });
            savedChunks.push(chunk);
        }
        
        res.json({
            success: true,
            filename: req.file.originalname,
            totalChunks: savedChunks.length,
            chunks
        });
    }

    catch(error){
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export default uploadDocument;