import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
    {
        documentName: {
            type: String,
            required: true,
        },
        chunkIndex: {
            type: Number,
            required: true
        },
        text: {
            type: String,
            required: true
        },
        embedding: {
            type: [Number],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Chunk", chunkSchema);