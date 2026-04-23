export default function DashboardSkeleton() {
  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <div className="h-10 w-64 rounded-lg bg-slate-100 animate-pulse" />
          <div className="h-4 w-80 rounded bg-slate-100 animate-pulse mt-3" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-100 animate-pulse" />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4 mb-10">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="surface-panel p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="h-3 w-28 rounded bg-slate-100 animate-pulse" />
              <div className="h-5 w-5 rounded bg-slate-100 animate-pulse" />
            </div>
            <div className="h-10 w-20 rounded-lg bg-slate-100 animate-pulse mt-1" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="surface-panel xl:col-span-2">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="h-6 w-48 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-16 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="space-y-3 px-4 pb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
        <div className="surface-panel">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="h-6 w-32 rounded bg-slate-100 animate-pulse" />
            <div className="h-4 w-16 rounded bg-slate-100 animate-pulse" />
          </div>
          <div className="space-y-3 px-4 pb-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
