import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/calendar/FilterBar";
import { WeekendSection } from "@/components/calendar/WeekendSection";
import { EventsList } from "@/components/calendar/EventsList";
import { NamazWidget } from "@/components/calendar/NamazWidget";
import { EventDetailModal } from "@/components/calendar/EventDetailModal";
import { Event, FilterState } from "@/types/events";
import { useEvents, useNamazTimings } from "@/hooks/useSupabaseData";
import { Settings } from "lucide-react";

const Index = () => {
  const { data: events = [], isLoading: eventsLoading } = useEvents();
  const { data: namazTimings = [], isLoading: timingsLoading } = useNamazTimings();
  
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
      <header className="bg-gradient-primary text-primary-foreground border-b border-divider/20 px-4 py-8 shadow-elevated relative">
        <div className="max-w-2xl mx-auto">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-bold font-arabic">دار البركات</h1>
            <h2 className="text-2xl font-semibold">Darul Barkaat</h2>
            <p className="text-primary-foreground/90 text-lg">Mosque Events Calendar</p>
            <div className="w-16 h-1 bg-primary-foreground/30 rounded-full mx-auto"></div>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <Button asChild variant="outline" size="sm" className="text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10">
            <Link to="/auth" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          </Button>
        </div>
      </header>

      {/* Filter Bar */}
      <FilterBar filters={filters} onFiltersChange={setFilters} />

      {/* Main Content */}
      <main className="max-w-2xl mx-auto pb-8">
        <div className="space-y-8">
          {/* Weekend Section */}
          {eventsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-subtle">Loading weekend events...</p>
            </div>
          ) : (
            <WeekendSection 
              events={events}
              filters={filters}
              onEventClick={handleEventClick}
            />
          )}

          {/* Namaz Timings */}
          {timingsLoading ? (
            <div className="mx-4 bg-card border border-divider/50 rounded-xl shadow-card p-8 text-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-subtle">Loading prayer times...</p>
            </div>
          ) : (
            <NamazWidget timings={namazTimings} />
          )}

          {/* Upcoming Events */}
          {eventsLoading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-subtle">Loading events...</p>
            </div>
          ) : (
            <EventsList 
              events={events}
              filters={filters}
              onEventClick={handleEventClick}
            />
          )}
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
