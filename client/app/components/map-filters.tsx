import { Problem } from "@/lib/types";

interface MapFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  activeFilters: FilterState;
}

export interface FilterState {
  minSeverity: number;
  showVerifiedOnly: boolean;
  category: string | "all";
}

export function MapFilters({ onFilterChange, activeFilters }: MapFiltersProps) {
  const categories = [
    "all",
    "Water & Sanitation",
    "Healthcare",
    "Education",
    "Roads & Infrastructure",
    "Public Safety",
    "Environment"
  ];

  const handleSeverityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...activeFilters, minSeverity: parseInt(e.target.value) });
  };

  const handleVerifiedChange = () => {
    onFilterChange({ ...activeFilters, showVerifiedOnly: !activeFilters.showVerifiedOnly });
  };

  const handleCategoryChange = (val: string) => {
    onFilterChange({ ...activeFilters, category: val });
  };

  return (
    <div className="geist-card p-3 space-y-4 bg-[var(--ds-background-200)]/90 backdrop-blur-md min-w-[200px]">
      <h3 className="text-[var(--ds-gray-1000)] text-xs font-semibold uppercase tracking-wider">Filters</h3>
      
      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-[11px] text-[var(--ds-gray-700)] font-medium">Category</label>
        <select 
          value={activeFilters.category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full bg-[var(--ds-background-100)] border border-[var(--ds-gray-400)] text-[var(--ds-gray-1000)] text-xs rounded px-2 py-1.5 focus:border-[var(--ds-blue-500)] outline-none"
        >
          {categories.map(c => (
            <option key={c} value={c}>{c === "all" ? "All Categories" : c}</option>
          ))}
        </select>
      </div>

      {/* Severity Filter */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-[11px] text-[var(--ds-gray-700)] font-medium">Min Severity</label>
          <span className="text-[10px] text-[var(--ds-blue-700)] bg-[var(--ds-blue-200)] px-1.5 py-0.5 rounded font-mono">
            {activeFilters.minSeverity}+
          </span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="100" 
          step="10"
          value={activeFilters.minSeverity}
          onChange={handleSeverityChange}
          className="w-full accent-[var(--ds-gray-1000)] h-1 bg-[var(--ds-gray-400)] rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-[var(--ds-gray-500)]">
          <span>Low</span>
          <span>Critical</span>
        </div>
      </div>

      {/* Verified Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-[11px] text-[var(--ds-gray-700)] font-medium">Verified Only</label>
        <button 
          onClick={handleVerifiedChange}
          className={`w-8 h-4 rounded-full transition-colors relative ${activeFilters.showVerifiedOnly ? "bg-[var(--ds-green-500)]" : "bg-[var(--ds-gray-400)]"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${activeFilters.showVerifiedOnly ? "translate-x-4" : "translate-x-0"}`} />
        </button>
      </div>
    </div>
  );
}
