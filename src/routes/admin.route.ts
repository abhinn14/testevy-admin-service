import express from "express";
import { adminLogin } from "../controllers/admin.controller.js";

export const router = express.Router();

router.post("/login", adminLogin);

export default router;