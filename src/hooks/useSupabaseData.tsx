import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Event, NamazTiming } from '@/types/events';
import { useToast } from '@/components/ui/use-toast';

// Events hooks
export const useEvents = () => {
  return useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });
      
      if (error) throw error;
      
      return data.map((event: any): Event => ({
        id: event.id,
        title: event.title,
        auxiliary: event.auxiliary,
        scope: event.scope,
        is_sports: event.is_sports,
        start_date: event.start_date,
        start_time: event.start_time,
        end_date: event.end_date,
        end_time: event.end_time,
        all_day: event.all_day,
        location: event.location,
        description: event.description,
        recurrence_rule: event.recurrence_rule,
        created_by_role: event.created_by_role,
        last_updated: event.updated_at,
      }));
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'last_updated'> & { created_by: string }) => {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          title: event.title,
          auxiliary: event.auxiliary,
          scope: event.scope,
          is_sports: event.is_sports,
          start_date: event.start_date,
          start_time: event.start_time,
          end_date: event.end_date,
          end_time: event.end_time,
          all_day: event.all_day,
          location: event.location,
          description: event.description,
          recurrence_rule: event.recurrence_rule,
          created_by: event.created_by,
          created_by_role: event.created_by_role,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Created',
        description: 'The event has been successfully created.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Creating Event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...event }: Partial<Event> & { id: string }) => {
      const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Updated',
        description: 'The event has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Updating Event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      toast({
        title: 'Event Deleted',
        description: 'The event has been successfully deleted.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Deleting Event',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

// Namaz timings hooks
export const useNamazTimings = () => {
  return useQuery({
    queryKey: ['namaz-timings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('namaz_timings')
        .select('*')
        .order('date', { ascending: true });
      
      if (error) throw error;
      
      return data.map((timing: any): NamazTiming => ({
        date: timing.date,
        fajr: timing.fajr,
        zuhr: timing.zuhr,
        asr: timing.asr,
        maghrib: timing.maghrib,
        isha: timing.isha,
        jumuah_1: timing.jumuah_1,
        jumuah_2: timing.jumuah_2,
        notes: timing.notes,
      }));
    },
  });
};

export const useUpdateNamazTimings = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (timings: NamazTiming[]) => {
      const { error } = await supabase
        .from('namaz_timings')
        .upsert(timings, { onConflict: 'date' });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['namaz-timings'] });
      toast({
        title: 'Prayer Times Updated',
        description: 'The prayer times have been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error Updating Prayer Times',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};