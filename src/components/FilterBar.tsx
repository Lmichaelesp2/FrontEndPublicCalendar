'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

// ── Option sets ──────────────────────────────────────────────────────────────

const CITY_OPTIONS = ['San Antonio', 'Austin', 'Dallas', 'Houston'];

const COST_OPTIONS = [
  { value: 'Paid',    label: 'Paid' },
  { value: 'Free',    label: 'Free' },
  { value: 'Unknown', label: 'Unknown' },
];

const TIME_OPTIONS = [
  { value: 'Morning',   label: 'Morning',   hint: 'Before noon' },
  { value: 'Afternoon', label: 'Afternoon', hint: '12 – 5 pm' },
  { value: 'Evening',   label: 'Evening',   hint: 'After 5 pm' },
];

const PARTICIPATION_OPTIONS = [
  { value: 'In-Person', label: 'In-Person' },
  { value: 'Virtual',   label: 'Virtual' },
  { value: 'Hybrid',    label: 'Hybrid' },
];

const LOCATION_OPTIONS = [
  { value: 'North',       label: 'North' },
  { value: 'South',       label: 'South' },
  { value: 'Central',     label: 'Central' },
  { value: 'East',        label: 'East' },
  { value: 'West',        label: 'West' },
  { value: 'Surrounding', label: 'Surrounding' },
  { value: 'No Address',  label: 'No Address' },
];

const CATEGORY_OPTIONS = [
  { value: 'Real Estate',        label: 'Real Estate' },
  { value: 'Technology',         label: 'Technology' },
  { value: 'Financial',          label: 'Financial' },
  { value: 'Networking',         label: 'Networking' },
  { value: 'Chambers',           label: 'Chambers' },
  { value: 'Professional Svcs',  label: 'Professional Svcs' },
  { value: 'Co-Working',         label: 'Co-Working' },
  { value: 'Fed/State/Local',    label: 'Fed/State/Local' },
  { value: 'Community/Edu',      label: 'Community/Edu' },
  { value: 'Hospitality',        label: 'Hospitality' },
  { value: 'Career/HR',          label: 'Career/HR' },
  { value: 'Healthcare',         label: 'Healthcare' },
  { value: 'Const/Design/Mfg',   label: 'Const/Design/Mfg' },
  { value: 'Small Business',     label: 'Small Business' },
  { value: 'Other',              label: 'Other' },
];

// ── Types ────────────────────────────────────────────────────────────────────

export interface FilterState {
  cities:        string[];
  costs:         string[];
  times:         string[];
  participation: string[];
  locations:     string[];
  categories:    string[];
}

export function emptyFilters(): FilterState {
  return { cities: [], costs: [], times: [], participation: [], locations: [], categories: [] };
}

export function hasActiveFilters(f: FilterState): boolean {
  return (
    f.cities.length > 0 ||
    f.costs.length > 0 ||
    f.times.length > 0 ||
    f.participation.length > 0 ||
    f.locations.length > 0 ||
    f.categories.length > 0
  );
}

export interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// Active blue palette (matches site's --color-primary / --color-primary-light)
const BLUE_TEXT   = '#5b82f7';
const BLUE_BG     = '#1652f014';
const BLUE_BORDER = '#1652f055';
const BLUE_BADGE  = '#1652f0';

type DropKey = 'city' | 'cost' | 'time' | 'participation' | 'location' | 'category';

// ── Dropdown button + panel ──────────────────────────────────────────────────

function FilterDropdown({
  label,
  count,
  isOpen,
  onToggle,
  onClose,
  wide,
  children,
}: {
  label: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [isOpen, onClose]);

  const hasActive = count > 0;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: hasActive ? BLUE_BG : isOpen ? '#252a40' : '#1e2236',
          border: `1px solid ${hasActive ? BLUE_BORDER : isOpen ? '#3a4060' : '#313754'}`,
          borderRadius: '8px',
          color: hasActive ? BLUE_TEXT : '#c5cde0',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: hasActive ? 600 : 400,
          padding: '7px 13px',
          transition: 'all 0.12s',
          whiteSpace: 'nowrap' as const,
        }}
      >
        {label}
        {hasActive && (
          <span style={{
            background: BLUE_BADGE,
            color: '#fff',
            borderRadius: '10px',
            fontSize: '10px',
            fontWeight: 800,
            lineHeight: 1,
            padding: '2px 6px',
          }}>
            {count}
          </span>
        )}
        <ChevronDown
          size={12}
          style={{
            opacity: 0.5,
            transform: isOpen ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.15s',
          }}
        />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#1a1d2e',
          border: '1px solid #2e3452',
          borderRadius: '12px',
          boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
          padding: '12px',
          zIndex: 300,
          minWidth: wide ? '260px' : '200px',
          maxHeight: '360px',
          overflowY: 'auto' as const,
        }}>
          {children}
        </div>
      )}
    </div>
  );
}

// ── Pill option inside a dropdown ────────────────────────────────────────────

function Pill({
  label,
  hint,
  active,
  onToggle,
}: {
  label: string;
  hint?: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        background: active ? BLUE_BG : 'transparent',
        border: `1px solid ${active ? BLUE_BORDER : '#2e3452'}`,
        borderRadius: '8px',
        color: active ? BLUE_TEXT : '#ccd4e8',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: active ? 600 : 400,
        padding: '8px 12px',
        textAlign: 'left' as const,
        transition: 'all 0.1s',
        marginBottom: '4px',
      }}
    >
      <span>{label}</span>
      {hint && (
        <span style={{ color: active ? `${BLUE_TEXT}88` : '#4a5270', fontSize: '11px', marginLeft: '8px' }}>
          {hint}
        </span>
      )}
    </button>
  );
}

