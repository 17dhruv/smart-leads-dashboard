"use client";

import { AuthProvider } from "../features/auth/AuthProvider";

export const Providers = ({ children }: { children: React.ReactNode }) => <AuthProvider>{children}</AuthProvider>;
