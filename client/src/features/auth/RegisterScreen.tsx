"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout } from "../../components/AuthLayout";
import { Button } from "../../components/Button";
import { FieldWrapper, SelectInput, TextInput } from "../../components/Field";
import { PublicOnlyGate } from "../../components/AuthGate";
import { useAuth } from "./AuthProvider";
import { ApiClientError } from "../../lib/api";
import type { UserRole } from "../../types/auth";

export const RegisterScreen = () => {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("sales");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await register({ name, email, password, role });
      router.replace("/");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Unable to register");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PublicOnlyGate>
      <AuthLayout title="Create account" subtitle="Register as an admin or sales user for the assignment demo.">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldWrapper label="Name">
            <TextInput value={name} minLength={2} onChange={(event) => setName(event.target.value)} required />
          </FieldWrapper>
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
          <FieldWrapper label="Role">
            <SelectInput value={role} onChange={(event) => setRole(event.target.value as UserRole)}>
              <option value="sales">Sales User</option>
              <option value="admin">Admin</option>
            </SelectInput>
          </FieldWrapper>
          {error ? (
            <p className="rounded-md bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
              {error}
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-center text-sm text-slate-500 dark:text-slate-400">
            Already registered?{" "}
            <Link className="font-medium text-slate-950 underline dark:text-white" href="/login">
              Sign in
            </Link>
          </p>
        </form>
      </AuthLayout>
    </PublicOnlyGate>
  );
};
