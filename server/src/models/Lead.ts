import { Schema, model, type InferSchemaType, type Types } from "mongoose";
import { LEAD_SOURCES, LEAD_STATUSES, type LeadSource, type LeadStatus } from "../constants/lead.js";

const leadSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    status: {
      type: String,
      enum: LEAD_STATUSES,
      required: true,
      default: "New"
    },
    source: {
      type: String,
      enum: LEAD_SOURCES,
      required: true
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

leadSchema.index({ name: "text", email: "text" });
leadSchema.index({ status: 1, source: 1, createdAt: -1 });

export type LeadDocument = InferSchemaType<typeof leadSchema> & {
  _id: Types.ObjectId | string;
  createdBy: Types.ObjectId | string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
};

export const LeadModel = model("Lead", leadSchema);
