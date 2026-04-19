import { Router } from "express";
import { leadStats } from "../controllers/leadStats.js";
const router = Router();
router.get("/stats",leadStats)
export default router;