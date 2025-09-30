import { Event, NamazTiming } from '@/types/events';

export const mockEvents: Event[] = [
  {
    id: 'EVT-001',
    title: 'Khuddam Tahajjud & Dars',
    auxiliary: 'Khuddam',
    scope: 'Local',
    is_sports: false,
    start_date: '2025-09-27',
    start_time: '05:30',
    end_date: '2025-09-27',
    end_time: '07:00',
    all_day: false,
    location: 'Darul Barkaat',
    description: 'Early morning prayers and short dars.',
    created_by_role: 'Qaid',
    last_updated: '2025-09-23T10:00:00Z'
  },
  {
    id: 'EVT-002',
    title: 'Lajna Taleem Class',
    auxiliary: 'Lajna',
    scope: 'Local',
    is_sports: false,
    start_date: '2025-09-28',
    start_time: '11:00',
    end_date: '2025-09-28',
    end_time: '12:30',
    all_day: false,
    location: 'Darul Barkaat',
    description: 'Weekly taleem class.',
    recurrence_rule: 'RRULE:FREQ=WEEKLY;BYDAY=SU',
    created_by_role: 'Mosque Manager',
    last_updated: '2025-09-23T10:05:00Z'
  },
  {
    id: 'EVT-003',
    title: 'Ansar Sports Evening',
    auxiliary: 'Ansar',
    scope: 'Local',
    is_sports: true,
    start_date: '2025-09-28',
    start_time: '19:00',
    end_date: '2025-09-28',
    end_time: '21:00',
    all_day: false,
    location: 'Darul Barkaat',
    description: 'Indoor sports activities.',
    created_by_role: 'Mosque Manager',
    last_updated: '2025-09-23T10:10:00Z'
  },
  {
    id: 'EVT-004',
    title: 'National Khuddam Ijtema',
    auxiliary: 'Khuddam',
    scope: 'National',
    is_sports: false,
    start_date: '2025-10-15',
    start_time: '09:00',
    end_date: '2025-10-16',
    end_time: '17:00',
    all_day: false,
    location: 'Baitul Futuh, London',
    description: 'National gathering for Khuddam.',
    created_by_role: 'Murabbi',
    last_updated: '2025-09-23T10:15:00Z'
  },
  {
    id: 'EVT-005',
    title: 'Atfal Class',
    auxiliary: 'Atfal',
    scope: 'Local',
    is_sports: false,
    start_date: '2025-09-29',
    start_time: '10:00',
    end_date: '2025-09-29',
    end_time: '11:00',
    all_day: false,
    location: 'Darul Barkaat',
    description: 'Islamic studies for Atfal.',
    recurrence_rule: 'RRULE:FREQ=WEEKLY;BYDAY=SA',
    created_by_role: 'Qaid',
    last_updated: '2025-09-23T10:20:00Z'
  },
  {
    id: 'EVT-006',
    title: 'Regional Lajna Meeting',
    auxiliary: 'Lajna',
    scope: 'Regional',
    is_sports: false,
    start_date: '2025-10-05',
    start_time: '14:00',
    end_date: '2025-10-05',
    end_time: '16:00',
    all_day: false,
    location: 'Darul Barkaat',
    description: 'Monthly regional meeting.',
    created_by_role: 'Mosque Manager',
    last_updated: '2025-09-23T10:25:00Z'
  }
];

export const mockNamazTimings: NamazTiming[] = [
  {
    date: '2025-09-23',
    fajr: '05:45',
    zuhr: '13:15',
    asr: '17:00',
    maghrib: '19:00',
    isha: '20:15',
    jumuah_1: '13:30',
    jumuah_2: '14:15'
  },
  {
    date: '2025-09-24',
    fajr: '05:47',
    zuhr: '13:15',
    asr: '17:00',
    maghrib: '18:58',
    isha: '20:13'
  },
  {
    date: '2025-09-25',
    fajr: '05:49',
    zuhr: '13:14',
    asr: '16:58',
    maghrib: '18:56',
    isha: '20:11'
  },
  {
    date: '2025-09-26',
    fajr: '05:51',
    zuhr: '13:14',
    asr: '16:56',
    maghrib: '18:54',
    isha: '20:09'
  },
  {
    date: '2025-09-27',
    fajr: '05:53',
    zuhr: '13:14',
    asr: '16:54',
    maghrib: '18:52',
    isha: '20:07',
    jumuah_1: '13:30',
    jumuah_2: '14:15'
  },
  {
    date: '2025-09-28',
    fajr: '05:55',
    zuhr: '13:13',
    asr: '16:52',
    maghrib: '18:50',
    isha: '20:05'
  },
  {
    date: '2025-09-29',
    fajr: '05:57',
    zuhr: '13:13',
    asr: '16:50',
    maghrib: '18:48',
    isha: '20:03'
  }
];