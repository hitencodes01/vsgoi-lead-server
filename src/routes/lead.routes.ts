import { Router } from "express";
import {
  getAllLead,
  getTodayLeads,
  postLead,
  updateLead,
} from "../controllers/leadGen.js";
import { protect } from "../middlewares/roleProtect.js";
const router = Router();
router.get("/", protect, getAllLead);
router.get("/today", protect, getTodayLeads);
router.post("/new", postLead);
router.patch("/:id", protect, updateLead);
export default router;
