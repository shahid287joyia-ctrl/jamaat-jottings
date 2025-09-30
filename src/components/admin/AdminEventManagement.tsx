import { useState } from 'react';
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from '@/hooks/useSupabaseData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { getAuxiliaryBadgeVariant } from '@/utils/auxiliaryColors';
import { Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { Event, Auxiliary, Scope, AdminRole, Qiadat } from '@/types/events';

export const AdminEventManagement = () => {
  const { data: events = [], isLoading } = useEvents();
  const createEventMutation = useCreateEvent();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();
  const { toast } = useToast();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const handleCreateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Get current user from session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      toast({
        title: 'Authentication Error',
        description: 'You must be logged in to create events.',
        variant: 'destructive',
      });
      return;
    }
    
    const scope = formData.get('scope') as Scope;
    const eventData = {
      title: formData.get('title') as string,
      auxiliary: formData.get('auxiliary') as Auxiliary,
      scope,
      qiadat: scope === 'Local' ? (formData.get('qiadat') as Qiadat) : undefined,
      is_sports: formData.get('is_sports') === 'on',
      start_date: formData.get('start_date') as string,
      start_time: formData.get('start_time') as string || undefined,
      end_date: formData.get('end_date') as string || undefined,
      end_time: formData.get('end_time') as string || undefined,
      all_day: formData.get('all_day') === 'on',
      location: formData.get('location') as string,
      description: formData.get('description') as string || undefined,
      recurrence_rule: formData.get('recurrence_rule') as string || undefined,
      created_by: session.user.id,
      created_by_role: formData.get('created_by_role') as AdminRole,
    };

    await createEventMutation.mutateAsync(eventData);
    setIsCreateDialogOpen(false);
  };

  const handleUpdateEvent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedEvent) return;

    const formData = new FormData(e.currentTarget);
    
    const scope = formData.get('scope') as Scope;
    const eventData = {
      id: selectedEvent.id,
      title: formData.get('title') as string,
      auxiliary: formData.get('auxiliary') as Auxiliary,
      scope,
      qiadat: scope === 'Local' ? (formData.get('qiadat') as Qiadat) : undefined,
      is_sports: formData.get('is_sports') === 'on',
      start_date: formData.get('start_date') as string,
      start_time: formData.get('start_time') as string || undefined,
      end_date: formData.get('end_date') as string || undefined,
      end_time: formData.get('end_time') as string || undefined,
      all_day: formData.get('all_day') === 'on',
      location: formData.get('location') as string,
      description: formData.get('description') as string || undefined,
      recurrence_rule: formData.get('recurrence_rule') as string || undefined,
    };

    await updateEventMutation.mutateAsync(eventData);
    setIsEditDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      await deleteEventMutation.mutateAsync(eventId);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center space-y-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Event Management</CardTitle>
            <CardDescription>Create, edit, and manage mosque events</CardDescription>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Event</DialogTitle>
                <DialogDescription>Add a new event to the mosque calendar</DialogDescription>
              </DialogHeader>
              <EventForm onSubmit={handleCreateEvent} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {events.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No events found. Create your first event!
              </div>
            ) : (
              events.map((event) => (
                <div key={event.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{event.title}</h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant={getAuxiliaryBadgeVariant(event.auxiliary)}>
                          {event.auxiliary}
                        </Badge>
                        <Badge variant="outline">{event.scope}</Badge>
                        {event.scope === 'Local' && event.qiadat && (
                          <Badge variant="outline">{event.qiadat}</Badge>
                        )}
                        {event.is_sports && <Badge variant="secondary">Sports</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(event.start_date)}
                          {event.start_time && ` at ${event.start_time}`}
                        </span>
                        <span>{event.location}</span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedEvent(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Edit Event</DialogTitle>
                            <DialogDescription>Update event details</DialogDescription>
                          </DialogHeader>
                          {selectedEvent && (
                            <EventForm onSubmit={handleUpdateEvent} event={selectedEvent} />
                          )}
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface EventFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  event?: Event;
}

const EventForm = ({ onSubmit, event }: EventFormProps) => {
  const [selectedScope, setSelectedScope] = useState<Scope | undefined>(event?.scope);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            defaultValue={event?.title}
            placeholder="Event title"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            defaultValue={event?.location}
            placeholder="Event location"
            required
          />
        </div>
      </div>

      <div className={`grid gap-4 ${selectedScope === 'Local' ? 'grid-cols-2' : 'grid-cols-3'}`}>
        <div className="space-y-2">
          <Label htmlFor="auxiliary">Auxiliary</Label>
          <Select name="auxiliary" defaultValue={event?.auxiliary} required>
            <SelectTrigger>
              <SelectValue placeholder="Select auxiliary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Atfal">Atfal</SelectItem>
              <SelectItem value="Khuddam">Khuddam</SelectItem>
              <SelectItem value="Lajna">Lajna</SelectItem>
              <SelectItem value="Ansar">Ansar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="scope">Scope</Label>
          <Select 
            name="scope" 
            defaultValue={event?.scope} 
            onValueChange={(value) => setSelectedScope(value as Scope)}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Local">Local</SelectItem>
              <SelectItem value="Regional">Regional</SelectItem>
              <SelectItem value="National">National</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedScope === 'Local' && (
          <div className="space-y-2">
            <Label htmlFor="qiadat">Qiadat</Label>
            <Select name="qiadat" defaultValue={event?.qiadat} required>
              <SelectTrigger>
                <SelectValue placeholder="Select qiadat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Solihull">Solihull</SelectItem>
                <SelectItem value="South">South</SelectItem>
                <SelectItem value="West">West</SelectItem>
                <SelectItem value="Central">Central</SelectItem>
                <SelectItem value="North">North</SelectItem>
                <SelectItem value="Walsall">Walsall</SelectItem>
                <SelectItem value="Wolverhampton">Wolverhampton</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="created_by_role">Your Role</Label>
          <Select name="created_by_role" defaultValue={event?.created_by_role} required>
            <SelectTrigger>
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mosque Manager">Mosque Manager</SelectItem>
              <SelectItem value="Local Nazim">Local Nazim</SelectItem>
              <SelectItem value="Qaid">Qaid</SelectItem>
              <SelectItem value="Sadar Jamaat">Sadar Jamaat</SelectItem>
              <SelectItem value="Murabbi">Murabbi</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            defaultValue={event?.start_date}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="start_time">Start Time</Label>
          <Input
            id="start_time"
            name="start_time"
            type="time"
            defaultValue={event?.start_time}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="end_date">End Date (Optional)</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            defaultValue={event?.end_date}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end_time">End Time (Optional)</Label>
          <Input
            id="end_time"
            name="end_time"
            type="time"
            defaultValue={event?.end_time}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={event?.description}
          placeholder="Event description"
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <Switch
            id="all_day"
            name="all_day"
            defaultChecked={event?.all_day}
          />
          <Label htmlFor="all_day">All Day Event</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="is_sports"
            name="is_sports"
            defaultChecked={event?.is_sports}
          />
          <Label htmlFor="is_sports">Sports Event</Label>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="recurrence_rule">Recurrence Rule (Optional)</Label>
        <Input
          id="recurrence_rule"
          name="recurrence_rule"
          defaultValue={event?.recurrence_rule}
          placeholder="e.g., weekly, monthly"
        />
      </div>

      <Button type="submit" className="w-full">
        {event ? 'Update Event' : 'Create Event'}
      </Button>
    </form>
  );
};