import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Event } from "@/types/events";
import { Calendar, Clock, MapPin, Share2, Download } from "lucide-react";
import { getAuxiliaryBadgeVariant } from "@/utils/auxiliaryColors";

interface EventDetailModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
}

export function EventDetailModal({ event, open, onClose }: EventDetailModalProps) {
  if (!event) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long',
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
      return 'West Midlands Mosque, Birmingham';
    }
    return event.location;
  };

  const generateICS = () => {
    const startDateTime = new Date(`${event.start_date}T${event.start_time || '00:00'}:00`);
    const endDateTime = event.end_date && event.end_time 
      ? new Date(`${event.end_date}T${event.end_time}:00`)
      : new Date(startDateTime.getTime() + (event.all_day ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000));

    const formatICSDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//West Midlands Mosque//Calendar//EN',
      'BEGIN:VEVENT',
      `UID:${event.id}@westmidlandsmosque.org`,
      `DTSTART:${formatICSDate(startDateTime)}`,
      `DTEND:${formatICSDate(endDateTime)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${getDisplayLocation()}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addToGoogleCalendar = () => {
    const startDateTime = new Date(`${event.start_date}T${event.start_time || '00:00'}:00`);
    const endDateTime = event.end_date && event.end_time 
      ? new Date(`${event.end_date}T${event.end_time}:00`)
      : new Date(startDateTime.getTime() + (event.all_day ? 24 * 60 * 60 * 1000 : 60 * 60 * 1000));

    const formatGoogleDate = (date: Date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const url = new URL('https://calendar.google.com/calendar/render');
    url.searchParams.append('action', 'TEMPLATE');
    url.searchParams.append('text', event.title);
    url.searchParams.append('dates', `${formatGoogleDate(startDateTime)}/${formatGoogleDate(endDateTime)}`);
    url.searchParams.append('details', event.description || '');
    url.searchParams.append('location', getDisplayLocation());

    window.open(url.toString(), '_blank');
  };

  const shareEvent = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: `${event.title} - ${formatDate(event.start_date)}${event.start_time ? ` at ${formatTime(event.start_time)}` : ''}`,
        url: window.location.href
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={getAuxiliaryBadgeVariant(event.auxiliary)}>{event.auxiliary}</Badge>
              <Badge variant="scope">{event.scope}</Badge>
              {event.is_sports && <Badge variant="sports">Sports</Badge>}
            </div>
            <DialogTitle className="text-xl font-bold text-left text-foreground leading-tight">
              {event.title}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date and Time */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">
                {formatDate(event.start_date)}
                {event.end_date && event.end_date !== event.start_date && (
                  ` - ${formatDate(event.end_date)}`
                )}
              </span>
            </div>
            
            {event.start_time && (
              <div className="flex items-center gap-2 text-foreground ml-7">
                <Clock className="w-4 h-4" />
                <span>
                  {formatTime(event.start_time)}
                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                </span>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="w-5 h-5" />
            <span>{getDisplayLocation()}</span>
          </div>

          {/* Description */}
          {event.description && (
            <div className="bg-surface-subtle p-3 rounded-lg">
              <p className="text-foreground text-sm leading-relaxed">
                {event.description}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">Add to Calendar</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={addToGoogleCalendar}
                  variant="outline"
                  className="min-h-[44px]"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button 
                  onClick={generateICS}
                  variant="outline"
                  className="min-h-[44px]"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>

            <Button 
              onClick={shareEvent}
              variant="outline"
              className="w-full min-h-[44px]"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share Event
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}