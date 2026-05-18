import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface FieldWrapperProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export const FieldWrapper = ({ label, error, children }: FieldWrapperProps) => (
  <label className="block space-y-2">
    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
    {children}
    {error ? <span className="block text-sm text-rose-600">{error}</span> : null}
  </label>
);

export const TextInput = ({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-300 ${className}`}
    {...props}
  />
);

export const SelectInput = ({ className = "", ...props }: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    className={`h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50 dark:focus:border-slate-300 ${className}`}
    {...props}
  />
);
