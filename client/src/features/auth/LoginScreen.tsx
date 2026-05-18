"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "../../components/AuthLayout";
import { Button } from "../../components/Button";
import { FieldWrapper, TextInput } from "../../components/Field";
import { PublicOnlyGate } from "../../components/AuthGate";
import { useAuth } from "./AuthProvider";
import { ApiClientError } from "../../lib/api";

export const LoginScreen = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login({ email, password });
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Unable to login");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicOnlyGate>
      <AuthLayout title="Welcome back" subtitle="Sign in to manage lead pipelines and exports.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldWrapper label="Email">
            <TextInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </FieldWrapper>
          <FieldWrapper label="Password">
            <TextInput
              type="password"
              value={password}
              minLength={8}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </FieldWrapper>
          {error ? (
            <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </Button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            No account?{" "}
            <Link className="font-medium text-slate-950 underline dark:text-white" href="/register">
              Create one
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PublicOnlyGate>
  );
};
