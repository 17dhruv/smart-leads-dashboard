import type { AuthUser } from "../types/auth.js";
import { ApiError } from "../utils/ApiError.js";
import { toCsv } from "../utils/csv.js";
import { leadRepository } from "../repositories/lead.repository.js";
import type { CreateLeadInput, ListLeadsQuery, UpdateLeadInput } from "../validations/lead.validation.js";

export const leadService = {
  list(user: AuthUser, query: ListLeadsQuery) {
    return leadRepository.list(user, query);
  },

  create(user: AuthUser, input: CreateLeadInput) {
    return leadRepository.create(user, input);
  },

  async getById(user: AuthUser, id: string) {
    const lead = await leadRepository.findAccessibleById(user, id);

    if (!lead) {
      throw new ApiError(404, "Lead not found");
    }

    return lead;
  },

  async update(user: AuthUser, id: string, input: UpdateLeadInput) {
    const lead = await leadRepository.update(user, id, input);

    if (!lead) {
      throw new ApiError(404, "Lead not found");
    }

    return lead;
  },

  async delete(user: AuthUser, id: string) {
    const deleted = await leadRepository.delete(user, id);

    if (!deleted) {
      throw new ApiError(404, "Lead not found");
    }
  },

  async exportCsv(user: AuthUser, query: ListLeadsQuery) {
    const leads = await leadRepository.export(user, query);
    return toCsv(
      leads.map((lead) => ({
        id: lead.id,
        name: lead.name,
        email: lead.email,
        status: lead.status,
        source: lead.source,
        createdBy: lead.createdBy,
        createdAt: lead.createdAt
      })),
      [
        { key: "id", header: "ID" },
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "status", header: "Status" },
        { key: "source", header: "Source" },
        { key: "createdBy", header: "Created By" },
        { key: "createdAt", header: "Created At" }
      ]
    );
  }
};
