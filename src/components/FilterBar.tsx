'use client';
import { X } from 'lucide-react';

// ── Option sets ──────────────────────────────────────────────────────────────

const CITY_OPTIONS = ['San Antonio', 'Austin', 'Dallas', 'Houston'];

const CATEGORY_OPTIONS = [
  { value: 'Networking',    label: 'Networking' },
  { value: 'Technology',    label: 'Technology' },
  { value: 'Real Estate',   label: 'Real Estate' },
  { value: 'Chamber',       label: 'Chamber' },
  { value: 'Small Business',label: 'Small Business' },
];

const TIME_OPTIONS = [
  { value: 'Morning', label: 'Morning',  sub: 'before noon' },
  { value: 'Midday',  label: 'Midday',   sub: '12–5pm' },
  { value: 'Evening', label: 'Evening',  sub: 'after 5pm' },
];

const PARTICIPATION_OPTIONS = [
  { value: 'In-Person', label: 'In-Person' },
  { value: 'Virtual',   label: 'Virtual' },
];

// ── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
  cities:        string[];
  categories:    string[];
  times:         string[];
  participation: string[];
}

export function emptyFilters(): FilterState {
  return { cities: [], categories: [], times: [], participation: [] };
}

export function hasActiveFilters(f: FilterState): boolean {
  return f.cities.length > 0 || f.categories.length > 0 || f.times.length > 0 || f.participation.length > 0;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ── Sub-component: a single row of pills ────────────────────────────────────

function PillRow({
  label,
  options,
  selected,
  onToggle,
}: {
  label: string;
  options: { value: string; label: string; sub?: string }[];
  selected: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', flexWrap: 'wrap' }}>
      <span style={{
        color: '#666',
        fontSize: '11px',
        fontWeight: 700,
        letterSpacing: '0.8px',
        textTransform: 'uppercase',
        paddingTop: '6px',
        minWidth: '80px',
        flexShrink: 0,
      }}>
        {label}
      </span>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {options.map(opt => {
          const active = selected.includes(opt.value);
          return (
            <button
              key={opt.value}
              onClick={() => onToggle(opt.value)}
              style={{
                background: active ? '#f5a62318' : '#1a1d2e',
                border: `1px solid ${active ? '#f5a623' : '#2a2f45'}`,
                borderRadius: '20px',
                color: active ? '#f5a623' : '#aaa',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: active ? 700 : 400,
                padding: opt.sub ? '4px 12px 5px' : '5px 14px',
                transition: 'all 0.12s',
                lineHeight: 1.3,
                textAlign: 'left' as const,
              }}
            >
              {opt.label}
              {opt.sub && (
                <span style={{ color: active ? '#f5a62399' : '#555', fontSize: '10px', display: 'block', lineHeight: 1 }}>
                  {opt.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const active = hasActiveFilters(filters);
  const activeCount =
    filters.cities.length +
    filters.categories.length +
    filters.times.length +
    filters.participation.length;

  return (
    <div style={{
      background: '#12152200',
      border: '1px solid #2a2f45',
      borderRadius: '12px',
      padding: '14px 16px',
      margin: '10px 0 4px',
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '12px',
    }}>

      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#aaa', fontSize: '12px', fontWeight: 600 }}>
          Filter Events
          {activeCount > 0 && (
            <span style={{
              background: '#f5a623',
              color: '#000',
              borderRadius: '20px',
              fontSize: '10px',
              fontWeight: 800,
              padding: '1px 7px',
              marginLeft: '7px',
            }}>
              {activeCount}
            </span>
          )}
        </span>
        {active && (
          <button
            onClick={() => onChange(emptyFilters())}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: '11px',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              padding: 0,
            }}
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* City */}
      <PillRow
        label="City"
        options={CITY_OPTIONS.map(c => ({ value: c, label: c }))}
        selected={filters.cities}
        onToggle={val => onChange({ ...filters, cities: toggle(filters.cities, val) })}
      />

      {/* Category */}
      <PillRow
        label="Who"
        options={CATEGORY_OPTIONS}
        selected={filters.categories}
        onToggle={val => onChange({ ...filters, categories: toggle(filters.categories, val) })}
      />

      {/* Time of day */}
      <PillRow
        label="When"
        options={TIME_OPTIONS}
        selected={filters.times}
        onToggle={val => onChange({ ...filters, times: toggle(filters.times, val) })}
      />

      {/* Participation */}
      <PillRow
        label="Format"
        options={PARTICIPATION_OPTIONS}
        selected={filters.participation}
        onToggle={val => onChange({ ...filters, participation: toggle(filters.participation, val) })}
      />

    </div>
  );
}
