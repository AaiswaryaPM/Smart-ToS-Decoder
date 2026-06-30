import mongoose from "mongoose";
import dotenv from "dotenv";

import { retrieveRelevantChunks } from "./services/retrievalService.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const results = await retrieveRelevantChunks(
    "What programming languages does this person know?"
);

console.log(results);