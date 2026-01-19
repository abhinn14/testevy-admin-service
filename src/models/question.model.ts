import mongoose, { Document, Schema } from "mongoose";


export interface Question extends Document {
  title: string;

  type: "MCQ" | "CODING" | "ESSAY";
  difficulty?: "EASY" | "MEDIUM" | "HARD";

  content: {
    question: string;

    options?: string[];
    codeTemplate?: string;
    testCases?: {
      input: string;
      output: string;
    }[];
  };

  correctAnswer?: {
    optionIndex?: number;
    explanation?: string;
  };

  tags: string[];

  createdAt: Date;
  updatedAt: Date;
}

const QuestionSchema = new Schema<Question>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["MCQ", "CODING", "ESSAY"],
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["EASY", "MEDIUM", "HARD"],
    },

    content: {
      question: {
        type: String,
        required: true,
      },

      options: {
        type: [String],
        default: undefined,
      },

      codeTemplate: {
        type: String,
      },

      testCases: [
        {
          input: { type: String, required: true },
          output: { type: String, required: true },
        },
      ],
    },

    correctAnswer: {
      optionIndex: {
        type: Number,
      },
      explanation: {
        type: String,
      },
    },

    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
QuestionSchema.index({ createdAt: -1 });
QuestionSchema.index({ type: 1, difficulty: 1 });
QuestionSchema.index({ tags: 1, type: 1 });
QuestionSchema.index({ title: "text" });


const Question =
  mongoose.models.Question ||
  mongoose.model<Question>("Question", QuestionSchema);

export default Question;
