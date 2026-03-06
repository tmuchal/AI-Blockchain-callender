import { useState, useEffect } from 'react';
import { EVENTS } from './events';
import type { BlockchainEvent } from './events';
import './Calendar.css';

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
  'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function getEventsForDate(dateStr: string): BlockchainEvent[] {
  return EVENTS.filter(e => e.startDate <= dateStr && dateStr <= e.endDate);
}

function isEventStart(event: BlockchainEvent, dateStr: string) {
  return event.startDate === dateStr;
}

function getDaysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function CountdownBadge({ dateStr }: { dateStr: string }) {
  const [days, setDays] = useState(getDaysUntil(dateStr));
  useEffect(() => {
    const t = setInterval(() => setDays(getDaysUntil(dateStr)), 60000);
    return () => clearInterval(t);
  }, [dateStr]);

  if (days < 0) return <span className="badge badge-past">종료</span>;
  if (days === 0) return <span className="badge badge-today">오늘! 🔥</span>;
  return <span className="badge badge-future">D-{days}</span>;
}

export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const upcomingEvents = EVENTS
    .filter(e => e.endDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="calendar-wrap">
      {/* Header */}
      <div className="cal-header">
        <button className="nav-btn" onClick={prevMonth}>‹</button>
        <div className="cal-title">
          <span className="cal-month">{MONTH_NAMES[month]}</span>
          <span className="cal-year">{year}</span>
        </div>
        <button className="nav-btn" onClick={nextMonth}>›</button>
      </div>

      {/* Grid */}
      <div className="cal-grid">
        {WEEK_DAYS.map(d => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} className="cal-cell empty" />;
          const dateStr = toDateStr(year, month, day);
          const dayEvents = getEventsForDate(dateStr);
          const isToday = dateStr === todayStr;
          const isHovered = dayEvents.some(e => e.id === hoveredEvent);

          return (
            <div
              key={dateStr}
              className={[
                'cal-cell',
                isToday ? 'today' : '',
                dayEvents.length > 0 ? 'has-event' : '',
                isHovered ? 'highlight' : '',
              ].join(' ')}
            >
              <span className="day-num">{day}</span>
              <div className="day-events">
                {dayEvents.map(e => (
                  <div
                    key={e.id}
                    className={`event-bar${isEventStart(e, dateStr) ? ' event-start' : ''}`}
                    style={{ background: e.color }}
                    onMouseEnter={() => setHoveredEvent(e.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    title={e.name}
                  >
                    {isEventStart(e, dateStr) && (
                      <span className="event-bar-label">
                        {e.emoji} {e.name.split(' ').pop()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Events */}
      <div className="event-section">
        <div className="event-section-title">
          <span>⚡ 다가오는 행사</span>
        </div>
        {upcomingEvents.length === 0 ? (
          <p className="no-events">예정된 행사가 없습니다.</p>
        ) : (
          <div className="event-cards">
            {upcomingEvents.map(e => (
              <a
                key={e.id}
                href={e.url}
                target="_blank"
                rel="noreferrer"
                className={`event-card${hoveredEvent === e.id ? ' card-hovered' : ''}`}
                style={{ '--accent': e.color } as React.CSSProperties}
                onMouseEnter={() => setHoveredEvent(e.id)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                <div className="card-emoji">{e.emoji}</div>
                <div className="card-info">
                  <div className="card-name">{e.name}</div>
                  <div className="card-location">📍 {e.location}</div>
                  <div className="card-dates">🗓 {e.startDate} ~ {e.endDate}</div>
                </div>
                <CountdownBadge dateStr={e.startDate} />
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
