import type { FilterQuery, SortOrder, Types } from "mongoose";
import { LEADS_PAGE_SIZE } from "../constants/lead.js";
import { LeadModel, type LeadDocument } from "../models/Lead.js";
import type { AuthUser } from "../types/auth.js";
import type { CreateLeadInput, ListLeadsQuery, UpdateLeadInput } from "../validations/lead.validation.js";

export interface LeadView {
  id: string;
  name: string;
  email: string;
  status: string;
  source: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedLeads {
  data: LeadView[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const toLeadView = (lead: LeadDocument): LeadView => ({
  id: lead._id.toString(),
  name: lead.name,
  email: lead.email,
  status: lead.status,
  source: lead.source,
  createdBy: lead.createdBy.toString(),
  createdAt: lead.createdAt,
  updatedAt: lead.updatedAt
});

const buildLeadFilter = (user: AuthUser, query: Partial<ListLeadsQuery> = {}): FilterQuery<LeadDocument> => {
  const filter: FilterQuery<LeadDocument> = {};

  if (user.role === "sales") {
    filter.createdBy = user.id;
  }

  if (query.status) {
    filter.status = query.status;
  }

  if (query.source) {
    filter.source = query.source;
  }

  if (query.search) {
    const regex = new RegExp(escapeRegex(query.search), "i");
    filter.$or = [{ name: regex }, { email: regex }];
  }

  return filter;
};

export const leadRepository = {
  async list(user: AuthUser, query: ListLeadsQuery): Promise<PaginatedLeads> {
    const filter = buildLeadFilter(user, query);
    const page = query.page;
    const sortDirection: SortOrder = query.sort === "oldest" ? 1 : -1;
    const skip = (page - 1) * LEADS_PAGE_SIZE;

    const [leads, total] = await Promise.all([
      LeadModel.find(filter)
        .sort({ createdAt: sortDirection })
        .skip(skip)
        .limit(LEADS_PAGE_SIZE)
        .lean<LeadDocument[]>(),
      LeadModel.countDocuments(filter)
    ]);

    return {
      data: leads.map(toLeadView),
      meta: {
        page,
        limit: LEADS_PAGE_SIZE,
        total,
        totalPages: Math.ceil(total / LEADS_PAGE_SIZE)
      }
    };
  },

  async export(user: AuthUser, query: ListLeadsQuery): Promise<LeadView[]> {
    const filter = buildLeadFilter(user, query);
    const sortDirection: SortOrder = query.sort === "oldest" ? 1 : -1;
    const leads = await LeadModel.find(filter).sort({ createdAt: sortDirection }).lean<LeadDocument[]>();
    return leads.map(toLeadView);
  },

  async create(user: AuthUser, input: CreateLeadInput): Promise<LeadView> {
    const lead = await LeadModel.create({
      ...input,
      createdBy: user.id
    });

    return toLeadView(lead.toObject() as LeadDocument);
  },

  async findAccessibleById(user: AuthUser, id: string): Promise<LeadView | null> {
    const filter: FilterQuery<LeadDocument> = {
      _id: id as unknown as Types.ObjectId,
      ...(user.role === "sales" ? { createdBy: user.id } : {})
    };
    const lead = await LeadModel.findOne(filter).lean<LeadDocument | null>();
    return lead ? toLeadView(lead) : null;
  },

  async update(user: AuthUser, id: string, input: UpdateLeadInput): Promise<LeadView | null> {
    const filter: FilterQuery<LeadDocument> = {
      _id: id as unknown as Types.ObjectId,
      ...(user.role === "sales" ? { createdBy: user.id } : {})
    };
    const lead = await LeadModel.findOneAndUpdate(filter, input, {
      new: true,
      runValidators: true
    }).lean<LeadDocument | null>();

    return lead ? toLeadView(lead) : null;
  },

  async delete(user: AuthUser, id: string): Promise<boolean> {
    const filter: FilterQuery<LeadDocument> = {
      _id: id as unknown as Types.ObjectId,
      ...(user.role === "sales" ? { createdBy: user.id } : {})
    };
    const result = await LeadModel.deleteOne(filter);
    return result.deletedCount === 1;
  }
};
