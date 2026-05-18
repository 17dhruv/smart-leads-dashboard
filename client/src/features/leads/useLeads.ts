import { useCallback, useEffect, useState } from "react";
import { ApiClientError } from "../../lib/api";
import type { PaginationMeta } from "../../types/api";
import type { Lead, LeadFilters } from "../../types/lead";
import { leadApi } from "./leadApi";

export const useLeads = (filters: LeadFilters) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await leadApi.list(filters);
      setLeads(response.data);
      setMeta(response.meta);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Unable to load leads");
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    void loadLeads();
  }, [loadLeads]);

  return {
    leads,
    meta,
    isLoading,
    error,
    refresh: loadLeads
  };
};
