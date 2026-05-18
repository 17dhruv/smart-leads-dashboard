"use client";

import { LogOut, Moon, Sun, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../features/auth/AuthProvider";
import { Button } from "./Button";

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-ink-950 text-white dark:bg-white dark:text-slate-950">
              <Users className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-base font-semibold">Smart Leads</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Management dashboard</p>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            {user ? (
              <span className="rounded-md bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                {user.name} · {user.role}
              </span>
            ) : null}
            <Button variant="secondary" onClick={toggleDarkMode} aria-label="Toggle dark mode">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
};
