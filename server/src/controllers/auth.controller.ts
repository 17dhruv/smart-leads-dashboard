import { authService } from "../services/auth.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { LoginInput, RegisterInput } from "../validations/auth.validation.js";

export const authController = {
  register: asyncHandler(async (req, res) => {
    const result = await authService.register(req.body as RegisterInput);
    res.status(201).json({
      success: true,
      data: result,
      message: "Registration successful"
    });
  }),

  login: asyncHandler(async (req, res) => {
    const result = await authService.login(req.body as LoginInput);
    res.status(200).json({
      success: true,
      data: result,
      message: "Login successful"
    });
  }),

  me: asyncHandler(async (req, res) => {
    if (!req.user) {
      throw new ApiError(401, "Authentication is required");
    }

    const user = await authService.me(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  })
};
