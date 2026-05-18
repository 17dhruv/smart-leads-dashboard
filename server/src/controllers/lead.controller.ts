import { leadService } from "../services/lead.service.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { CreateLeadInput, ListLeadsQuery, UpdateLeadInput } from "../validations/lead.validation.js";

const requireUser = (user: Express.Request["user"]) => {
  if (!user) {
    throw new ApiError(401, "Authentication is required");
  }

  return user;
};

const getLeadId = (id: unknown): string => {
  if (typeof id !== "string") {
    throw new ApiError(400, "Lead id is required");
  }

  return id;
};

export const leadController = {
  list: asyncHandler(async (req, res) => {
    const result = await leadService.list(requireUser(req.user), req.query as unknown as ListLeadsQuery);
    res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  }),

  create: asyncHandler(async (req, res) => {
    const lead = await leadService.create(requireUser(req.user), req.body as CreateLeadInput);
    res.status(201).json({
      success: true,
      data: lead,
      message: "Lead created"
    });
  }),

  detail: asyncHandler(async (req, res) => {
    const lead = await leadService.getById(requireUser(req.user), getLeadId(req.params.id));
    res.status(200).json({
      success: true,
      data: lead
    });
  }),

  update: asyncHandler(async (req, res) => {
    const lead = await leadService.update(requireUser(req.user), getLeadId(req.params.id), req.body as UpdateLeadInput);
    res.status(200).json({
      success: true,
      data: lead,
      message: "Lead updated"
    });
  }),

  delete: asyncHandler(async (req, res) => {
    await leadService.delete(requireUser(req.user), getLeadId(req.params.id));
    res.status(200).json({
      success: true,
      message: "Lead deleted"
    });
  }),

  exportCsv: asyncHandler(async (req, res) => {
    const csv = await leadService.exportCsv(requireUser(req.user), req.query as unknown as ListLeadsQuery);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="leads-export.csv"`);
    res.status(200).send(csv);
  })
};
