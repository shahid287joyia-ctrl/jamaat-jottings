import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";
import { Calendar, Clock, MapPin, Share2 } from "lucide-react";

interface EventCardProps {
  event: Event;
  onEventClick: (event: Event) => void;
}

export function EventCard({ event, onEventClick }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getDisplayLocation = () => {
    if (event.scope === 'Local' || event.scope === 'Regional') {
      return 'Darul Barkaat';
    }
    return event.location;
  };

  const shareEvent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `${event.title} - ${formatDate(event.start_date)}${event.start_time ? ` at ${formatTime(event.start_time)}` : ''}`,
        url: window.location.href
      });
    }
  };

  return (
    <Card 
      className="p-4 cursor-pointer transition-smooth hover:shadow-elevated border border-divider"
      onClick={() => onEventClick(event)}
    >
      <div className="space-y-3">
        {/* Header with title and badges */}
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <Badge variant="auxiliary">{event.auxiliary}</Badge>
            <Badge variant="scope">{event.scope}</Badge>
            {event.is_sports && <Badge variant="sports">Sports</Badge>}
          </div>
          <h3 className="font-semibold text-lg text-foreground leading-tight">
            {event.title}
          </h3>
        </div>

        {/* Date and Time */}
        <div className="flex items-center gap-2 text-text-subtle">
          <Calendar className="w-4 h-4" />
          <span className="text-sm">
            {formatDate(event.start_date)}
            {event.start_time && (
              <>
                <Clock className="w-4 h-4 ml-3 mr-1 inline" />
                {formatTime(event.start_time)}
                {event.end_time && ` - ${formatTime(event.end_time)}`}
              </>
            )}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-text-subtle">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{getDisplayLocation()}</span>
        </div>

        {/* Description */}
        {event.description && (
          <p className="text-sm text-text-subtle line-clamp-2">
            {event.description}
          </p>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEventClick(event);
            }}
            className="flex-1 min-h-[44px]"
          >
            <Calendar className="w-4 h-4 mr-2" />
            Add to Calendar
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={shareEvent}
            className="min-h-[44px]"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}