import mongoose, { Schema, Document, Types } from "mongoose";

export interface TestCandidate extends Document {
  test: Types.ObjectId;
  email: string;

  otp?: string;
  otp_expires_at?: Date;

  has_attempted: boolean;
  attempted_at?: Date;

  verified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const TestCandidateSchema = new Schema<TestCandidate>(
  {
    test: {
      type: Schema.Types.ObjectId,
      ref: "Test",
      required: true,
      index: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otp: String,
    otp_expires_at: Date,

    verified: {
      type: Boolean,
      default: false,
    },

    has_attempted: {
      type: Boolean,
      default: false,
    },

    attempted_at: Date,
  },
  { timestamps: true, versionKey: false }
);

// One email can appear only once per test
TestCandidateSchema.index({ test: 1, email: 1 }, { unique: true });

export default mongoose.model<TestCandidate>(
  "TestCandidate",
  TestCandidateSchema
);
