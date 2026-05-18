import { UserModel } from "../models/User.js";
import type { UserRole } from "../types/auth.js";

export interface CreateUserRecord {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
}

export const userRepository = {
  findByEmail(email: string) {
    return UserModel.findOne({ email }).lean();
  },

  findById(id: string) {
    return UserModel.findById(id).select("_id name email role").lean();
  },

  async create(input: CreateUserRecord) {
    const user = await UserModel.create(input);
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role as UserRole
    };
  }
};
