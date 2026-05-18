"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "../../components/AppShell";
import { AuthGate } from "../../components/AuthGate";
import { Button } from "../../components/Button";
import { FieldWrapper, SelectInput, TextInput } from "../../components/Field";
import { ErrorState, LoadingState } from "../../components/PageState";
import { ApiClientError } from "../../lib/api";
import { LEAD_SOURCES, LEAD_STATUSES, type LeadFormValues } from "../../types/lead";
import { leadApi } from "./leadApi";

const initialValues: LeadFormValues = {
  name: "",
  email: "",
  status: "New",
  source: "Website"
};

export const LeadFormScreen = ({ id, mode }: { id?: string; mode: "create" | "edit" }) => {
  const router = useRouter();
  const [values, setValues] = useState<LeadFormValues>(initialValues);
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "edit" || !id) return;

    const loadLead = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await leadApi.detail(id);
        setValues({
          name: response.data.name,
          email: response.data.email,
          status: response.data.status,
          source: response.data.source
        });
      } catch (err) {
        setError(err instanceof ApiClientError ? err.message : "Unable to load lead");
      } finally {
        setIsLoading(false);
      }
    };

    void loadLead();
  }, [id, mode]);

  const updateValue = <K extends keyof LeadFormValues>(key: K, value: LeadFormValues[K]) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (mode === "edit" && id) {
        await leadApi.update(id, values);
        router.push(`/leads/${id}`);
      } else {
        const response = await leadApi.create(values);
        router.push(`/leads/${response.data.id}`);
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Unable to save lead");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGate>
      <AppShell>
        <div className="mx-auto max-w-2xl">
          <div className="mb-6">
            <Link href="/" className="text-sm font-medium text-slate-600 hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
              Back to dashboard
            </Link>
            <h1 className="mt-3 text-2xl font-semibold">{mode === "edit" ? "Edit Lead" : "Create Lead"}</h1>
          </div>

          {isLoading ? <LoadingState label="Loading lead" /> : null}
          {!isLoading && error && mode === "edit" ? <ErrorState message={error} /> : null}
          {!isLoading && (!error || mode === "create") ? (
            <form
              onSubmit={handleSubmit}
              className="space-y-5 rounded-md border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900"
            >
              <FieldWrapper label="Name">
                <TextInput
                  value={values.name}
                  minLength={2}
                  maxLength={100}
                  onChange={(event) => updateValue("name", event.target.value)}
                  required
                />
              </FieldWrapper>
              <FieldWrapper label="Email">
                <TextInput
                  type="email"
                  value={values.email}
                  onChange={(event) => updateValue("email", event.target.value)}
                  required
                />
              </FieldWrapper>
              <FieldWrapper label="Status">
                <SelectInput
                  value={values.status}
                  onChange={(event) => updateValue("status", event.target.value as LeadFormValues["status"])}
                >
                  {LEAD_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </SelectInput>
              </FieldWrapper>
              <FieldWrapper label="Source">
                <SelectInput
                  value={values.source}
                  onChange={(event) => updateValue("source", event.target.value as LeadFormValues["source"])}
                >
                  {LEAD_SOURCES.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </SelectInput>
              </FieldWrapper>
              {error ? (
                <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
                  {error}
                </p>
              ) : null}
              <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Lead"}
                </Button>
              </div>
            </form>
          ) : null}
        </div>
      </AppShell>
    </AuthGate>
  );
};
