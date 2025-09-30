export type Auxiliary = 'Atfal' | 'Khuddam' | 'Lajna' | 'Ansar';
export type Scope = 'Local' | 'Regional' | 'National';
export type Qiadat = 'Solihull' | 'South' | 'West' | 'Central' | 'North' | 'Walsall' | 'Wolverhampton';
export type AdminRole = 'Mosque Manager' | 'Local Nazim' | 'Qaid' | 'Sadar Jamaat' | 'Murabbi' | 'Other';

export interface Event {
  id: string;
  title: string;
  auxiliary: Auxiliary;
  scope: Scope;
  qiadat?: Qiadat;
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
  qiadat: Qiadat | 'All';
  sports_only: boolean;
}