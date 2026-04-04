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

  const formatDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (day: number) => {
    if (!user) {
      if (onAuthClick) onAuthClick();
      return;
    }
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateKey = formatDateKey(selectedDate);
    if (onDateSelect) onDateSelect(dateKey);
  };

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => null);

  const isCurrentMonth =
    currentDate.getMonth() === new Date().getMonth() &&
    currentDate.getFullYear() === new Date().getFullYear();

  const todayDate = today.split('-')[2];

  return (
    <div className="month-calendar">
      <div className="month-calendar-header">
        <button
          className="month-nav-btn month-nav-prev"
          onClick={handlePrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>

        <div className="month-header-center">
          <h3 className="month-header-title">{monthName}</h3>
          <button
            className="month-today-btn"
            onClick={handleToday}
          >
            Today
          </button>
        </div>

        <button
          className="month-nav-btn month-nav-next"
          onClick={handleNextMonth}
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="month-weekdays">
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
          <div key={day} className="month-weekday">{day}</div>
        ))}
      </div>

      <div className="month-grid">
        {[...emptyDays, ...days].map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="month-cell month-cell-empty" />;
          }

          const dateStr = formatDateKey(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
          const isToday = isCurrentMonth && day === parseInt(todayDate);
          const isPast = dateStr < today;
          const isClickable = user && !isPast;

          return (
            <button
              key={day}
              className={`month-cell ${isToday ? 'month-cell-today' : ''} ${isPast ? 'month-cell-past' : ''} ${isClickable ? 'month-cell-clickable' : ''}`}
              onClick={() => handleDateClick(day)}
              disabled={!isClickable && !user}
              aria-label={`${day} ${monthName}${isPast ? ' (past)' : ''}`}
            >
              <span className="month-cell-date">{day}</span>
              {!user && !isToday && !isPast && (
                <Lock size={12} className="month-cell-lock" />
              )}
            </button>
          );
        })}
      </div>

      {!user && (
        <div className="month-gate-banner">
          <div className="month-gate-banner-inner">
            <Lock size={20} />
            <div>
              <p className="month-gate-heading">See the Full Week</p>
              <p className="month-gate-sub">Create a free account to unlock the full weekly calendar</p>
            </div>
            <button className="month-gate-btn" onClick={onAuthClick}>
              Create Free Account
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
