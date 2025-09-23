export type Auxiliary = 'Atfal' | 'Khuddam' | 'Lajna' | 'Ansar';
export type Scope = 'Local' | 'Regional' | 'National';
export type AdminRole = 'Sadr' | 'Murabbi' | 'Qaid' | 'Mosque Manager';

export interface Event {
  id: string;
  title: string;
  auxiliary: Auxiliary;
  scope: Scope;
  is_sports: boolean;
  start_date: string; // YYYY-MM-DD
  start_time?: string; // HH:MM
  end_date?: string;
  end_time?: string;
  all_day: boolean;
  location: string;
  description?: string;
  recurrence_rule?: string;
  created_by_role: AdminRole;
  last_updated: string;
}

export interface NamazTiming {
  date: string; // YYYY-MM-DD
  fajr: string;
  zuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
  jumuah_1?: string;
  jumuah_2?: string;
  notes?: string;
}

export interface FilterState {
  auxiliary: Auxiliary | 'All';
  scope: Scope | 'All';
  sports_only: boolean;
}