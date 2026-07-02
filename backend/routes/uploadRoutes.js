import express from "express";
import upload from "../middleware/upload.js";
import uploadDocument from "../controllers/uploadController.js";
import uploadStart from "../controllers/uploadStartController.js";


const router = express.Router();

router.post("/upload/start", uploadStart);

router.post(
    "/upload/process/:documentId",
    upload.single("document"),
    uploadDocument
);

export default router;