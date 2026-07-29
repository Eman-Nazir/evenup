export default function ExpenseListSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse flex items-center justify-between rounded-xl border border-slate-100 bg-white p-4"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-slate-200" />
            <div className="space-y-2">
              <div className="h-3.5 w-32 rounded bg-slate-200" />
              <div className="h-3 w-20 rounded bg-slate-200" />
            </div>
          </div>
          <div className="h-4 w-14 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  );
}