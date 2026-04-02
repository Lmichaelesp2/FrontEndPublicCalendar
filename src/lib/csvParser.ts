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
    group_name: null,
    participation: 'In-Person',
    part_of_town: null,
    time_of_day: null,
    event_category: null,
    city_calendar: null,
    status: 'approved'
  };

  headers.forEach((header, index) => {
    const raw = values[index] || '';
    const value = raw.replace(/^"|"$/g, '').trim() || null;
    if (!value) return;

    switch (header) {
      case 'name':
      case 'event_name':
      case 'title':
        event.name = value;
        break;
      case 'start_date':
      case 'startdate':
      case 'date':
        event.start_date = convertDateToISO(value);
        break;
      case 'start_time':
      case 'starttime':
      case 'time':
        event.start_time = value;
        break;
      case 'end_date':
      case 'enddate':
        event.end_date = convertDateToISO(value);
        break;
      case 'end_time':
      case 'endtime':
        event.end_time = value;
        break;
      case 'website':
      case 'url':
      case 'link':
        event.website = value;
        break;
      case 'description':
      case 'desc':
        event.description = value;
        break;
      case 'paid':
      case 'cost':
      case 'price':
        event.paid = value;
        break;
      case 'address':
      case 'location':
        event.address = value;
        break;
      case 'zipcode':
      case 'zip':
        event.zipcode = value;
        break;
      case 'group_name':
      case 'groupname':
      case 'organization':
      case 'org':
        event.group_name = value;
        break;
      case 'participation':
      case 'format':
      case 'type':
        event.participation = value;
        break;
      case 'part_of_town':
      case 'partoftown':
      case 'area':
        event.part_of_town = value;
        break;
      case 'city_calendar':
      case 'citycalendar':
      case 'city':
        event.city_calendar = value;
        break;
      case 'status':
        event.status = value;
        break;
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

  const headers = rows[0].map(h => h.replace(/^"|"$/g, '').trim().toLowerCase().replace(/\s+/g, '_'));
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
