import { Card } from "@/components/ui/card";
import { Event, FilterState } from "@/types/events";
import { EventCard } from "./EventCard";

interface WeekendSectionProps {
  events: Event[];
  filters: FilterState;
  onEventClick: (event: Event) => void;
}

export function WeekendSection({ events, filters, onEventClick }: WeekendSectionProps) {
  const getWeekendEvents = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Find next Friday-Sunday window
    let startDate: Date;
    if (now.getDay() >= 5) {
      // If today is Friday (5), Saturday (6), or Sunday (0), use current weekend
      const daysToFriday = now.getDay() === 0 ? -2 : 5 - now.getDay();
      startDate = new Date(today);
      startDate.setDate(today.getDate() + daysToFriday);
    } else {
      // Otherwise, find next Friday
      const daysToFriday = 5 - now.getDay();
      startDate = new Date(today);
      startDate.setDate(today.getDate() + daysToFriday);
    }
    
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 2); // Sunday
    
    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];
    
    return events.filter(event => {
      // Apply filters
      if (filters.auxiliary !== 'All' && event.auxiliary !== filters.auxiliary) return false;
      if (filters.scope !== 'All' && event.scope !== filters.scope) return false;
      
      // Filter by qiadat only when Local scope is selected
      if (filters.scope === 'Local' && filters.qiadat !== 'All' && event.qiadat !== filters.qiadat) {
        return false;
      }
      
      if (filters.sports_only && !event.is_sports) return false;
      
      // Check if event falls in weekend
      return event.start_date >= startStr && event.start_date <= endStr;
    });
  };

  const weekendEvents = getWeekendEvents();
  const isCurrentWeekend = new Date().getDay() >= 5 || new Date().getDay() === 0;
  const weekendTitle = isCurrentWeekend ? "This Weekend" : "Next Weekend";

  return (
    <div className="space-y-4">
      <div className="px-4">
        <div className="bg-gradient-primary text-primary-foreground p-4 rounded-xl shadow-card">
          <h2 className="text-xl font-bold">{weekendTitle}</h2>
          <p className="text-primary-foreground/80">Friday - Sunday</p>
        </div>
      </div>
      
      {weekendEvents.length > 0 ? (
        <div className="px-4 space-y-3">
          {weekendEvents.map((event) => (
            <EventCard 
              key={event.id} 
              event={event} 
              onEventClick={onEventClick}
            />
          ))}
        </div>
      ) : (
        <div className="px-4">
          <div className="bg-surface-elevated border border-divider p-6 text-center rounded-xl">
            <p className="text-text-subtle">No events this weekend</p>
          </div>
        </div>
      )}
    </div>
  );
}
