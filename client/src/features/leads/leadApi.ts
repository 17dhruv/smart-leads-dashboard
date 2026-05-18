import { api } from "../../lib/api";
import type { ApiResponse, PaginatedApiResponse } from "../../types/api";
import type { Lead, LeadFilters, LeadFormValues } from "../../types/lead";

const buildLeadQuery = (filters: LeadFilters): string => {
  const params = new URLSearchParams({
    sort: filters.sort,
    page: String(filters.page)
  });

  if (filters.status) params.set("status", filters.status);
  if (filters.source) params.set("source", filters.source);
  if (filters.search?.trim()) params.set("search", filters.search.trim());

  return params.toString();
};

export const leadApi = {
  list(filters: LeadFilters) {
    return api.get<PaginatedApiResponse<Lead>>(`/leads?${buildLeadQuery(filters)}`);
  },

  detail(id: string) {
    return api.get<ApiResponse<Lead>>(`/leads/${id}`);
  },

  create(values: LeadFormValues) {
    return api.post<ApiResponse<Lead>>("/leads", values);
  },

  update(id: string, values: LeadFormValues) {
    return api.patch<ApiResponse<Lead>>(`/leads/${id}`, values);
  },

  remove(id: string) {
    return api.delete<ApiResponse<null>>(`/leads/${id}`);
  },

  exportCsv(filters: LeadFilters) {
    return api.get<string>(`/leads/export/csv?${buildLeadQuery(filters)}`);
  }
};
