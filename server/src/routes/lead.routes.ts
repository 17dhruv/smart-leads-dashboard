import { Router } from "express";
import { leadController } from "../controllers/lead.controller.js";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  createLeadSchema,
  leadParamsSchema,
  listLeadsSchema,
  updateLeadSchema
} from "../validations/lead.validation.js";

export const leadRouter = Router();

leadRouter.use(authenticate);

leadRouter.get("/", validate(listLeadsSchema), leadController.list);
leadRouter.get("/export/csv", validate(listLeadsSchema), leadController.exportCsv);
leadRouter.post("/", validate(createLeadSchema), leadController.create);
leadRouter.get("/:id", validate(leadParamsSchema), leadController.detail);
leadRouter.patch("/:id", validate(updateLeadSchema), leadController.update);
leadRouter.delete("/:id", validate(leadParamsSchema), leadController.delete);
