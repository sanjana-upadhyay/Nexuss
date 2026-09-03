export const Skeleton = ({ className = "" }) => (
  <div className={`animate-pulse bg-[#262220] rounded-lg ${className}`} />
);

export const WorkspaceCardSkeleton = () => (
  <div className="rounded-2xl border border-[#33302c] overflow-hidden bg-[#1c1917]">
    <Skeleton className="w-full h-44 rounded-none" />
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
);