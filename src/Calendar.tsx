import { useState, useEffect, useRef } from 'react';
import { EVENTS } from './events';
import type { BlockchainEvent } from './events';
import './Calendar.css';

// ── Pixel T-Rex ───────────────────────────────────────────────────────────────
const PX = 5;
const FRAMES: number[][][] = [
  [[0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,1,1,1,1,1,0,0,0,0],[0,0,0,1,1,2,1,1,0,0,0,0],[0,0,1,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,1,1,0,0,0],[0,0,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,0,0,0,0,0,0],[0,0,0,1,1,0,1,1,0,0,0,0],[0,0,0,1,0,0,0,1,0,0,0,0],[0,0,1,1,0,0,1,1,0,0,0,0]],
  [[0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,1,1,1,1,1,0,0,0,0],[0,0,0,1,1,2,1,1,0,0,0,0],[0,0,1,1,1,1,1,1,1,1,0,0],[0,1,1,1,1,1,1,1,1,1,1,0],[0,1,1,1,1,1,1,1,1,1,0,0],[0,0,1,1,1,1,1,1,1,0,0,0],[0,0,1,1,1,1,1,1,0,0,0,0],[0,0,0,0,1,1,0,0,0,0,0,0],[0,0,0,0,1,1,1,0,0,0,0,0],[0,0,0,0,0,1,1,1,0,0,0,0],[0,0,0,0,0,0,1,1,0,0,0,0]],
];
const TW = FRAMES[0][0].length * PX, TH = FRAMES[0].length * PX;

