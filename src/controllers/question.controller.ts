import type { Request, Response } from "express";
import mongoose from "mongoose";
import Question from "../models/question.model.js";

export async function createQues(req: Request, res: Response) {
  try {
    const { title, type, difficulty, content, correctAnswer, tags } = req.body;

    if(!title || !type || !content?.question) {
      return res.status(400).json({
        error: "title, type and content.question are required",
      });
    }

    if(type === "MCQ" && (!content.options || content.options.length < 2)) {
      return res.status(400).json({
        error: "MCQ questions must have at least 2 options",
      });
    }

    if(type === "CODING" && (!content.testCases || content.testCases.length === 0)) {
      return res.status(400).json({
        error: "CODING questions must have test cases",
      });
    }

    const question = await Question.create({
      title,
      type,
      difficulty,
      content,
      correctAnswer,
      tags,
    });

    res.status(201).json({id: question._id});
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create question" });
  }
}

export async function getAllQues(req: Request, res: Response) {
  try {
    const filter: any = {};

    if(req.query.type) filter.type = req.query.type;
    if(req.query.difficulty) filter.difficulty = req.query.difficulty;
    if(req.query.search) filter.$text = { $search: req.query.search };
    

    const questions = await Question.find(filter)
      .select("title type difficulty tags createdAt")
      .sort({ createdAt: -1 })
      .lean();

    res.json(questions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
}


export async function getQues(req: Request, res: Response) {
  try {
    const { quesId } = req.params;

    if(typeof quesId !== "string") return res.status(400).json({ error: "Question ID is required" });
    

    if(!mongoose.Types.ObjectId.isValid(quesId)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    const question = await Question.findById(quesId).lean();

    if(!question) return res.status(404).json({ error: "Question not found" });

    res.json(question);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch question" });
  }
}


export async function updateQues(req: Request, res: Response) {
  try {
    const { quesId } = req.params;

    if(typeof quesId !== "string") {
      return res.status(400).json({ error: "Question ID is required" });
    }

    if(!mongoose.Types.ObjectId.isValid(quesId)) {
      return res.status(400).json({ error: "Invalid question ID" });
    }

    const { title, type, difficulty, content, correctAnswer, tags } = req.body;

    if(type === "MCQ" && content && (!content.options || content.options.length < 2)) {
      return res.status(400).json({
        error: "MCQ questions must have at least 2 options",
      });
    }

    if(type === "CODING" && content && (!content.testCases || content.testCases.length === 0)) {
      return res.status(400).json({
        error: "CODING questions must have test cases",
      });
    }

    const updated = await Question.findByIdAndUpdate(
      quesId,
      {
        title,
        type,
        difficulty,
        content,
        correctAnswer,
        tags,
      },
      { new: true }
    );

    if(!updated) return res.status(404).json({ error: "Question not found" });

    res.json({ message: "Question updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update question" });
  }
}

