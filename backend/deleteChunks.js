// Temporary file to delete all datas in respective collections in MongoDB

import "dotenv/config";
import mongoose from "mongoose";
import Analysis from "./models/Analysis.js";
import Document from "./models/Document.js";
import Chunk from "./models/Chunk.js";

await mongoose.connect(process.env.MONGO_URI);

await Analysis.deleteMany({});  //Deletes all datas in 'analyses' collection
await Document.deleteMany({});  //Deletes all datas in 'documents' collection
await Chunk.deleteMany({});  //Deletes all datas in 'chunks' collection

console.log("All analyses deleted.");
console.log("All documents deleted.");
console.log("All chunks deleted.");

process.exit();