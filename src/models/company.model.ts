import mongoose, { Schema, Document } from "mongoose";

export interface Company extends Document {
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<Company>(
  {
    name: { type: String, required: true, trim: true },
  },
  { timestamps: true, versionKey: false }
);

CompanySchema.index({ createdAt: -1 });

export default mongoose.model<Company>("Company", CompanySchema);
