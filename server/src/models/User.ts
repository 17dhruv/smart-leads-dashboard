import { Schema, model, type InferSchemaType } from "mongoose";
import type { UserRole } from "../types/auth.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      index: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["admin", "sales"] satisfies UserRole[],
      default: "sales",
      required: true
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

export type UserDocument = InferSchemaType<typeof userSchema> & {
  _id: string;
  role: UserRole;
};

export const UserModel = model("User", userSchema);
