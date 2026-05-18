import { AlertCircle, Inbox } from "lucide-react";
import { Button } from "./Button";

export const LoadingState = ({ label = "Loading" }: { label?: string }) => (
  <div className="flex min-h-52 items-center justify-center rounded-md border border-slate-200 bg-white text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
    {label}...
  </div>
);

export const EmptyState = ({ title, description }: { title: string; description: string }) => (
  <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-md border border-dashed border-slate-300 bg-white p-8 text-center dark:border-slate-700 dark:bg-slate-900">
    <Inbox className="h-8 w-8 text-slate-400" aria-hidden="true" />
    <div>
      <h3 className="font-semibold text-slate-950 dark:text-slate-50">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  </div>
);

export const ErrorState = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-md border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900 dark:bg-rose-950/30">
    <AlertCircle className="h-8 w-8 text-rose-600" aria-hidden="true" />
    <p className="text-sm font-medium text-rose-700 dark:text-rose-200">{message}</p>
    {onRetry ? (
      <Button variant="secondary" onClick={onRetry}>
        Retry
      </Button>
    ) : null}
  </div>
);
