import { Event } from './supabase';

export type EventInput = Omit<Event, 'id' | 'created_at' | 'updated_at'>;

function convertDateToISO(dateStr: string): string {
  if (!dateStr) return '';

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return dateStr;
  }

  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return dateStr;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function splitCSVIntoRows(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let fields: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      fields.push(current.trim());
      if (fields.some(f => f !== '')) {
        rows.push(fields);
      }
      fields = [];
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  if (fields.some(f => f !== '')) {
    rows.push(fields);
  }

  return rows;
}

const SKIP_COLUMNS = new Set(['created_at', 'updated_at', 'status']);

const COLUMN_MAP: Record<string, keyof EventInput | null> = {
  name: 'name',
  'start_date': 'start_date',
  'start_time': 'start_time',
  'end_date': 'end_date',
  'end_time': 'end_time',
  website: 'website',
  description: 'description',
  'city_calendar': 'city_calendar',
  'event_type': 'event_type',
  paid: 'paid',
  address: 'address',
  'event_city': 'event_city',
  state: 'state',
  zipcode: 'zipcode',
  'zip_code': 'zipcode',
  'group_name': 'org_name',
  'org_name': 'org_name',
  source: 'source',
  notes: 'notes',
  'group_id': 'org_id',
  'id': 'org_id',
  'org_id': 'org_id',
  'group_type': 'org_type',
  'organization_type': 'org_type',
  'org_type': 'org_type',
  participation: 'participation',
  'internal_type': 'internal_type',
  'part_of_town': 'part_of_town',
  'event_category': 'event_category',
  'eventcategory': 'event_category',
  'category': 'event_category',
  'subcategory': 'event_category',
  'sub_category': 'event_category',
  'time_of_day': 'time_of_day',
  'timeofday': 'time_of_day',
  'time_period': 'time_of_day',
};

function normalizeHeader(header: string): string {
  return header.replace(/^"|"$/g, '').trim().toLowerCase().replace(/\s+/g, '_');
}

function mapRowToEvent(headers: string[], values: string[]): EventInput | null {
  const event: EventInput = {
    name: '',
    start_date: '',
    start_time: null,
    end_date: null,
    end_time: null,
    website: null,
    description: null,
    paid: 'Unknown',
    address: null,
    zipcode: null,
    org_name: null,
    participation: 'In-Person',
    part_of_town: null,
    org_type: null,
    org_id: null,
    event_type: null,
    event_city: null,
    state: null,
    source: null,
    notes: null,
    internal_type: null,
    event_category: null,
    time_of_day: null,
    city_calendar: null,
    status: 'approved'
  };

  headers.forEach((header, index) => {
    const normalized = normalizeHeader(header);

    if (SKIP_COLUMNS.has(normalized)) return;

    const field = COLUMN_MAP[normalized];
    if (!field) return;

    const raw = values[index] || '';
    const value = raw.replace(/^"|"$/g, '').trim() || null;
    if (!value) return;

    if (field === 'start_date' || field === 'end_date') {
      (event as Record<string, unknown>)[field] = convertDateToISO(value);
    } else {
      (event as Record<string, unknown>)[field] = value;
    }
  });

  if (event.name && event.start_date) {
    return event;
  }
  return null;
}

export function parseCSV(csvText: string): EventInput[] {
  const rows = splitCSVIntoRows(csvText);

  if (rows.length < 2) {
    throw new Error('CSV must have at least a header row and one data row');
  }

  const headers = rows[0];
  const events: EventInput[] = [];

  for (let i = 1; i < rows.length; i++) {
    const event = mapRowToEvent(headers, rows[i]);
    if (event) {
      events.push(event);
    }
  }

  console.log(`Parsed ${events.length} events from ${rows.length - 1} data rows`);
  return events;
}

export function parseTSV(tsvText: string): EventInput[] {
  return parseCSV(tsvText.replace(/\t/g, ','));
}

export function validateEvent(event: EventInput): string[] {
  const errors: string[] = [];

  if (!event.name || event.name.trim() === '') {
    errors.push('Event name is required');
  }

  if (!event.start_date || event.start_date.trim() === '') {
    errors.push('Start date is required');
  } else {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(event.start_date)) {
      errors.push('Start date must be in YYYY-MM-DD format');
    }
  }

  return errors;
}