// ── Active filter chip (summary row) ─────────────────────────────────────────

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: BLUE_BG,
      border: `1px solid ${BLUE_BORDER}`,
      borderRadius: '20px',
      color: BLUE_TEXT,
      fontSize: '11px',
      fontWeight: 600,
      padding: '3px 8px 3px 10px',
    }}>
      {label}
      <button
        onClick={onRemove}
        style={{
          background: 'none',
          border: 'none',
          color: `${BLUE_TEXT}99`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          padding: 0,
          lineHeight: 1,
        }}
      >
        <X size={10} />
      </button>
    </span>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export function FilterBar({ filters, onChange }: FilterBarProps) {
  const [openDrop, setOpenDrop] = useState<DropKey | null>(null);

  function toggleDrop(key: DropKey) {
    setOpenDrop(prev => (prev === key ? null : key));
  }
  function closeDrop() { setOpenDrop(null); }

  const active = hasActiveFilters(filters);

  const activeChips: { label: string; remove: () => void }[] = [
    ...filters.cities.map(v => ({ label: v, remove: () => onChange({ ...filters, cities: filters.cities.filter(x => x !== v) }) })),
    ...filters.costs.map(v => ({ label: v, remove: () => onChange({ ...filters, costs: filters.costs.filter(x => x !== v) }) })),
    ...filters.times.map(v => ({ label: v, remove: () => onChange({ ...filters, times: filters.times.filter(x => x !== v) }) })),
    ...filters.participation.map(v => ({ label: v, remove: () => onChange({ ...filters, participation: filters.participation.filter(x => x !== v) }) })),
    ...filters.locations.map(v => ({ label: v, remove: () => onChange({ ...filters, locations: filters.locations.filter(x => x !== v) }) })),
    ...filters.categories.map(v => ({ label: v, remove: () => onChange({ ...filters, categories: filters.categories.filter(x => x !== v) }) })),
  ];

  return (
    <div style={{ margin: '8px 0 2px' }}>

      {/* ── Button row (centered) ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap' as const,
      }}>

        {/* City */}
        <FilterDropdown label="City" count={filters.cities.length}
          isOpen={openDrop === 'city'} onToggle={() => toggleDrop('city')} onClose={closeDrop}>
          {CITY_OPTIONS.map(v => (
            <Pill key={v} label={v}
              active={filters.cities.includes(v)}
              onToggle={() => onChange({ ...filters, cities: toggle(filters.cities, v) })} />
          ))}
        </FilterDropdown>

        {/* Cost */}
        <FilterDropdown label="Cost" count={filters.costs.length}
          isOpen={openDrop === 'cost'} onToggle={() => toggleDrop('cost')} onClose={closeDrop}>
          {COST_OPTIONS.map(opt => (
            <Pill key={opt.value} label={opt.label}
              active={filters.costs.includes(opt.value)}
              onToggle={() => onChange({ ...filters, costs: toggle(filters.costs, opt.value) })} />
          ))}
        </FilterDropdown>

        {/* Time of Day */}
        <FilterDropdown label="Time of Day" count={filters.times.length}
          isOpen={openDrop === 'time'} onToggle={() => toggleDrop('time')} onClose={closeDrop}>
          {TIME_OPTIONS.map(opt => (
            <Pill key={opt.value} label={opt.label} hint={opt.hint}
              active={filters.times.includes(opt.value)}
              onToggle={() => onChange({ ...filters, times: toggle(filters.times, opt.value) })} />
          ))}
        </FilterDropdown>

        {/* Participation */}
        <FilterDropdown label="Participation" count={filters.participation.length}
          isOpen={openDrop === 'participation'} onToggle={() => toggleDrop('participation')} onClose={closeDrop}>
          {PARTICIPATION_OPTIONS.map(opt => (
            <Pill key={opt.value} label={opt.label}
              active={filters.participation.includes(opt.value)}
              onToggle={() => onChange({ ...filters, participation: toggle(filters.participation, opt.value) })} />
          ))}
        </FilterDropdown>

        {/* Location */}
        <FilterDropdown label="Location" count={filters.locations.length}
          isOpen={openDrop === 'location'} onToggle={() => toggleDrop('location')} onClose={closeDrop}>
          {LOCATION_OPTIONS.map(opt => (
            <Pill key={opt.value} label={opt.label}
              active={filters.locations.includes(opt.value)}
              onToggle={() => onChange({ ...filters, locations: toggle(filters.locations, opt.value) })} />
          ))}
        </FilterDropdown>

        {/* Categories */}
        <FilterDropdown label="Categories" count={filters.categories.length}
          isOpen={openDrop === 'category'} onToggle={() => toggleDrop('category')} onClose={closeDrop} wide>
          {CATEGORY_OPTIONS.map(opt => (
            <Pill key={opt.value} label={opt.label}
              active={filters.categories.includes(opt.value)}
              onToggle={() => onChange({ ...filters, categories: toggle(filters.categories, opt.value) })} />
          ))}
        </FilterDropdown>

        {/* Clear all */}
        {active && (
          <button
            onClick={() => { onChange(emptyFilters()); closeDrop(); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px 0',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* ── Active chips summary (centered) ── */}
      {activeChips.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap' as const,
          justifyContent: 'center',
          gap: '6px',
          marginTop: '10px',
        }}>
          {activeChips.map((chip, i) => (
            <ActiveChip key={i} label={chip.label} onRemove={chip.remove} />
          ))}
        </div>
      )}

    </div>
  );
}
