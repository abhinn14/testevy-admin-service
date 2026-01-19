import mongoose, { Schema, Document, Types } from "mongoose";

export interface TestQuestion {
  question: Types.ObjectId;
  order_index: number;
  marks: number;
}

export interface Test extends Document {
  company: Types.ObjectId;
  title: string;
  description?: string;
  access_code: string;
  total_time_minutes: number;
  mobile_cam_required: boolean;
  questions: TestQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<Test>(
  {
    company: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    title: { type: String, required: true },
    description: String,

    access_code: { type: String, required: true, unique: true },

    total_time_minutes: {
      type: Number,
      required: true,
      min: 1,
    },

    mobile_cam_required: {
      type: Boolean,
      default: false,
    },

    questions: [
      {
        question: {
          type: Schema.Types.ObjectId,
          ref: "Question",
          required: true,
        },
        order_index: { type: Number, default: 0 },
        marks: { type: Number, default: 1, min: 0 },
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

TestSchema.index({ company: 1, createdAt: -1 });

export default mongoose.model<Test>("Test", TestSchema);
