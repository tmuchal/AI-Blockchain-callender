import { useState } from 'react';
import { EVENTS } from './events';
import type { BlockchainEvent } from './events';
import './Calendar.css';

const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'];
const MONTH_NAMES = ['1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getEventsForDate(dateStr: string): BlockchainEvent[] {
  return EVENTS.filter(e => e.startDate <= dateStr && dateStr <= e.endDate);
}

export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

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

  // pad to full weeks
  while (cells.length % 7 !== 0) cells.push(null);

  const upcomingEvents = EVENTS.filter(e => e.endDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="calendar-wrap">
      <div className="cal-header">
        <button onClick={prevMonth}>&#8249;</button>
        <span>{year}년 {MONTH_NAMES[month]}</span>
        <button onClick={nextMonth}>&#8250;</button>
      </div>

      <div className="cal-grid">
        {WEEK_DAYS.map(d => (
          <div key={d} className="cal-weekday">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} className="cal-cell empty" />;
          const dateStr = toDateStr(year, month, day);
          const dayEvents = getEventsForDate(dateStr);
          const isToday = dateStr === todayStr;
          return (
            <div key={dateStr} className={`cal-cell${isToday ? ' today' : ''}`}>
              <span className="day-num">{day}</span>
              <div className="day-events">
                {dayEvents.map(e => (
                  <span
                    key={e.id}
                    className="event-dot"
                    style={{ background: e.color }}
                    title={e.name}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="event-legend">
        <h3>행사 일정</h3>
        {upcomingEvents.length === 0 ? (
          <p className="no-events">예정된 행사가 없습니다.</p>
        ) : (
          upcomingEvents.map(e => (
            <a
              key={e.id}
              href={e.url}
              target="_blank"
              rel="noreferrer"
              className="event-card"
              style={{ borderLeft: `4px solid ${e.color}` }}
            >
              <div className="event-card-name">{e.name}</div>
              <div className="event-card-meta">
                <span>{e.location}</span>
                <span>
                  {e.startDate} ~ {e.endDate}
                </span>
              </div>
            </a>
          ))
        )}
      </div>
    </div>
  );
}
