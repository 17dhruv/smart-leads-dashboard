"use client";

import { Download, Filter, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { AuthGate } from "../../components/AuthGate";
import { Button } from "../../components/Button";
import { SelectInput, TextInput } from "../../components/Field";
import { EmptyState, ErrorState, LoadingState } from "../../components/PageState";
import { Pagination } from "../../components/Pagination";
import { StatusBadge } from "../../components/StatusBadge";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { ApiClientError } from "../../lib/api";
import { LEAD_SOURCES, LEAD_STATUSES, type LeadFilters, type LeadSort } from "../../types/lead";
import { leadApi } from "./leadApi";
import { useLeads } from "./useLeads";

export const LeadsDashboardScreen = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [sort, setSort] = useState<LeadSort>("latest");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState<string | null>(null);
  const debouncedSearch = useDebouncedValue(search, 350);

  const filters: LeadFilters = useMemo(
    () => ({
      search: debouncedSearch,
      status: status ? (status as LeadFilters["status"]) : undefined,
      source: source ? (source as LeadFilters["source"]) : undefined,
      sort,
      page
    }),
    [debouncedSearch, page, sort, source, status]
  );

  const { leads, meta, isLoading, error, refresh } = useLeads(filters);

  const resetPage = () => setPage(1);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this lead permanently?");
    if (!confirmed) return;

    setActionError(null);
    try {
      await leadApi.remove(id);
      await refresh();
    } catch (err) {
      setActionError(err instanceof ApiClientError ? err.message : "Unable to delete lead");
    }
  };

  const handleExport = async () => {
    setActionError(null);
    try {
      const csv = await leadApi.exportCsv(filters);
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "leads-export.csv";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      setActionError(err instanceof ApiClientError ? err.message : "Unable to export leads");
    }
  };

  return (
    <AuthGate>
      <AppShell>
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-normal">Leads Dashboard</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Track acquisition quality, ownership, and funnel status.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={handleExport}>
              <Download className="h-4 w-4" />
              Export CSV
            </Button>
            <Link
              href="/leads/new"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-ink-950 px-4 text-sm font-medium text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Plus className="h-4 w-4" />
              New Lead
            </Link>
          </div>
        </div>

        <section className="mb-4 grid gap-3 rounded-md border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:grid-cols-[minmax(220px,1fr)_180px_180px_160px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" aria-hidden="true" />
            <TextInput
              className="pl-9"
              placeholder="Search name or email"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                resetPage();
              }}
            />
          </div>
          <SelectInput
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              resetPage();
            }}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {LEAD_STATUSES.map((leadStatus) => (
              <option key={leadStatus} value={leadStatus}>
                {leadStatus}
              </option>
            ))}
          </SelectInput>
          <SelectInput
            value={source}
            onChange={(event) => {
              setSource(event.target.value);
              resetPage();
            }}
            aria-label="Filter by source"
          >
            <option value="">All sources</option>
            {LEAD_SOURCES.map((leadSource) => (
              <option key={leadSource} value={leadSource}>
                {leadSource}
              </option>
            ))}
          </SelectInput>
          <SelectInput value={sort} onChange={(event) => setSort(event.target.value as LeadSort)} aria-label="Sort leads">
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </SelectInput>
        </section>

        {actionError ? (
          <p className="mb-4 rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
            {actionError}
          </p>
        ) : null}

        <section className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-soft dark:border-slate-800 dark:bg-slate-900">
          {isLoading ? <LoadingState label="Loading leads" /> : null}
          {!isLoading && error ? <ErrorState message={error} onRetry={refresh} /> : null}
          {!isLoading && !error && leads.length === 0 ? (
            <EmptyState title="No leads found" description="Create a lead or adjust the active filters." />
          ) : null}
          {!isLoading && !error && leads.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
                  <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-normal text-slate-500 dark:bg-slate-950 dark:text-slate-400">
                    <tr>
                      <th className="px-4 py-3">Lead</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3">Created</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                        <td className="px-4 py-4">
                          <Link href={`/leads/${lead.id}`} className="font-medium text-slate-950 hover:underline dark:text-white">
                            {lead.name}
                          </Link>
                          <p className="mt-1 text-slate-500 dark:text-slate-400">{lead.email}</p>
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={lead.status} />
                        </td>
                        <td className="px-4 py-4 text-slate-700 dark:text-slate-200">
                          <span className="inline-flex items-center gap-2">
                            <Filter className="h-4 w-4 text-slate-400" />
                            {lead.source}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-slate-500 dark:text-slate-400">
                          {new Date(lead.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/leads/${lead.id}/edit`}
                              className="inline-flex h-9 items-center justify-center rounded-md border border-slate-300 bg-white px-3 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
                            >
                              Edit
                            </Link>
                            <Button variant="danger" className="h-9 px-3" onClick={() => void handleDelete(lead.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination meta={meta} onPageChange={setPage} />
            </>
          ) : null}
        </section>
      </AppShell>
    </AuthGate>
  );
};
