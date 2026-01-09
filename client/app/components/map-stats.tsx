import { Problem } from "@/lib/types";
interface MapStatsProps {
  problems: Problem[];
}

export function MapStats({ problems }: MapStatsProps) {
  const total = problems.length;
  const critical = problems.filter(p => (p.severityScore || 0) >= 80).length;
  const high = problems.filter(p => (p.severityScore || 0) >= 50 && (p.severityScore || 0) < 80).length;
  const verified = problems.filter(p => p.verificationCount > 0).length;

  return (
    <div className="geist-card p-3 space-y-3 bg-[var(--ds-background-200)]/90 backdrop-blur-md min-w-[200px]">
      <h3 className="text-[var(--ds-gray-1000)] text-xs font-semibold uppercase tracking-wider">Area Insights</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-[var(--ds-gray-200)] p-2 rounded-md">
          <p className="text-[var(--ds-gray-700)] text-[10px]">Total Issues</p>
          <p className="text-[var(--ds-gray-1000)] text-xl font-bold">{total}</p>
        </div>
        <div className="bg-[var(--ds-blue-200)]/20 p-2 rounded-md border border-[var(--ds-blue-200)]">
          <p className="text-[var(--ds-blue-700)] text-[10px]">Verified</p>
          <p className="text-[var(--ds-blue-700)] text-xl font-bold">{verified}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--ds-red-700)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-red-500)]"></span>
            Critical
          </span>
          <span className="font-mono text-[var(--ds-gray-1000)]">{critical}</span>
        </div>
        <div className="w-full h-1 bg-[var(--ds-gray-200)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--ds-red-500)]" style={{ width: `${total ? (critical / total) * 100 : 0}%` }}></div>
        </div>
        
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-[var(--ds-amber-700)] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--ds-amber-500)]"></span>
            High Priority
          </span>
          <span className="font-mono text-[var(--ds-gray-1000)]">{high}</span>
        </div>
        <div className="w-full h-1 bg-[var(--ds-gray-200)] rounded-full overflow-hidden">
          <div className="h-full bg-[var(--ds-amber-500)]" style={{ width: `${total ? (high / total) * 100 : 0}%` }}></div>
        </div>
      </div>
    </div>
  );
}
