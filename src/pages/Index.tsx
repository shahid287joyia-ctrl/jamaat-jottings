import { useState } from "react";
import { FilterBar } from "@/components/calendar/FilterBar";
import { WeekendSection } from "@/components/calendar/WeekendSection";
import { EventsList } from "@/components/calendar/EventsList";
import { NamazWidget } from "@/components/calendar/NamazWidget";
import { EventDetailModal } from "@/components/calendar/EventDetailModal";
import { mockEvents, mockNamazTimings } from "@/data/mockData";
import { Event, FilterState } from "@/types/events";

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    auxiliary: 'All',
    scope: 'All',
    sports_only: false
  });

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background border-b border-divider px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Darul Barkaat</h1>
            <p className="text-text-subtle">Mosque Events Calendar</p>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto pb-8">
        <div className="space-y-8">
          {/* Weekend Section */}
          <WeekendSection 
            events={mockEvents}
            filters={filters}
            onEventClick={handleEventClick}
          />

          {/* Namaz Timings */}
          <NamazWidget timings={mockNamazTimings} />

          {/* Upcoming Events */}
          <EventsList 
            events={mockEvents}
            filters={filters}
            onEventClick={handleEventClick}
          />
        </div>
      </main>

      {/* Event Detail Modal */}
      <EventDetailModal 
        event={selectedEvent}
        open={modalOpen}
        onClose={handleModalClose}
      />

      {/* Footer */}
      <footer className="bg-surface-subtle border-t border-divider mt-12 py-6">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-sm text-text-subtle">
            Darul Barkaat Mosque, Birmingham
          </p>
          <p className="text-xs text-text-subtle mt-1">
            Event times in Europe/London timezone
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
