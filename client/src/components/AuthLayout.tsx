"use client";

import { Moon, Sun, Users } from "lucide-react";
import Link from "next/link";
import { Button } from "./Button";
import { useDarkMode } from "../hooks/useDarkMode";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthLayout = ({ title, subtitle, children }: AuthLayoutProps) => {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto flex max-w-md flex-col gap-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink-950 text-white dark:bg-white dark:text-slate-950">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="font-semibold">Smart Leads</span>
          </Link>
          <Button variant="secondary" onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
        <section className="rounded-md border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold">{title}</h1>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          </div>
          {children}
        </section>
      </div>
    </div>
  );
};
