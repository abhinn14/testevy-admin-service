import { Router } from "express";
import {
    createTest,
    getAllTest,
    getTest,
    updateTest,
    deleteTest
} from "../controllers/test.controller.js";
import { adminAuth } from "../middlewares/admin.js";

const router = Router();

router.post("/create", adminAuth,createTest);
router.get("/getAll/:companyId", adminAuth,getAllTest);
router.get("/get/:testId", adminAuth,getTest);
router.put("/update/:testId", adminAuth,updateTest);
router.delete("/delete/:testId", adminAuth,deleteTest);

export default router;
