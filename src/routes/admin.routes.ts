import { Router } from "express";
import { leadStats, leadGroupedByDate } from "../controllers/leadStats.js";
const router = Router();
router.get("/stats", leadStats);
router.get("/date/:month/:year", leadGroupedByDate);
export default router;
