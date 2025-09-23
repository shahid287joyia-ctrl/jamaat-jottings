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
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground border-b border-divider/20 px-4 py-8 shadow-elevated">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold font-arabic">دار البركات</h1>
            <h2 className="text-2xl font-semibold">Darul Barkaat</h2>
            <p className="text-primary-foreground/90 text-lg">Mosque Events Calendar</p>
            <div className="w-16 h-1 bg-primary-foreground/30 rounded-full mx-auto"></div>
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
