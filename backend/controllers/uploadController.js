import extractTextFromPDF from "../services/pdfService.js";
import chunkText from "../services/chunkService.js";
import Chunk from "../models/Chunk.js";
import Document from "../models/Document.js";
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

        // Create a document entry
        const document = await Document.create({
            fileName: req.file.filename,
            fileType: req.file.mimetype,
            originalName: req.file.originalname,
        });

        const savedChunks = [];
        for (let i=0; i<chunks.length; i++){
            console.log(`Embedding Chunk ${i + 1}/${chunks.length}`);
            const embedding = await createEmbedding(chunks[i]);
            const chunk = await Chunk.create({
                documentId: document._id,
                documentName: document.originalName,
                chunkIndex: i,
                text: chunks[i],
                embedding
            });
            savedChunks.push(chunk);
        }

        document.totalChunks = savedChunks.length;
        await document.save();
        
        res.json({
            success: true,
            documentId: document._id,
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