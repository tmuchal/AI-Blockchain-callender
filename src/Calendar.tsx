import { useState, useEffect, useRef } from 'react';
import { EVENTS } from './events';
import type { BlockchainEvent } from './events';
import './Calendar.css';

const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const PX = 4;
const TREX_FRAMES = [
  [ // frame 0
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
  ],
  [ // frame 1
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
  ],
];
const TREX_W = TREX_FRAMES[0][0].length * PX;
const TREX_H = TREX_FRAMES[0].length * PX;

function PixelTRex({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const trexRef = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    let posX = 0, posY = 0, dx = 1.2, dy = 0.6, tick = 0, f = 0, raf: number;

    function animate() {
      const el = containerRef.current;
      if (!el) { raf = requestAnimationFrame(animate); return; }
      const W = el.offsetWidth, H = el.offsetHeight;
      posX += dx; posY += dy;
      if (posX >= W - TREX_W) { posX = W - TREX_W; dx = -Math.abs(dx); }
      if (posX <= 0) { posX = 0; dx = Math.abs(dx); }
      if (posY >= H - TREX_H) { posY = H - TREX_H; dy = -Math.abs(dy); }
      if (posY <= 0) { posY = 0; dy = Math.abs(dy); }
      tick++;
      if (tick % 10 === 0) { f = 1 - f; setFrame(f); }
      if (trexRef.current) {
        trexRef.current.style.left = `${posX}px`;
        trexRef.current.style.top = `${posY}px`;
        trexRef.current.style.transform = dx < 0 ? 'scaleX(-1)' : 'none';
      }
      raf = requestAnimationFrame(animate);
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [containerRef]);

  const pixels = TREX_FRAMES[frame];
  return (
    <div ref={trexRef} style={{ position: 'absolute', left: 0, top: 0, pointerEvents: 'none', zIndex: 10 }}>
      <svg width={TREX_W} height={TREX_H} style={{ display: 'block', imageRendering: 'pixelated' }}>
        {pixels.flatMap((row, ry) => row.map((cell, rx) => {
          if (!cell) return null;
          return <rect key={`${rx}-${ry}`} x={rx*PX} y={ry*PX} width={PX} height={PX}
            fill={cell === 2 ? '#0c0c18' : '#4ade80'} />;
        }))}
      </svg>
    </div>
  );
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getDaysUntil(dateStr: string) {
  const today = new Date(); today.setHours(0,0,0,0);
  return Math.ceil((new Date(dateStr).getTime() - today.getTime()) / 86400000);
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

function EventModal({ event, onClose }: { event: BlockchainEvent; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
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
              <span key={tag} className="modal-tag"
                style={{ background: `${event.color}22`, color: event.color, borderColor: `${event.color}44` }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="modal-body">
          <h2 className="modal-title">{event.name}</h2>
          <div className="modal-meta">
            {([
              ['📍', event.location],
              ['🗓', `${event.startDate} ~ ${event.endDate}`],
              ['👥', event.attendees],
              ['🎟', event.ticketPrice],
              ['⏱', statusText],
            ] as [string, string][]).map(([icon, text], i) => (
              <div key={i} className="modal-meta-row">
                <span className="modal-meta-icon">{icon}</span>
                <span style={i === 4 ? { color: days < 0 ? '#aaa' : days === 0 ? '#f7931a' : '#4f6ef7', fontWeight: 700 } : {}}>{text}</span>
              </div>
            ))}
          </div>
          <p className="modal-desc">{event.description}</p>
          <div className="modal-actions">
            <CountdownBadge dateStr={event.startDate} />
            <a href={event.url} target="_blank" rel="noreferrer" className="modal-btn" style={{ background: event.color }}>
              공식 사이트 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Calendar() {
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const [year, setYear] = useState(today.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState<BlockchainEvent | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const calendarAreaRef = useRef<HTMLDivElement>(null);

  const DAY_W = 28;

  return (
    <div className="cal-root">
      {/* Header */}
      <div className="cal-topbar">
        <div className="cal-brand">
          <span className="cal-brand-icon">🌏</span>
          <div>
            <div className="cal-brand-title">Asia AI · Blockchain Calendar</div>
            <div className="cal-brand-sub">글로벌 AI · 블록체인 컨퍼런스 일정</div>
          </div>
        </div>
        <div className="cal-year-nav">
          <button className="nav-btn" onClick={() => setYear(y => y - 1)}>‹</button>
          <span className="cal-year">{year}</span>
          <button className="nav-btn" onClick={() => setYear(y => y + 1)}>›</button>
        </div>
      </div>

      {/* Timeline with T-Rex overlay */}
      <div className="timeline-wrap" ref={calendarAreaRef}>
        <PixelTRex containerRef={calendarAreaRef} />

        <div className="timeline-scroll">
          <div className="timeline-inner">
            {Array.from({ length: 12 }, (_, mi) => {
              const days = getDaysInMonth(year, mi);
              const monthEvents = EVENTS.filter(e => {
                const sy = parseInt(e.startDate.slice(0, 4)), sm = parseInt(e.startDate.slice(5, 7)) - 1;
                const ey2 = parseInt(e.endDate.slice(0, 4)), em2 = parseInt(e.endDate.slice(5, 7)) - 1;
                return (sy < year || (sy === year && sm <= mi)) && (ey2 > year || (ey2 === year && em2 >= mi));
              });

              return (
                <div key={mi} className="tl-month-row">
                  <div className="tl-month-label">
                    <span className="tl-month-name">{MONTH_NAMES[mi]}</span>
                    {monthEvents.length > 0 && <span className="tl-month-count">{monthEvents.length}</span>}
                  </div>

                  <div className="tl-days-area" style={{ width: days * DAY_W }}>
                    <div className="tl-day-headers">
                      {Array.from({ length: days }, (_, d) => {
                        const dateStr = toDateStr(year, mi, d + 1);
                        const dow = new Date(year, mi, d + 1).getDay();
                        const isToday = dateStr === todayStr;
                        return (
                          <div key={d}
                            className={`tl-day-cell${isToday ? ' tl-today' : ''}${dow === 0 ? ' tl-sun' : dow === 6 ? ' tl-sat' : ''}`}
                            style={{ width: DAY_W }}>
                            {d + 1}
                          </div>
                        );
                      })}
                    </div>

                    {today.getFullYear() === year && today.getMonth() === mi && (
                      <div className="tl-today-line" style={{ left: (today.getDate() - 0.5) * DAY_W }} />
                    )}

                    <div className="tl-event-rows">
                      {monthEvents.map(e => {
                        const monthStart = toDateStr(year, mi, 1);
                        const monthEnd = toDateStr(year, mi, days);
                        const startStr = e.startDate < monthStart ? monthStart : e.startDate;
                        const endStr = e.endDate > monthEnd ? monthEnd : e.endDate;
                        const startDay = parseInt(startStr.slice(8)) - 1;
                        const endDay = parseInt(endStr.slice(8)) - 1;
                        const isStart = e.startDate >= monthStart;
                        return (
                          <div key={e.id}
                            className={`tl-event-bar${hoveredId === e.id ? ' tl-event-hovered' : ''}`}
                            style={{ left: startDay * DAY_W + 2, width: (endDay - startDay + 1) * DAY_W - 4, background: e.color }}
                            onMouseEnter={() => setHoveredId(e.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            onClick={() => setSelectedEvent(e)}
                            title={e.name}
                          >
                            {isStart && <span className="tl-event-label">{e.emoji} {e.name}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <div className="event-section">
        <div className="event-section-title">⚡ 다가오는 행사</div>
        <div className="event-cards">
          {EVENTS.filter(e => e.endDate >= todayStr)
            .sort((a, b) => a.startDate.localeCompare(b.startDate))
            .map(e => (
              <div key={e.id}
                className={`event-card${hoveredId === e.id ? ' card-hovered' : ''}`}
                style={{ '--accent': e.color } as React.CSSProperties}
                onMouseEnter={() => setHoveredId(e.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => setSelectedEvent(e)}
              >
                <div className="card-emoji">{e.emoji}</div>
                <div className="card-info">
                  <div className="card-name">{e.name}</div>
                  <div className="card-location">📍 {e.location}</div>
                  <div className="card-dates">🗓 {e.startDate} ~ {e.endDate}</div>
                  <div className="card-tags">
                    {e.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="card-tag" style={{ background: `${e.color}18`, color: e.color }}>{tag}</span>
                    ))}
                  </div>
                </div>
                <CountdownBadge dateStr={e.startDate} />
              </div>
            ))}
        </div>
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </div>
  );
}
