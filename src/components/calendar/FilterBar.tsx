import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Auxiliary, Scope, FilterState } from "@/types/events";

interface FilterBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const auxiliaries: (Auxiliary | 'All')[] = ['All', 'Atfal', 'Khuddam', 'Lajna', 'Ansar'];
const scopes: (Scope | 'All')[] = ['All', 'Local', 'Regional', 'National'];

export function FilterBar({ filters, onFiltersChange }: FilterBarProps) {
  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const resetFilters = () => {
    onFiltersChange({ auxiliary: 'All', scope: 'All', sports_only: false });
  };

  const hasActiveFilters = filters.auxiliary !== 'All' || filters.scope !== 'All' || filters.sports_only;

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-divider p-4 space-y-4">
      {/* Auxiliary Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Auxiliary</label>
        <div className="flex flex-wrap gap-2">
          {auxiliaries.map((auxiliary) => (
            <button
              key={auxiliary}
              onClick={() => updateFilter('auxiliary', auxiliary)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth border min-h-[44px] ${
                filters.auxiliary === auxiliary
                  ? 'bg-filter-active text-primary-foreground border-filter-active'
                  : 'bg-filter-inactive text-foreground border-divider hover:bg-muted'
              }`}
            >
              {auxiliary}
            </button>
          ))}
        </div>
      </div>

      {/* Scope & Sports Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Scope Filter */}
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-foreground">Scope</label>
          <div className="flex flex-wrap gap-2">
            {scopes.map((scope) => (
              <button
                key={scope}
                onClick={() => updateFilter('scope', scope)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth border min-h-[44px] ${
                  filters.scope === scope
                    ? 'bg-filter-active text-primary-foreground border-filter-active'
                    : 'bg-filter-inactive text-foreground border-divider hover:bg-muted'
                }`}
              >
                {scope}
              </button>
            ))}
          </div>
        </div>

        {/* Sports Toggle */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Filter</label>
          <div className="flex gap-2">
            <button
              onClick={() => updateFilter('sports_only', !filters.sports_only)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-smooth border min-h-[44px] ${
                filters.sports_only
                  ? 'bg-filter-active text-primary-foreground border-filter-active'
                  : 'bg-filter-inactive text-foreground border-divider hover:bg-muted'
              }`}
            >
              Sports Only
            </button>
            
            {hasActiveFilters && (
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-full text-sm min-h-[44px]"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}