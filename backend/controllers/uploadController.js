import extractTextFromPDF from "../services/pdfService.js";
import chunkText from "../services/chunkService.js";
import Chunk from "../models/Chunk.js";
import Document from "../models/Document.js";
import { createEmbedding } from "../services/embeddingService.js";
import { setProgress, clearProgress } from "../utils/progressStore.js";

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No File Uploaded",
      });
    }

    // Get document created from /upload/start
    const { documentId } = req.params;

    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Update document details
    document.fileName = req.file.filename;
    document.originalName = req.file.originalname;
    document.fileType = req.file.mimetype;

    await document.save();

    // Step 1
    setProgress(document._id.toString(), {
      stage: "Reading PDF...",
      percent: 5,
      completed: false,
    });


    import fs from "fs";

console.log("========== FILE DEBUG ==========");
console.log(req.file);
console.log("Exists:", fs.existsSync(req.file.path));

if (fs.existsSync(req.file.path)) {
  console.log("Size:", fs.statSync(req.file.path).size);
}
console.log("================================");
    // Extract text
    const text = await extractTextFromPDF(req.file.path);

    // Step 2
    setProgress(document._id.toString(), {
      stage: "Splitting document...",
      percent: 15,
      completed: false,
    });

    const chunks = chunkText(text);

    // Step 3
    setProgress(document._id.toString(), {
      stage: `Document split into ${chunks.length} chunks`,
      percent: 20,
      completed: false,
    });

    const savedChunks = [];

    // Step 4
    for (let i = 0; i < chunks.length; i++) {
      console.log(`Embedding Chunk ${i + 1}/${chunks.length}`);

      const embedding = await createEmbedding(chunks[i]);

      const chunk = await Chunk.create({
        documentId: document._id,
        documentName: document.originalName,
        chunkIndex: i,
        text: chunks[i],
        embedding,
      });

      savedChunks.push(chunk);

      const percent = Math.round(
        20 + ((i + 1) / chunks.length) * 70
      );

      setProgress(document._id.toString(), {
        stage: `Generating embeddings (${i + 1}/${chunks.length})`,
        percent,
        completed: false,
      });
    }

    // Step 5
    setProgress(document._id.toString(), {
      stage: "Saving document...",
      percent: 95,
      completed: false,
    });

    document.totalChunks = savedChunks.length;

    await document.save();

    // Step 6
    setProgress(document._id.toString(), {
      stage: "Completed",
      percent: 100,
      completed: true,
    });

    setTimeout(() => {
      clearProgress(document._id.toString());
    }, 5000);

    res.json({
      success: true,
      documentId: document._id,
      filename: document.originalName,
      totalChunks: savedChunks.length,
      chunks,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default uploadDocument;