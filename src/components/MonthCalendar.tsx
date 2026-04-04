'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { useMidnightReset } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

interface MonthCalendarProps {
  onDateSelect?: (date: string) => void;
  onAuthClick?: () => void;
}

export function MonthCalendar({ onDateSelect, onAuthClick }: MonthCalendarProps) {
  const { user } = useAuth();
  const today = useMidnightReset();
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstWeekday = new Date(year, month, 1).getDay();

  const todayNow = new Date();
  const isCurrentMonth = year === todayNow.getFullYear() && month === todayNow.getMonth();
  const todayDay = todayNow.getDate();

  function cellDateKey(day: number) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  function handlePrevMonth() {
    setCurrentDate(new Date(year, month - 1));
  }

  function handleNextMonth() {
    setCurrentDate(new Date(year, month + 1));
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  function handleDayClick(day: number) {
    const dk = cellDateKey(day);
    const isPast = dk < today;
    if (isPast) return;
    if (!user) {
      if (onAuthClick) onAuthClick();
      return;
    }
    if (onDateSelect) onDateSelect(dk);
  }

  const totalCells = firstWeekday + daysInMonth;
  const rows = Math.ceil(totalCells / 7);

  return (
    <div className="cal-card">
      <div className="cal-card-header">
        <div className="cal-card-title">
          <span className="cal-card-month">{monthNames[month]}</span>
          <span className="cal-card-year">{year}</span>
        </div>
        <div className="cal-card-nav">
          <button className="cal-today-btn" onClick={handleToday}>Today</button>
          <button className="cal-nav-btn" onClick={handlePrevMonth} aria-label="Previous month">
            <ChevronLeft size={16} />
          </button>
          <button className="cal-nav-btn" onClick={handleNextMonth} aria-label="Next month">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="cal-grid-header">
        {['SUN','MON','TUE','WED','THU','FRI','SAT'].map(d => (
          <div key={d} className="cal-grid-day-label">{d}</div>
        ))}
      </div>

      <div className="cal-grid">
        {Array.from({ length: rows * 7 }).map((_, i) => {
          const day = i - firstWeekday + 1;
          const isValid = day >= 1 && day <= daysInMonth;

          if (!isValid) {
            return <div key={i} className="cal-cell empty" />;
          }

          const dk = cellDateKey(day);
          const isPast = dk < today;
          const isToday = isCurrentMonth && day === todayDay;
          const isFutureGated = !user && !isPast && !isToday;

          let cellClass = 'cal-cell';
          if (isPast) cellClass += ' past';
          if (isToday) cellClass += ' is-today';
          if (isFutureGated) cellClass += ' future-gated';

          return (
            <button
              key={i}
              className={cellClass}
              onClick={() => handleDayClick(day)}
              aria-label={`${day} ${monthNames[month]}`}
            >
              <span className="cal-cell-num">{day}</span>
              {isFutureGated && (
                <span className="cal-cell-lock">
                  <Lock size={10} />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
