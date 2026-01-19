import { Router } from "express";
import {
    createQues,
    getAllQues,
    getQues,
    updateQues
} from "../controllers/question.controller.js";
import { adminAuth } from "../middlewares/admin.js";

const router = Router();

router.post("/create", adminAuth, createQues);
router.get("/getAll", adminAuth, getAllQues);
router.get("/get/:quesId", adminAuth, getQues);
router.put("/update/:quesId", adminAuth, updateQues);

export default router;
