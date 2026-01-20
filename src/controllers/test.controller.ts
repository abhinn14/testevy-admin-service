import type { Request, Response } from "express";
import mongoose, { Types } from "mongoose";
import { randomUUID } from "crypto";
import Test from "../models/test.model.js";
import Company from "../models/company.model.js";
import TestCandidate from "../models/candidate.model.js";

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
      title,
      company_id: company_id,
      company_name: companyExists.name,
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

    if(!companyId || Array.isArray(companyId))
      return res.status(400).json({ error: "Invalid company id" });

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


export const addTestCandidates = async (req: Request, res: Response) => {
  const { access_code } = req.params;
  const { emails } = req.body;

  // ---- Validate access code ----
  if (typeof access_code !== "string") {
    return res.status(400).json({
      success: false,
      message: "Invalid access code",
    });
  }

  // ---- Validate emails ----
  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Emails array is required",
    });
  }

  // ---- Find test by access code ----
  const test = await Test.findOne({ access_code });
  if (!test) {
    return res.status(404).json({
      success: false,
      message: "Test not found",
    });
  }

  const testObjectId = test._id;

  // ---- Normalize emails ----
  const normalizedEmails = emails
    .map((e: unknown) =>
      typeof e === "string" ? e.trim().toLowerCase() : null
    )
    .filter((e): e is string => Boolean(e));

  const uniqueEmails = [...new Set(normalizedEmails)];

  // ---- Fetch existing candidates ----
  const existingCandidates = await TestCandidate.find({
    test: testObjectId,
    email: { $in: uniqueEmails },
  }).select("email");

  const existingEmailSet = new Set(
    existingCandidates.map((c) => c.email)
  );

  // ---- Prepare inserts ----
  const newCandidates = uniqueEmails
    .filter((email) => !existingEmailSet.has(email))
    .map((email) => ({
      test: testObjectId,
      email,
    }));

  if (newCandidates.length > 0) {
    await TestCandidate.insertMany(newCandidates, {
      ordered: false,
    });
  }

  return res.status(201).json({
    success: true,
    added: newCandidates.length,
    skipped: existingEmailSet.size,
    duplicates: [...existingEmailSet],
  });
};