import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NamazTiming } from "@/types/events";
import { ChevronDown, ChevronUp } from "lucide-react";

interface NamazWidgetProps {
  timings: NamazTiming[];
}

export function NamazWidget({ timings }: NamazWidgetProps) {
  const [expanded, setExpanded] = useState(false);

  const toLocalDateKey = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = toLocalDateKey(new Date());
  const todayTiming = timings.find(t => t.date === today);

  const getWeekTimings = () => {
    const startOfWeek = new Date();
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday
    startOfWeek.setDate(diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(toLocalDateKey(date));
    }

    return weekDates.map(date => 
      timings.find(t => t.date === date) || {
        date,
        fajr: '--:--',
        zuhr: '--:--',
        asr: '--:--',
        maghrib: '--:--',
        isha: '--:--'
      }
    );
  };

  const formatTime = (time: string) => {
    if (time === '--:--') return time;
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const formatDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, (m || 1) - 1, d || 1);
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  if (!todayTiming && !expanded) {
    return (
      <Card className="mx-4 p-4 border border-divider">
        <div className="text-center">
          <h3 className="font-semibold text-foreground mb-2">Namaz Timings</h3>
          <p className="text-text-subtle text-sm">No timings available for today</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="mx-4 bg-card border border-divider/50 rounded-xl shadow-card overflow-hidden">
      <div className="bg-gradient-primary text-primary-foreground p-4" role="region" aria-label="Namaz timings">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">
              {expanded ? "This Week's Namaz Timings" : "Today's Namaz Timings"}
            </h3>
            <p className="text-xs text-primary-foreground/80">Darul Barkaat (Europe/London)</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="min-h-[44px] text-primary-foreground hover:bg-primary-foreground/10"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {!expanded && todayTiming ? (
          // Today's timings
          <div className="grid grid-cols-5 gap-3 text-sm">
            <div className="text-center">
              <p className="text-text-subtle font-medium">Fajr</p>
              <p className="font-semibold text-foreground">{formatTime(todayTiming.fajr)}</p>
            </div>
            <div className="text-center">
              <p className="text-text-subtle font-medium">Zuhr</p>
              <p className="font-semibold text-foreground">{formatTime(todayTiming.zuhr)}</p>
            </div>
            <div className="text-center">
              <p className="text-text-subtle font-medium">Asr</p>
              <p className="font-semibold text-foreground">{formatTime(todayTiming.asr)}</p>
            </div>
            <div className="text-center">
              <p className="text-text-subtle font-medium">Maghrib</p>
              <p className="font-semibold text-foreground">{formatTime(todayTiming.maghrib)}</p>
            </div>
            <div className="text-center">
              <p className="text-text-subtle font-medium">Isha</p>
              <p className="font-semibold text-foreground">{formatTime(todayTiming.isha)}</p>
            </div>
          </div>
        ) : expanded ? (
          // Week view
          <div className="space-y-2">
            {getWeekTimings().map((timing) => (
              <div key={timing.date} className={`grid grid-cols-6 gap-2 py-2 px-2 rounded text-sm ${
                timing.date === today ? 'bg-surface-elevated' : ''
              }`}>
                <div className="font-medium text-foreground text-xs">
                  {formatDate(timing.date)}
                </div>
                <div className="text-center text-foreground">
                  {formatTime(timing.fajr)}
                </div>
                <div className="text-center text-foreground">
                  {formatTime(timing.zuhr)}
                </div>
                <div className="text-center text-foreground">
                  {formatTime(timing.asr)}
                </div>
                <div className="text-center text-foreground">
                  {formatTime(timing.maghrib)}
                </div>
                <div className="text-center text-foreground">
                  {formatTime(timing.isha)}
                </div>
              </div>
            ))}
            
            {/* Header row */}
            <div className="grid grid-cols-6 gap-2 py-1 text-xs text-text-subtle font-medium border-t border-divider mt-2 pt-2">
              <div></div>
              <div className="text-center">Fajr</div>
              <div className="text-center">Zuhr</div>
              <div className="text-center">Asr</div>
              <div className="text-center">Maghrib</div>
              <div className="text-center">Isha</div>
            </div>
          </div>
        ) : null}

        {todayTiming?.jumuah_1 && !expanded && new Date().getDay() === 5 && (
          <div className="border-t border-divider pt-3">
            <p className="text-sm text-text-subtle mb-2">Jumuah Prayers</p>
            <div className="flex gap-4 text-sm">
              <div>
                <p className="text-text-subtle">First</p>
                <p className="font-semibold text-foreground">{formatTime(todayTiming.jumuah_1)}</p>
              </div>
              {todayTiming.jumuah_2 && (
                <div>
                  <p className="text-text-subtle">Second</p>
                  <p className="font-semibold text-foreground">{formatTime(todayTiming.jumuah_2)}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}