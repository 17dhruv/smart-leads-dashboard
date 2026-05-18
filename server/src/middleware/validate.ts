import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const validate =
  (schema: ZodSchema) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query
    });

    if (!result.success) {
      next(new ApiError(400, "Validation failed", result.error.flatten()));
      return;
    }

    const parsed = result.data as {
      body?: unknown;
      params?: unknown;
      query?: unknown;
    };

    if (parsed.body) req.body = parsed.body;
    if (parsed.params) req.params = parsed.params as typeof req.params;
    if (parsed.query) req.query = parsed.query as typeof req.query;

    next();
  };
