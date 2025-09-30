import { useState } from 'react';
import { useNamazTimings, useUpdateNamazTimings } from '@/hooks/useSupabaseData';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, Save, Calendar, Plus } from 'lucide-react';
import { NamazTiming } from '@/types/events';

export const AdminNamazManagement = () => {
  const { data: timings = [], isLoading } = useNamazTimings();
  const updateTimingsMutation = useUpdateNamazTimings();
  const [editingTimings, setEditingTimings] = useState<NamazTiming[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  const handleStartEditing = () => {
    setEditingTimings([...timings]);
    setIsEditing(true);
  };

  const handleSaveChanges = async () => {
    await updateTimingsMutation.mutateAsync(editingTimings);
    setIsEditing(false);
  };

  const handleCancelEditing = () => {
    setEditingTimings([]);
    setIsEditing(false);
  };

  const updateTiming = (index: number, field: keyof NamazTiming, value: string) => {
    const updated = [...editingTimings];
    updated[index] = { ...updated[index], [field]: value };
    setEditingTimings(updated);
  };

  const addNewTimingRow = () => {
    const today = new Date();
    const newDate = new Date(today.getTime() + (editingTimings.length * 24 * 60 * 60 * 1000));
    const dateStr = newDate.toISOString().split('T')[0];
    
    const newTiming: NamazTiming = {
      date: dateStr,
      fajr: '06:00',
      zuhr: '12:30',
      asr: '15:00',
      maghrib: '17:30',
      isha: '19:00',
      jumuah_1: '13:00',
      jumuah_2: '13:45',
      notes: '',
    };
    
    setEditingTimings([...editingTimings, newTiming]);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'short',
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
            <p className="text-muted-foreground">Loading prayer times...</p>
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
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Namaz Timings Management
            </CardTitle>
            <CardDescription>Update daily prayer times for the mosque</CardDescription>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleCancelEditing}
                  disabled={updateTimingsMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveChanges}
                  disabled={updateTimingsMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  {updateTimingsMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <Button onClick={handleStartEditing} className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Edit Timings
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {timings.length === 0 && !isEditing ? (
            <div className="text-center py-8 text-muted-foreground">
              No prayer times found. Start editing to add prayer times!
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Fajr</TableHead>
                      <TableHead>Zuhr</TableHead>
                      <TableHead>Asr</TableHead>
                      <TableHead>Maghrib</TableHead>
                      <TableHead>Isha</TableHead>
                      <TableHead>Jumuah 1</TableHead>
                      <TableHead>Jumuah 2</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(isEditing ? editingTimings : timings).map((timing, index) => (
                      <TableRow key={timing.date}>
                        <TableCell className="font-medium">
                          {isEditing ? (
                            <Input
                              type="date"
                              value={timing.date}
                              onChange={(e) => updateTiming(index, 'date', e.target.value)}
                              className="w-auto"
                            />
                          ) : (
                            formatDate(timing.date)
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="time"
                              value={timing.fajr}
                              onChange={(e) => updateTiming(index, 'fajr', e.target.value)}
                              className="w-24"
                            />
                          ) : (
                            timing.fajr
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="time"
                              value={timing.zuhr}
                              onChange={(e) => updateTiming(index, 'zuhr', e.target.value)}
                              className="w-24"
                            />
                          ) : (
                            timing.zuhr
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="time"
                              value={timing.asr}
                              onChange={(e) => updateTiming(index, 'asr', e.target.value)}
                              className="w-24"
                            />
                          ) : (
                            timing.asr
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="time"
                              value={timing.maghrib}
                              onChange={(e) => updateTiming(index, 'maghrib', e.target.value)}
                              className="w-24"
                            />
                          ) : (
                            timing.maghrib
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="time"
                              value={timing.isha}
                              onChange={(e) => updateTiming(index, 'isha', e.target.value)}
                              className="w-24"
                            />
                          ) : (
                            timing.isha
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="time"
                              value={timing.jumuah_1 || ''}
                              onChange={(e) => updateTiming(index, 'jumuah_1', e.target.value)}
                              className="w-24"
                            />
                          ) : (
                            timing.jumuah_1 || '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="time"
                              value={timing.jumuah_2 || ''}
                              onChange={(e) => updateTiming(index, 'jumuah_2', e.target.value)}
                              className="w-24"
                            />
                          ) : (
                            timing.jumuah_2 || '-'
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={timing.notes || ''}
                              onChange={(e) => updateTiming(index, 'notes', e.target.value)}
                              placeholder="Optional notes"
                              className="w-32"
                            />
                          ) : (
                            timing.notes || '-'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              {isEditing && (
                <Button
                  variant="outline"
                  onClick={addNewTimingRow}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add New Date
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Add Card for Future Expansion */}
      <Card className="bg-gradient-to-r from-accent/5 to-primary/5 border-accent/20">
        <CardHeader>
          <CardTitle className="text-lg">Quick Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Use the Edit Timings button to modify prayer times</p>
          <p>• Jumuah times are optional (leave empty for non-Friday dates)</p>
          <p>• Notes can be used for special announcements or changes</p>
          <p>• All times should be in 24-hour format (HH:MM)</p>
        </CardContent>
      </Card>
    </div>
  );
};