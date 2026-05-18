"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../features/auth/AuthProvider";
import { LoadingState } from "./PageState";

export const AuthGate = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
        <LoadingState label="Checking session" />
      </div>
    );
  }

  return <>{children}</>;
};

export const PublicOnlyGate = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/");
    }
  }, [isLoading, router, user]);

  if (isLoading || user) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
        <LoadingState label="Checking session" />
      </div>
    );
  }

  return <>{children}</>;
};
