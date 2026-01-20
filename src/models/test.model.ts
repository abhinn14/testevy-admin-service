import mongoose, { Schema, Document, Types } from "mongoose";

export interface TestQuestion {
  question: Types.ObjectId;
  order_index: number;
  marks: number;
}

export interface Test extends Document {
  title: string;
  company_id: Types.ObjectId;
  company_name?: string;
  access_code: string;
  total_time_minutes: number;
  mobile_cam_required: boolean;
  questions: TestQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const TestSchema = new Schema<Test>(
  {
    title: { type: String, required: true },
    company_id: {
      type: Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    company_name: { type: String },
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

TestSchema.index({ company_id: 1, createdAt: -1 }); // Fixed: was "company"
TestSchema.index({ access_code: 1 }); // For quick lookups
TestSchema.index({ status: 1, company_id: 1 }); // For filtering active tests

export default mongoose.model<Test>("Test", TestSchema);
