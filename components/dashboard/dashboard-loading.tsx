import {Skeleton} from "@/components/ui/skeleton";

/** Route-level skeleton matching the dashboard's final layout. */
export function DashboardLoading() {
  return (
      <div
          className="min-h-screen bg-slate-100 px-4 py-4 text-slate-950 dark:bg-slate-950 dark:text-slate-50 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-370 gap-6">
          <aside
              className="hidden w-64 shrink-0 rounded-lg border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 lg:block">
            <Skeleton className="h-9 w-36"/>
            <div className="mt-8 space-y-3">
              {Array.from({length: 6}).map((_, index) => (
                  <Skeleton className="h-9 w-full" key={index}/>
              ))}
            </div>
          </aside>
          <main className="min-w-0 flex-1 space-y-5">
            <div
                className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <Skeleton className="h-8 w-56"/>
                <Skeleton className="mt-3 h-4 w-80 max-w-full"/>
              </div>
              <Skeleton className="h-10 w-36"/>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {Array.from({length: 4}).map((_, index) => (
                  <Skeleton className="h-36" key={index}/>
              ))}
            </div>
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
              <Skeleton className="h-105"/>
              <Skeleton className="h-105"/>
            </div>
            <Skeleton className="h-130"/>
          </main>
        </div>
      </div>
  );
}
