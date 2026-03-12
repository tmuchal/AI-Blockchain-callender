import { useState, useEffect, useRef } from 'react';
import { EVENTS } from './events';
import type { BlockchainEvent } from './events';
import './Calendar.css';

const WEEK_DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_NAMES = [
  '1월', '2월', '3월', '4월', '5월', '6월',
  '7월', '8월', '9월', '10월', '11월', '12월',
];

// ── Pixel Art T-Rex ────────────────────────────────────────────────────────────
const PX = 4;
const TREX_FRAME1 = [
  [0,0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,0,1,0,0,0,0,0],
  [0,0,0,0,1,0,0,1,0,0,0,0,0],
];
const TREX_FRAME2 = [
  [0,0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,1,0,0,0,0],
  [0,0,0,0,0,1,2,1,1,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,0],
  [0,0,0,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,0,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,0,0,0,0,0],
];
const TREX_W = TREX_FRAME1[0].length * PX;
const TREX_H = TREX_FRAME1.length * PX;

function PixelTRex({ stageWidth }: { stageWidth: number }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (stageWidth <= TREX_W || !containerRef.current) return;
    let posX = 0;
    let direction = 1;
    let framePhase = 0;
    let tick = 0;
    let raf: number;

    function animate() {
      posX += direction * 0.9;
      const maxX = stageWidth - TREX_W - 8;
      if (posX >= maxX) { posX = maxX; direction = -1; }
      if (posX <= 0) { posX = 0; direction = 1; }
      tick++;
      if (tick % 12 === 0) {
        framePhase = 1 - framePhase;
        setFrame(framePhase);
      }
      if (containerRef.current) {
        containerRef.current.style.left = `${posX}px`;
        containerRef.current.style.transform = direction === -1 ? 'scaleX(-1)' : 'none';
      }
      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [stageWidth]);

  const pixels = frame === 0 ? TREX_FRAME1 : TREX_FRAME2;
  return (
    <div
      ref={containerRef}
      style={{ position: 'absolute', bottom: 8, left: 0, pointerEvents: 'none' }}
    >
      <svg
        width={TREX_W}
        height={TREX_H}
        style={{ display: 'block', imageRendering: 'pixelated' }}
      >
        {pixels.flatMap((row, ry) =>
          row.map((cell, rx) => {
            if (!cell) return null;
            return (
              <rect
                key={`${rx}-${ry}`}
                x={rx * PX}
                y={ry * PX}
                width={PX}
                height={PX}
                fill={cell === 2 ? '#0c0c18' : '#4ade80'}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getEventsForDate(dateStr: string): BlockchainEvent[] {
  return EVENTS.filter(e => e.startDate <= dateStr && dateStr <= e.endDate);
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

// ── Event Modal ────────────────────────────────────────────────────────────────
function EventModal({ event, onClose }: { event: BlockchainEvent; onClose: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const days = getDaysUntil(event.startDate);
  const statusText = days < 0 ? '종료됨' : days === 0 ? '오늘 진행 중!' : `${days}일 후`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        <div className="modal-hero" style={{ borderTopColor: event.color }}>
          <div className="modal-hero-bg" style={{ background: `${event.color}18` }} />
          <span className="modal-emoji">{event.emoji}</span>
          <div className="modal-tags">
            {event.tags.map(tag => (
              <span
                key={tag}
                className="modal-tag"
                style={{ background: `${event.color}22`, color: event.color, borderColor: `${event.color}44` }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="modal-body">
          <h2 className="modal-title">{event.name}</h2>
          <div className="modal-meta">
            <div className="modal-meta-row">
              <span className="modal-meta-icon">📍</span>
              <span>{event.location}</span>
            </div>
            <div className="modal-meta-row">
              <span className="modal-meta-icon">🗓</span>
              <span>{event.startDate} ~ {event.endDate}</span>
            </div>
            <div className="modal-meta-row">
              <span className="modal-meta-icon">👥</span>
              <span>{event.attendees}</span>
            </div>
            <div className="modal-meta-row">
              <span className="modal-meta-icon">🎟</span>
              <span>{event.ticketPrice}</span>
            </div>
            <div className="modal-meta-row">
              <span className="modal-meta-icon">⏱</span>
              <span style={{ color: days < 0 ? '#aaa' : days === 0 ? '#f7931a' : '#4f6ef7', fontWeight: 700 }}>
                {statusText}
              </span>
            </div>
          </div>

          <p className="modal-desc">{event.description}</p>

          <div className="modal-actions">
            <CountdownBadge dateStr={event.startDate} />
            <a
              href={event.url}
              target="_blank"
              rel="noreferrer"
              className="modal-btn"
              style={{ background: event.color }}
            >
              공식 사이트 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Calendar ──────────────────────────────────────────────────────────────
export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<BlockchainEvent | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageWidth, setStageWidth] = useState(0);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => setStageWidth(entries[0].contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11); }
    else setMonth(m => m - 1);
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0); }
    else setMonth(m => m + 1);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const upcomingEvents = EVENTS
    .filter(e => e.endDate >= todayStr)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));

  const monthHasEvents = EVENTS.some(e => {
    const em = parseInt(e.startDate.slice(5, 7)) - 1;
    const ey = parseInt(e.startDate.slice(0, 4));
    return ey === year && em === month;
  });

  return (
    <div className="calendar-wrap">
      {/* Header */}
      <div className="cal-header">
        <button className="nav-btn" onClick={prevMonth}>‹</button>
        <div className="cal-title">
          <span className="cal-year-label">{year}</span>
          <span className="cal-month-label">{MONTH_NAMES[month]}</span>
          {monthHasEvents && <span className="cal-event-dot" />}
        </div>
        <button className="nav-btn" onClick={nextMonth}>›</button>
      </div>

      {/* Dino Stage */}
      <div className="dino-stage" ref={stageRef}>
        <div className="dino-stars">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="dino-star" style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%` }} />
          ))}
        </div>
        <PixelTRex stageWidth={stageWidth} />
        <div className="dino-ground" />
      </div>

      {/* Calendar Grid */}
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
              ].filter(Boolean).join(' ')}
            >
              <span className="day-num">{day}</span>
              <div className="day-events">
                {dayEvents.map(e => (
                  <div
                    key={e.id}
                    className={`event-bar${e.startDate === dateStr ? ' event-start' : ''}`}
                    style={{ background: e.color }}
                    onMouseEnter={() => setHoveredEvent(e.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    onClick={() => setSelectedEvent(e)}
                    title={e.name}
                  >
                    {e.startDate === dateStr && (
                      <span className="event-bar-label">
                        {e.emoji} {e.name.split(' ').slice(0, 2).join(' ')}
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
        <div className="event-section-title">⚡ 다가오는 행사</div>
        {upcomingEvents.length === 0 ? (
          <p className="no-events">예정된 행사가 없습니다.</p>
        ) : (
          <div className="event-cards">
            {upcomingEvents.map(e => (
              <div
                key={e.id}
                className={`event-card${hoveredEvent === e.id ? ' card-hovered' : ''}`}
                style={{ '--accent': e.color } as React.CSSProperties}
                onMouseEnter={() => setHoveredEvent(e.id)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => setSelectedEvent(e)}
              >
                <div className="card-emoji">{e.emoji}</div>
                <div className="card-info">
                  <div className="card-name">{e.name}</div>
                  <div className="card-location">📍 {e.location}</div>
                  <div className="card-dates">🗓 {e.startDate} ~ {e.endDate}</div>
                  <div className="card-tags">
                    {e.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="card-tag" style={{ background: `${e.color}18`, color: e.color }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <CountdownBadge dateStr={e.startDate} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedEvent && (
        <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}
    </div>
  );
}
