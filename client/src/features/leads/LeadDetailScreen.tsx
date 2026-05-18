"use client";

import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { AuthGate } from "../../components/AuthGate";
import { ErrorState, LoadingState } from "../../components/PageState";
import { StatusBadge } from "../../components/StatusBadge";
import { ApiClientError } from "../../lib/api";
import type { Lead } from "../../types/lead";
import { leadApi } from "./leadApi";

export const LeadDetailScreen = ({ id }: { id: string }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadLead = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await leadApi.detail(id);
        setLead(response.data);
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : "Unable to load lead");
      } finally {
        setIsLoading(false);
      }
    };

    void loadLead();
  }, [id]);

  return (
    <AuthGate>
      <AppShell>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to dashboard
            </Link>
            {lead ? (
              <Link
                href={`/leads/${lead.id}/edit`}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
              >
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            ) : null}
          </div>

          {isLoading ? <LoadingState label="Loading lead" /> : null}
          {!isLoading && error ? <ErrorState message={error} /> : null}
          {!isLoading && lead ? (
            <article className="rounded-md border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 dark:border-slate-800 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold">{lead.name}</h1>
                  <p className="mt-2 text-slate-500 dark:text-slate-400">{lead.email}</p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
              <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
                  <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-400">Source</dt>
                  <dd className="mt-2 text-sm font-medium">{lead.source}</dd>
                </div>
                <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
                  <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-400">Created</dt>
                  <dd className="mt-2 text-sm font-medium">{new Date(lead.createdAt).toLocaleString()}</dd>
                </div>
                <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
                  <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-400">Updated</dt>
                  <dd className="mt-2 text-sm font-medium">{new Date(lead.updatedAt).toLocaleString()}</dd>
                </div>
                <div className="rounded-md bg-slate-50 p-4 dark:bg-slate-950">
                  <dt className="text-xs font-semibold uppercase tracking-normal text-slate-500 dark:text-slate-400">Owner ID</dt>
                  <dd className="mt-2 break-all text-sm font-medium">{lead.createdBy}</dd>
                </div>
              </dl>
            </article>
          ) : null}
        </div>
      </AppShell>
    </AuthGate>
  );
};
