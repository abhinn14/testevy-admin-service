import type { Request, Response } from "express";
import { Types } from "mongoose";
import { randomUUID } from "crypto";
import Test from "../models/test.model.js";
import Company from "../models/company.model.js";

export async function createTest(req: Request, res: Response) {
  try {
    const {
      company_id,
      title,
      description,
      total_time_minutes,
      mobile_cam_required,
      questions,
    } = req.body;

    const companyExists = await Company.findById(company_id);
    if(!companyExists) return res.status(404).json({ error: "Company not found" });

    const test = await Test.create({
      company: company_id,
      title,
      description,
      access_code: randomUUID().slice(0, 8),
      total_time_minutes,
      mobile_cam_required: mobile_cam_required ?? false,
      questions: questions?.map((q: any) => ({
        question: q.question_id,
        order_index: q.order_index ?? 0,
        marks: q.marks ?? 1,
      })),
    });

    res.status(201).json({
      id: test._id,
      access_code: test.access_code,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create test" });
  }
}


export async function getAllTest(req: Request, res: Response) {
  try {
    const { companyId } = req.params;

    if (!companyId || Array.isArray(companyId)) {
      return res.status(400).json({ error: "Invalid company id" });
    }

    const companyObjectId = new Types.ObjectId(companyId);

    const tests = await Test.find({ company: companyObjectId })
      .select("title description total_time_minutes access_code createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tests" });
  }
}

export async function getTest(req: Request, res: Response) {
  try {
    const { testId } = req.params;

    const test = await Test.findById(testId)
      .populate("questions.question")
      .lean();

    if(!test) return res.status(404).json({ error: "Test not found" });

    const orderedQuestions = test.questions
      .sort((a, b) => a.order_index - b.order_index)
      .map(q => ({
        ...q.question,
        order_index: q.order_index,
        marks: q.marks,
      }));

    res.json({...test, questions: orderedQuestions});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch test" });
  }
}


export async function updateTest(req: Request, res: Response) {
  try {
    const { testId } = req.params;

    await Test.findByIdAndUpdate(testId, {
      ...req.body,
    });

    res.json({ message: "Test updated" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update test" });
  }
}


export async function deleteTest(req: Request, res: Response) {
  try {
    const { testId } = req.params;
    await Test.findByIdAndDelete(testId);
    res.json({ message: "Test deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete test" });
  }
}
