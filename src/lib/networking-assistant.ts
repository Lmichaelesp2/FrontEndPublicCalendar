// ─── Networking Assistant — Types & DB helpers ───────────────────────────────
// All queries target the lbc Supabase project (same client as the rest of the app)
// All NA tables are prefixed na_ and never touch existing LBC tables

import { supabase } from './supabase';

// ─── Types ────────────────────────────────────────────────────────────────────

export type NAEvent = {
  id: string;
  user_profile_id: string;
  source: 'lbc' | 'manual';
  lbc_event_id: number | null;
  event_name: string;
  event_date: string;
  event_type: 'chamber' | 'mixer' | 'conference' | 'startup' | 'informal' | 'coffee' | 'other';
  host_org: string | null;
  location_name: string | null;
  city: string | null;
  description: string | null;
  user_goal: string | null;
  user_rating: number | null;
  user_debrief_notes: string | null;
  created_at: string;
};

export type NAPerson = {
  id: string;
  user_profile_id: string;
  first_name: string;
  last_name: string | null;
  company: string | null;
  title: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  city: string | null;
  industry: string | null;
  tags: string[] | null;
  relationship_status: 'hot' | 'warm' | 'cold' | 'archived';
  first_met_event_id: string | null;
  first_met_date: string | null;
  notes: string | null;
  linkedin_connected: boolean;
  google_contact_id: string | null;
  created_at: string;
  updated_at: string;
};

export type NAInteraction = {
  id: string;
  user_profile_id: string;
  person_id: string;
  event_id: string | null;
  org_id: number | null;
  membership_id: string | null;
  source_type: 'event' | 'org';
  interaction_date: string;
  voice_transcript: string | null;
  key_topic: string | null;
  opportunity_notes: string | null;
  follow_up_intent: string | null;
  sentiment: 'positive' | 'neutral' | 'needs_work';
  created_at: string;
};

export type NAMembership = {
  id: string;
  user_id: string;
  org_id: number | null;
  org_name: string | null;
  org_city: string | null;
  org_type: string | null;
  joined_at: string | null;
  is_active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type LBCOrg = {
  id: number;
  name: string;
  city: string | null;
  group_type: string | null;
  category: string | null;
};

export type NAFollowUp = {
  id: string;
  user_profile_id: string;
  person_id: string;
  event_id: string | null;
  action_type: 'linkedin_connect' | 'linkedin_message' | 'email' | 'call' | 'reminder' | 're_engage';
  due_date: string;
  status: 'pending' | 'completed' | 'snoozed' | 'skipped';
  ai_draft_message: string | null;
  snooze_until: string | null;
  completed_at: string | null;
  skip_reason: string | null;
  created_at: string;
};

export type LBCEvent = {
  id: number;
  name: string;
  start_date: string;
  start_time: string | null;
  end_date: string | null;
  end_time: string | null;
  description: string | null;
  event_address: string | null;
  city_calendar: string | null;
  group_name: string | null;
  website: string | null;
  paid: string | null;
  participation: string | null;
  event_type: string | null;
  subcategory: string | null;
};

// ─── Queries ──────────────────────────────────────────────────────────────────

/** Upcoming approved LBC events for the next 60 days */
export async function fetchUpcomingLBCEvents(city?: string) {
  const today = new Date().toISOString().split('T')[0];
  const in60 = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  let query = supabase
    .from('events_published')
    .select('id, name, start_date, start_time, end_date, end_time, description, event_address, city_calendar, group_name, website, paid, participation, event_type, subcategory')
    .gte('start_date', today)
    .lte('start_date', in60)
    .order('start_date', { ascending: true });

  if (city) query = query.eq('city_calendar', city);

  const { data, error } = await query;
  return { data: data as LBCEvent[] | null, error };
}

/** User's NA events (flagged LBC + manual) */
export async function fetchMyNAEvents(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('na_events')
    .select('*')
    .eq('user_profile_id', userId)
    .gte('event_date', today)
    .order('event_date', { ascending: true });
  return { data: data as NAEvent[] | null, error };
}

/** Create a manual NA event */
export async function createNAEvent(event: Omit<NAEvent, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('na_events')
    .insert(event)
    .select()
    .single();
  return { data: data as NAEvent | null, error };
}

/** Flag an LBC event (import it into na_events) */
export async function flagLBCEvent(userId: string, lbcEvent: LBCEvent) {
  const payload: Omit<NAEvent, 'id' | 'created_at'> = {
    user_profile_id: userId,
    source: 'lbc',
    lbc_event_id: lbcEvent.id,
    event_name: lbcEvent.name,
    event_date: lbcEvent.start_date,
    event_type: 'other',
    host_org: lbcEvent.group_name,
    location_name: lbcEvent.event_address,
    city: lbcEvent.city_calendar,
    description: lbcEvent.description,
    user_goal: null,
    user_rating: null,
    user_debrief_notes: null,
  };
  const { data, error } = await supabase
    .from('na_events')
    .insert(payload)
    .select()
    .single();
  return { data: data as NAEvent | null, error };
}

/** Fetch all persons for a user */
export async function fetchPersons(userId: string) {
  const { data, error } = await supabase
    .from('na_persons')
    .select('*')
    .eq('user_profile_id', userId)
    .order('created_at', { ascending: false });
  return { data: data as NAPerson[] | null, error };
}

/** Fetch single person */
export async function fetchPerson(personId: string) {
  const { data, error } = await supabase
    .from('na_persons')
    .select('*')
    .eq('id', personId)
    .single();
  return { data: data as NAPerson | null, error };
}

/** Create a person */
export async function createPerson(person: Omit<NAPerson, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('na_persons')
    .insert(person)
    .select()
    .single();
  return { data: data as NAPerson | null, error };
}

/** Fetch interactions for a person (joins both event and org) */
export async function fetchInteractionsForPerson(personId: string) {
  const { data, error } = await supabase
    .from('na_interactions')
    .select('*, na_events(event_name, event_date, host_org), na_memberships(org_name, org_city, org_type)')
    .eq('person_id', personId)
    .order('interaction_date', { ascending: false });
  return { data, error };
}

/** Fetch all persons captured through a specific membership */
export async function fetchPersonsByMembership(membershipId: string) {
  const { data, error } = await supabase
    .from('na_interactions')
    .select('person_id, interaction_date, key_topic, na_persons(id, first_name, last_name, company, title, relationship_status)')
    .eq('membership_id', membershipId)
    .order('interaction_date', { ascending: false });
  return { data, error };
}

/** Fetch user's active memberships */
export async function fetchMemberships(userId: string) {
  const { data, error } = await supabase
    .from('na_memberships')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false });
  return { data: data as NAMembership[] | null, error };
}

