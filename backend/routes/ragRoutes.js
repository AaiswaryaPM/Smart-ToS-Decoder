import express from "express"; //In-built Module
import { askDocument } from "../controllers/ragController.js";

const router = express.Router();

router.post("/chat", askDocument);

export default router;