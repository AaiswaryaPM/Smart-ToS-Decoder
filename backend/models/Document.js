import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
    {
        fileName: {
            type: String,
            required: true
        },
        fileType: {
            type: String,
            required:true
        },
        originalText: {
            type: String,
            required: true
        },
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }
);

export default mongoose.model(
    "Document",
    documentSchema
);