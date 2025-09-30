import { Event, FilterState } from "@/types/events";
import { EventCard } from "./EventCard";

interface EventsListProps {
  events: Event[];
  filters: FilterState;
  onEventClick: (event: Event) => void;
}

export function EventsList({ events, filters, onEventClick }: EventsListProps) {
  const getFilteredEvents = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    return events
      .filter(event => {
        // Apply filters
        if (filters.auxiliary !== 'All' && event.auxiliary !== filters.auxiliary) return false;
        if (filters.scope !== 'All' && event.scope !== filters.scope) return false;
        
        // Filter by qiadat only when Local scope is selected
        if (filters.scope === 'Local' && filters.qiadat !== 'All' && event.qiadat !== filters.qiadat) {
          return false;
        }
        
        if (filters.sports_only && !event.is_sports) return false;
        
        // Only show upcoming events by default
        return event.start_date >= today;
      })
      .sort((a, b) => {
        // Sort by date, then by time
        const dateCompare = a.start_date.localeCompare(b.start_date);
        if (dateCompare !== 0) return dateCompare;
        
        const timeA = a.start_time || '00:00';
        const timeB = b.start_time || '00:00';
        return timeA.localeCompare(timeB);
      });
  };

  const filteredEvents = getFilteredEvents();

  if (filteredEvents.length === 0) {
    return (
      <div className="px-4 py-8 text-center">
        <p className="text-text-subtle mb-4">No upcoming events found</p>
        <p className="text-sm text-text-subtle">
          Try adjusting your filters to see more events
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="px-4">
        <h2 className="text-xl font-bold text-foreground">Upcoming Events</h2>
        <p className="text-sm text-text-subtle">{filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="px-4 space-y-3">
        {filteredEvents.map((event) => (
          <EventCard 
            key={event.id} 
            event={event} 
            onEventClick={onEventClick}
          />
        ))}
      </div>
    </div>
  );
}