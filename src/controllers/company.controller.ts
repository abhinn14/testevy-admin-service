import type { Request, Response } from "express";
import Company from "../models/company.model.js";


export async function createCompany(req: Request, res: Response) {
    try {
        const company = await Company.create({ name: req.body.name });
        res.status(201).json({ id: company._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create company" });
    }
}


export async function getAllCompanies(req: Request, res: Response) {
  try {
    const companies = await Company
      .find({}, { name: 1 })
      .sort({ createdAt: -1 })
      .lean();

    res.json(companies);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch companies" });
  }
}


export async function getCompany(req: Request, res: Response) {
    try {
        const company = await Company.findById(req.params.companyId).lean();
        if(!company) return res.status(404).json({ error: "Company not found" });
        res.json(company);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch company" });
    }
}


export async function deleteCompany(req: Request, res: Response) {
    try {
        await Company.findByIdAndDelete(req.params.companyId);
        res.json({ message: "Company deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete company" });
    }
}
