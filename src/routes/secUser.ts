import { Router } from "express";
import { secUserLogin } from "../controllers/secUser.js";

const router = Router();
router.post("/login", secUserLogin);

export default router;