/** Fetch LBC orgs filtered to active cities */
export async function fetchLBCOrgs(city?: string) {
  let query = supabase
    .from('organizations')
    .select('id, name, city, group_type, category')
    .in('city', ['San Antonio', 'Austin', 'Dallas', 'Houston'])
    .eq('archive', false)
    .order('name', { ascending: true });
  if (city) query = query.eq('city', city);
  const { data, error } = await query;
  return { data: data as LBCOrg[] | null, error };
}

/** Add a membership */
export async function addMembership(membership: Omit<NAMembership, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('na_memberships')
    .insert(membership)
    .select()
    .single();
  return { data: data as NAMembership | null, error };
}

/** Soft-delete a membership (set is_active = false) */
export async function removeMembership(id: string) {
  const { data, error } = await supabase
    .from('na_memberships')
    .update({ is_active: false })
    .eq('id', id)
    .select()
    .single();
  return { data: data as NAMembership | null, error };
}

/** Create an interaction */
export async function createInteraction(interaction: Omit<NAInteraction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('na_interactions')
    .insert(interaction)
    .select()
    .single();
  return { data: data as NAInteraction | null, error };
}

/** Create a follow-up */
export async function createFollowUp(followUp: Omit<NAFollowUp, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('na_follow_ups')
    .insert(followUp)
    .select()
    .single();
  return { data: data as NAFollowUp | null, error };
}

/** Fetch follow-ups for queue (pending + snoozed past snooze date) */
export async function fetchFollowUpQueue(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  const { data, error } = await supabase
    .from('na_follow_ups')
    .select('*, na_persons(first_name, last_name, company), na_events(event_name, event_date)')
    .eq('user_profile_id', userId)
    .in('status', ['pending', 'snoozed'])
    .or(`status.eq.pending,and(status.eq.snoozed,snooze_until.lte.${today})`)
    .order('due_date', { ascending: true });
  return { data, error };
}

/** Update a follow-up status */
export async function updateFollowUp(id: string, updates: Partial<NAFollowUp>) {
  const { data, error } = await supabase
    .from('na_follow_ups')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data: data as NAFollowUp | null, error };
}

/** Delete a person and all related records */
export async function deletePerson(personId: string) {
  // Delete follow-ups and interactions first (cascade safety)
  await supabase.from('na_follow_ups').delete().eq('person_id', personId);
  await supabase.from('na_interactions').delete().eq('person_id', personId);
  const { error } = await supabase.from('na_persons').delete().eq('id', personId);
  return { error };
}

/** LinkedIn deep-link URL */
export function linkedInSearchURL(firstName: string, lastName: string | null, company: string | null) {
  const query = [firstName, lastName, company].filter(Boolean).join(' ');
  return `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(query)}`;
}

/** Days ago helper */
export function daysAgo(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/** Follow-up urgency bucket */
export function followUpBucket(dueDateStr: string): 'overdue' | 'today' | 'upcoming' {
  const today = new Date().toISOString().split('T')[0];
  if (dueDateStr < today) return 'overdue';
  if (dueDateStr === today) return 'today';
  return 'upcoming';
}
