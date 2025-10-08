import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { uploadFile } from "../controllers/fileController.js";

const router = express.Router();

router.post("/upload", upload.single("image"), uploadFile);

export default router;
