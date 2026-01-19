import { Router } from "express";
import {
    createCompany,
    getAllCompanies,
    getCompany,
    deleteCompany
} from "../controllers/company.controller.js";
import { adminAuth } from "../middlewares/admin.js";

const router = Router();

router.post("/create", adminAuth,createCompany); 
router.get("/getAll", adminAuth,getAllCompanies); 
router.get("/get/:companyId", adminAuth,getCompany);
router.delete("/delete/:companyId", adminAuth,deleteCompany);

export default router;
