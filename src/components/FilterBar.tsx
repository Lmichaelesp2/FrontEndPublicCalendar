'use client';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

// ── Option sets ──────────────────────────────────────────────────────────────

const CITY_OPTIONS    = ['San Antonio', 'Austin', 'Dallas', 'Houston'];

const CATEGORY_OPTIONS = [
  { value: 'Networking',     label: 'Networking' },
  { value: 'Technology',     label: 'Technology' },
  { value: 'Real Estate',    label: 'Real Estate' },
  { value: 'Chamber',        label: 'Chamber' },
  { value: 'Small Business', label: 'Small Business' },
];

const TIME_OPTIONS = [
  { value: 'Morning', label: 'Morning',  hint: 'Before noon' },
  { value: 'Midday',  label: 'Midday',   hint: '12 – 5 pm' },
  { value: 'Evening', label: 'Evening',  hint: 'After 5 pm' },
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
  return (
    f.cities.length > 0 ||
    f.categories.length > 0 ||
    f.times.length > 0 ||
    f.participation.length > 0
  );
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter(v => v !== val) : [...arr, val];
}

// ── Dropdown filter button ───────────────────────────────────────────────────

type DropKey = 'city' | 'who' | 'when' | 'format';

function FilterDropdown({
  label,
  count,
  isOpen,
  onToggle,
  onClose,
  children,
}: {
  label: string;
  count: number;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen, onClose]);

  const hasActive = count > 0;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: isOpen ? '#1e2236' : hasActive ? '#f5a62310' : '#181b2a',
          border: `1px solid ${hasActive ? '#f5a62360' : isOpen ? '#3a3f58' : '#2a2f45'}`,
          borderRadius: '8px',
          color: hasActive ? '#f5a623' : '#bbb',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: hasActive ? 600 : 400,
          padding: '7px 12px',
          transition: 'all 0.12s',
          whiteSpace: 'nowrap' as const,
        }}
      >
        {label}
        {hasActive && (
          <span style={{
            background: '#f5a623',
            color: '#000',
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
            marginLeft: '1px',
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
          left: 0,
          background: '#1a1d2e',
          border: '1px solid #2a2f45',
          borderRadius: '12px',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          padding: '14px',
          zIndex: 200,
          minWidth: '220px',
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
        background: active ? '#f5a62314' : 'transparent',
        border: `1px solid ${active ? '#f5a62350' : '#2a2f45'}`,
        borderRadius: '8px',
        color: active ? '#f5a623' : '#ccc',
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
        <span style={{ color: active ? '#f5a62370' : '#555', fontSize: '11px', marginLeft: '8px' }}>
          {hint}
        </span>
      )}
    </button>
  );
}

// ── Active filter chips (summary row) ────────────────────────────────────────

function ActiveChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      background: '#f5a62318',
      border: '1px solid #f5a62440',
      borderRadius: '20px',
      color: '#f5a623',
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
          color: '#f5a62380',
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

  // Collect all active chips for summary row
  const activeChips: { label: string; remove: () => void }[] = [
    ...filters.cities.map(v => ({
      label: v,
      remove: () => onChange({ ...filters, cities: filters.cities.filter(x => x !== v) }),
    })),
    ...filters.categories.map(v => ({
      label: v,
      remove: () => onChange({ ...filters, categories: filters.categories.filter(x => x !== v) }),
    })),
    ...filters.times.map(v => ({
      label: v,
      remove: () => onChange({ ...filters, times: filters.times.filter(x => x !== v) }),
    })),
    ...filters.participation.map(v => ({
      label: v,
      remove: () => onChange({ ...filters, participation: filters.participation.filter(x => x !== v) }),
    })),
  ];

  return (
    <div style={{ margin: '8px 0 2px' }}>

      {/* ── Button row ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        flexWrap: 'wrap' as const,
      }}>
        <span style={{
          color: '#555',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.6px',
          textTransform: 'uppercase' as const,
          marginRight: '2px',
          whiteSpace: 'nowrap' as const,
        }}>
          Filter
        </span>

        {/* City */}
        <FilterDropdown
          label="City"
          count={filters.cities.length}
          isOpen={openDrop === 'city'}
          onToggle={() => toggleDrop('city')}
          onClose={closeDrop}
        >
          {CITY_OPTIONS.map(v => (
            <Pill
              key={v}
              label={v}
              active={filters.cities.includes(v)}
              onToggle={() => onChange({ ...filters, cities: toggle(filters.cities, v) })}
            />
          ))}
        </FilterDropdown>

        {/* Who */}
        <FilterDropdown
          label="Who"
          count={filters.categories.length}
          isOpen={openDrop === 'who'}
          onToggle={() => toggleDrop('who')}
          onClose={closeDrop}
        >
          {CATEGORY_OPTIONS.map(opt => (
            <Pill
              key={opt.value}
              label={opt.label}
              active={filters.categories.includes(opt.value)}
              onToggle={() => onChange({ ...filters, categories: toggle(filters.categories, opt.value) })}
            />
          ))}
        </FilterDropdown>

        {/* When */}
        <FilterDropdown
          label="When"
          count={filters.times.length}
          isOpen={openDrop === 'when'}
          onToggle={() => toggleDrop('when')}
          onClose={closeDrop}
        >
          {TIME_OPTIONS.map(opt => (
            <Pill
              key={opt.value}
              label={opt.label}
              hint={opt.hint}
              active={filters.times.includes(opt.value)}
              onToggle={() => onChange({ ...filters, times: toggle(filters.times, opt.value) })}
            />
          ))}
        </FilterDropdown>

        {/* Format */}
        <FilterDropdown
          label="Format"
          count={filters.participation.length}
          isOpen={openDrop === 'format'}
          onToggle={() => toggleDrop('format')}
          onClose={closeDrop}
        >
          {PARTICIPATION_OPTIONS.map(opt => (
            <Pill
              key={opt.value}
              label={opt.label}
              active={filters.participation.includes(opt.value)}
              onToggle={() => onChange({ ...filters, participation: toggle(filters.participation, opt.value) })}
            />
          ))}
        </FilterDropdown>

        {/* Clear all */}
        {active && (
          <button
            onClick={() => { onChange(emptyFilters()); closeDrop(); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              fontSize: '12px',
              marginLeft: '4px',
              padding: '4px 0',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
            }}
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* ── Active filter chips summary ── */}
      {activeChips.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap' as const,
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