function TRex({ areaRef }: { areaRef: React.RefObject<HTMLDivElement | null> }) {
  const el = useRef<HTMLDivElement>(null);
  const [frame, setFrame] = useState(0);
  useEffect(() => {
    let x = 60, y = 60, vx = 2.4, vy = 1.6, f = 0, tick = 0, raf: number;
    function loop() {
      const area = areaRef.current;
      if (area) {
        const W = area.clientWidth, H = area.clientHeight;
        x += vx; y += vy;
        if (x > W - TW) { x = W - TW; vx = -Math.abs(vx); }
        if (x < 0) { x = 0; vx = Math.abs(vx); }
        if (y > H - TH) { y = H - TH; vy = -Math.abs(vy); }
        if (y < 0) { y = 0; vy = Math.abs(vy); }
        tick++;
        if (tick % 8 === 0) { f = 1 - f; setFrame(f); }
        if (el.current) {
          el.current.style.left = x + 'px';
          el.current.style.top = y + 'px';
          el.current.style.transform = vx < 0 ? 'scaleX(-1)' : '';
        }
      }
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [areaRef]);
  return (
    <div ref={el} style={{ position: 'absolute', pointerEvents: 'none', zIndex: 20, left: 60, top: 60 }}>
      <svg width={TW} height={TH} style={{ display: 'block', imageRendering: 'pixelated' }}>
        {FRAMES[frame].flatMap((row, ry) => row.map((c, rx) =>
          c ? <rect key={`${rx}-${ry}`} x={rx*PX} y={ry*PX} width={PX} height={PX} fill={c===2?'#fff':'#22c55e'} /> : null
        ))}
      </svg>
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const WEEK = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function pad(n: number) { return String(n).padStart(2,'0'); }
function ds(y: number, m: number, d: number) { return `${y}-${pad(m+1)}-${pad(d)}`; }
function daysUntil(s: string) {
  const t = new Date(); t.setHours(0,0,0,0);
  return Math.ceil((new Date(s).getTime() - t.getTime()) / 86400000);
}

function Badge({ s }: { s: string }) {
  const [d, setD] = useState(daysUntil(s));
  useEffect(() => { const t = setInterval(() => setD(daysUntil(s)), 60000); return () => clearInterval(t); }, [s]);
  if (d < 0) return <span className="badge past">종료</span>;
  if (d === 0) return <span className="badge today">TODAY🔥</span>;
  return <span className="badge future">D-{d}</span>;
}

function Modal({ ev, onClose }: { ev: BlockchainEvent; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', h);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', h); document.body.style.overflow = ''; };
  }, [onClose]);
  const d = daysUntil(ev.startDate);
  const st = d < 0 ? '종료됨' : d === 0 ? '오늘!' : `${d}일 후`;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="mcard" onClick={e => e.stopPropagation()}>
        <button className="mclose" onClick={onClose}>×</button>
        <div className="mhero" style={{ background: `${ev.color}20`, borderTopColor: ev.color }}>
          <span style={{ fontSize: '2.5rem' }}>{ev.emoji}</span>
          <div className="mtags">{ev.tags.map(t => <span key={t} className="mtag" style={{ background: `${ev.color}25`, color: ev.color }}>{t}</span>)}</div>
        </div>
        <div className="mbody">
          <h2 className="mtitle">{ev.name}</h2>
          {([['📍',ev.location],['🗓',`${ev.startDate} ~ ${ev.endDate}`],['👥',ev.attendees],['🎟',ev.ticketPrice],['⏱',st]] as [string,string][]).map(([i,v],idx) => (
            <div key={idx} className="mrow"><span>{i}</span><span style={idx===4?{color:d<0?'#aaa':d===0?'#f59e0b':'#4f6ef7',fontWeight:700}:{}}>{v}</span></div>
          ))}
          <p className="mdesc">{ev.description}</p>
          <div className="mfoot"><Badge s={ev.startDate} /><a href={ev.url} target="_blank" rel="noreferrer" className="mlink" style={{ background: ev.color }}>공식 사이트 →</a></div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Calendar() {
  const now = new Date();
  const todayStr = ds(now.getFullYear(), now.getMonth(), now.getDate());
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [sel, setSel] = useState<BlockchainEvent | null>(null);
  const [hov, setHov] = useState<string | null>(null);
  const calRef = useRef<HTMLDivElement>(null);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDow = new Date(year, month, 1).getDay();
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({length: daysInMonth}, (_,i) => i+1)];
  while (cells.length % 7) cells.push(null);

  const monthStart = ds(year, month, 1), monthEnd = ds(year, month, daysInMonth);
  const monthEvents = EVENTS.filter(e => e.startDate <= monthEnd && e.endDate >= monthStart);

  function getDay(d: number) {
    const s = ds(year, month, d);
    return monthEvents.filter(e => e.startDate <= s && e.endDate >= s);
  }

  const allUpcoming = EVENTS.filter(e => e.endDate >= todayStr).sort((a,b) => a.startDate.localeCompare(b.startDate));

  return (
    <div className="root">
      {/* Topbar */}
      <div className="topbar">
        <div className="brand">🌏 <strong>Asia AI · Blockchain Calendar</strong><span className="sub">글로벌 AI · 블록체인 컨퍼런스</span></div>
        <div className="nav">
          <button className="nbtn" onClick={() => { if (month===0){setYear(y=>y-1);setMonth(11);}else setMonth(m=>m-1); }}>‹</button>
          <span className="cur">{MONTHS[month]} {year}</span>
          <button className="nbtn" onClick={() => { if (month===11){setYear(y=>y+1);setMonth(0);}else setMonth(m=>m+1); }}>›</button>
          <button className="nbtn today-btn" onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); }}>Today</button>
        </div>
      </div>

      {/* Calendar with T-Rex */}
      <div className="cal-area" ref={calRef}>
        <TRex areaRef={calRef} />
        <div className="week-row">{WEEK.map(w => <div key={w} className="wday">{w}</div>)}</div>
        <div className="grid">
          {cells.map((day, i) => {
            if (!day) return <div key={`e${i}`} className="cell empty" />;
            const dateStr = ds(year, month, day);
            const isToday = dateStr === todayStr;
            const dayEvs = getDay(day);
            return (
              <div key={dateStr} className={`cell${isToday?' is-today':''}${dayEvs.length?' has-ev':''}`}>
                <span className="dnum">{day}</span>
                <div className="ev-list">
                  {dayEvs.slice(0,3).map(e => (
                    <div key={e.id} className={`ev-pill${hov===e.id?' hov':''}${e.startDate===dateStr?' start':''}`}
                      style={{ background: e.color }}
                      onMouseEnter={() => setHov(e.id)} onMouseLeave={() => setHov(null)}
                      onClick={() => setSel(e)}>
                      {e.startDate===dateStr && <span className="ev-lbl">{e.emoji} {e.name}</span>}
                    </div>
                  ))}
                  {dayEvs.length>3 && <div className="ev-more">+{dayEvs.length-3}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Notion-style table */}
      <div className="notion-table">
        <div className="nt-header">
          <div className="nt-col w-em"></div>
          <div className="nt-col w-name">행사명</div>
          <div className="nt-col w-loc">장소</div>
          <div className="nt-col w-date">날짜</div>
          <div className="nt-col w-att">규모</div>
          <div className="nt-col w-dday">D-day</div>
          <div className="nt-col w-tags">태그</div>
        </div>
        {allUpcoming.map(e => (
          <div key={e.id} className={`nt-row${hov===e.id?' nt-hov':''}`}
            style={{ '--c': e.color } as React.CSSProperties}
            onMouseEnter={() => setHov(e.id)} onMouseLeave={() => setHov(null)}
            onClick={() => setSel(e)}>
            <div className="nt-col w-em"><span>{e.emoji}</span></div>
            <div className="nt-col w-name"><span className="nt-name">{e.name}</span></div>
            <div className="nt-col w-loc"><span className="nt-meta">📍 {e.location}</span></div>
            <div className="nt-col w-date"><span className="nt-meta">{e.startDate.slice(5)} ~ {e.endDate.slice(5)}</span></div>
            <div className="nt-col w-att"><span className="nt-meta">{e.attendees}</span></div>
            <div className="nt-col w-dday"><Badge s={e.startDate} /></div>
            <div className="nt-col w-tags">
              {e.tags.slice(0,3).map(t => <span key={t} className="nt-tag" style={{ background: `${e.color}18`, color: e.color }}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>

      {sel && <Modal ev={sel} onClose={() => setSel(null)} />}
    </div>
  );
}
