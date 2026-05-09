// ==========================================
// 1. 数据配置与解析区 (Data & Config)
// ==========================================
import { React } from "uebersicht";

// 【你的 Moodle 日历同步链接】
const MOODLE_URL = "https://moodle.hku.hk/calendar/export_execute.php?userid=324899&authtoken=77df42d9aea44d7787f086c49b6586848918d6a8&preset_what=all&preset_time=recentupcoming";

export const command = `curl -sL "${MOODLE_URL}"`;
export const refreshFrequency = 3600000; 

// 【手动事件添加区】
const customEvents = [
  { code: "MATH3911", name: "Game theory and strategy", date: "2026-05-12T14:30:00" },
  { code: "STAT2602", name: "Probability and statistics II", date: "2026-05-16T18:30:00" },
  { code: "IIMT2601", name: "Management information systems", date: "2026-05-19T09:30:00" },
  { code: "ECON2280", name: "Introductory econometrics", date: "2026-05-23T18:30:00" }
];

// 【独立的 .ics 智能解析器】：修复了 Assignment 单词截断问题
export const parseMoodleEvents = (icalText) => {
  if (!icalText || !icalText.includes("BEGIN:VEVENT")) return [];
  
  const events = [];
  const lines = icalText.split(/\r\n|\n|\r/);
  let currentEvent = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "BEGIN:VEVENT") {
      currentEvent = { code: "EVENT", name: "Moodle Task", date: "" };
    } else if (line === "END:VEVENT") {
      if (currentEvent && currentEvent.date) events.push(currentEvent);
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith("SUMMARY:")) {
        const summary = line.substring(8).trim();
        const match = summary.match(/^([A-Z0-9]{4,8})\s*[:-]\s*(.*)$/i) || summary.match(/^\[([A-Z0-9]{4,8})\]\s*(.*)$/i);
        if (match) {
          currentEvent.code = match[1];
          currentEvent.name = match[2];
        } else {
          currentEvent.name = summary;
          const firstWord = summary.split(" ")[0];
          // 修复：放宽限制到15个字符，完整的 Assignment 不会被强行截断
          currentEvent.code = firstWord.length <= 15 ? firstWord : firstWord.substring(0, 12) + "...";
        }
      } else if (line.startsWith("DTSTART")) {
         const colonIdx = line.indexOf(":");
         if (colonIdx > -1) {
           const dt = line.substring(colonIdx + 1).trim();
           const isUTC = dt.endsWith('Z');
           const cleanDt = dt.replace(/Z$/, '');
           
           if (cleanDt.length >= 15) {
             const year = cleanDt.substring(0, 4);
             const month = cleanDt.substring(4, 6);
             const day = cleanDt.substring(6, 8);
             const hour = cleanDt.substring(9, 11);
             const min = cleanDt.substring(11, 13);
             const sec = cleanDt.substring(13, 15);
             currentEvent.date = `${year}-${month}-${day}T${hour}:${min}:${sec}${isUTC ? 'Z' : ''}`;
           } else if (cleanDt.length === 8) {
             const year = cleanDt.substring(0, 4);
             const month = cleanDt.substring(4, 6);
             const day = cleanDt.substring(6, 8);
             currentEvent.date = `${year}-${month}-${day}T00:00:00`;
           }
         }
      }
    }
  }
  return events;
};

// ==========================================
// 2. 样式区 (CSS)
// ==========================================
export const className = `
  top: 0px;
  left: 2px;
  user-select: none;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;

  ::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  * {
    scrollbar-width: none; 
    -ms-overflow-style: none; 
  }

  .glass-card {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: row;
    width: 760px; 
    height: 640px; 
    box-sizing: border-box;
    padding: 28px 32px; 
    border-radius: 34px;
    color: white;
    contain: layout paint style;
    transform: translate3d(0, 0, 0);
  }

  .glass-background {
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    z-index: -1; 
    border-radius: inherit;
    background-color: rgba(35, 42, 53, 0.55); 
    backdrop-filter: blur(30px) saturate(150%);
    -webkit-backdrop-filter: blur(30px) saturate(150%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.2), inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 30px 60px rgba(0, 0, 0, 0.45); 
    contain: strict;
    transform: translate3d(0, 0, 0);
    -webkit-transform: translate3d(0, 0, 0);
    will-change: transform, -webkit-backdrop-filter, backdrop-filter;
  }

  .vertical-divider { width: 1px; background: rgba(255, 255, 255, 0.08); margin: 0 32px; flex-shrink: 0; }

  /* ================= 左侧：进度与所有日程 ================= */
  .left-panel {
    display: flex; flex-direction: column; width: 290px; flex-shrink: 0;
    transform: translate3d(0, 0, 0); contain: layout; height: 100%;
  }
  
  .fixed-header-area { display: flex; flex-direction: column; gap: 20px; flex-shrink: 0; }
  
  .header-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 600; color: rgba(255, 255, 255, 0.75); }
  .title-group { display: flex; align-items: center; gap: 6px; color: #C37636; letter-spacing: 1px; }
  .percentage-text { font-size: 2.8rem; font-weight: 700; line-height: 1; letter-spacing: -1.5px; color: #fff; }
  .days-text { font-size: 0.85rem; color: rgba(255, 255, 255, 0.75); }
  .track { width: 100%; height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 3px; overflow: hidden; }
  .fill { height: 100%; background: linear-gradient(90deg, #C37636, #A65D24); border-radius: 3px; }
  .horizontal-divider { height: 1px; background: rgba(255, 255, 255, 0.05); margin: 20px 0; flex-shrink: 0; }

  /* 局部滚动区域 */
  .scroll-area {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
  }

  .exam-list { display: flex; flex-direction: column; gap: 20px; }
  .secondary-items-container { display: flex; flex-direction: column; gap: 20px; border-left: 1.5px solid rgba(195, 118, 54, 0.2); padding-left: 16px; margin-left: 8px; }
  
  .exam-item { display: flex; flex-direction: column; align-items: flex-end; text-align: right; transition: all 0.4s ease; transform: translateZ(0); }
  .exam-item.primary { opacity: 1; background: rgba(255, 255, 255, 0.04); padding: 18px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); contain: layout paint style; will-change: transform; }
  .exam-item.secondary { opacity: 0.45; }
  
  .exam-row-top { width: 100%; display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 6px; gap: 10px; }
  
  /* 增加断字和换行规则，确保极长文本不会溢出或被切断 */
  .exam-code { font-size: 1.05rem; color: #C37636; font-weight: 800; word-break: break-word; }
  .exam-item.primary .exam-code { font-size: 1.7rem; color: #e47812; letter-spacing: 0.5px; }
  .exam-target-date { font-size: 0.75rem; color: rgba(255, 255, 255, 0.75); font-family: Menlo, monospace; flex-shrink: 0; }
  .exam-full-name { font-size: 0.75rem; color: rgba(255, 255, 255, 0.85); overflow-wrap: break-word; word-break: break-word; line-height: 1.3; }
  .exam-item.primary .exam-full-name { color: rgba(255, 255, 255, 0.95); font-size: 0.85rem; }

  .exam-countdown { font-size: 1.1rem; font-weight: 700; font-family: 'JetBrains Mono', Menlo, monospace; font-variant-numeric: tabular-nums; margin-top: 8px; transform: translate3d(0, 0, 0); will-change: contents; }
  .exam-item.primary .exam-countdown { font-size: 1.8rem; background: linear-gradient(to bottom, #ffffff, #dcdcdc); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .all-clear-msg { text-align: center; color: #C37636; opacity: 0.8; font-weight: 600; margin-top: 20px; }

  /* ================= 右侧：日历与单日详情 ================= */
  .right-panel { flex: 1; display: flex; flex-direction: column; transform: translate3d(0, 0, 0); contain: layout; height: 100%; }
  .calendar-section { margin-bottom: 24px; flex-shrink: 0; }
  
  .calendar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .calendar-title { font-size: 1.2rem; font-weight: 800; color: #e47812; }
  .month-nav { display: flex; gap: 8px; }
  .nav-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: transparent; border: 1px solid transparent; border-radius: 8px; color: rgba(255, 255, 255, 0.5); cursor: pointer; transition: all 0.2s ease; }
  .nav-btn:hover { background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.15); }

  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
  .weekday { font-size: 0.65rem; color: rgba(255,255,255,0.6); font-weight: 800; text-align: center; margin-bottom: 6px; }
  .day { position: relative; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; border-radius: 8px; cursor: pointer; transition: all 0.2s; box-sizing: border-box; border: 1px solid transparent; }
  .day:hover { background: rgba(255,255,255,0.1); }
  .day.today { color: #FFB067; font-weight: 900; background: rgba(255,255,255,0.05); }
  .day.selected { background: rgba(228, 120, 18, 0.8); color: white; border-color: rgba(255,255,255,0.2); }
  .dot { position: absolute; bottom: 4px; width: 4px; height: 4px; border-radius: 50%; background: #FFB067; }
  
  .right-divider { height: 1px; background: rgba(255, 255, 255, 0.05); margin: 0 0 20px 0; flex-shrink: 0; }
  
  .details-section { flex: 1; display: flex; flex-direction: column; overflow-y: auto; }
  .detail-header { font-size: 0.85rem; color: rgba(255,255,255,0.85); margin-bottom: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
  .detail-item { margin-bottom: 16px; text-align: left; }
  .detail-code { font-size: 1.2rem; color: #e47812; font-weight: 800; margin-bottom: 2px; }
  .detail-name { font-size: 0.8rem; color: rgba(255,255,255,0.95); line-height: 1.2; }
  .detail-time { font-family: 'JetBrains Mono', Menlo, monospace; font-variant-numeric: tabular-nums; font-size: 0.75rem; color: rgba(255,255,255,0.75); margin-top: 4px; transform: translate3d(0,0,0); will-change: contents;}
  .no-event { text-align: left; color: rgba(255,255,255,0.55); font-size: 0.85rem; margin-top: 10px; }
`;

// ==========================================
// 3. React 组件与逻辑区
// ==========================================
const StaticGlassBackground = React.memo(() => {
  return <div className="glass-background"></div>;
});

const LiveCountdown = ({ dateString, isPrimary }) => {
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const targetDate = new Date(dateString);
  const diff = targetDate - now;

  if (diff <= 0) return <div className="exam-countdown">Ended</div>;

  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff / 3600000) % 24).toString().padStart(2, '0');
  const m = Math.floor((diff / 60000) % 60).toString().padStart(2, '0');
  
  if (isPrimary) {
    const s = Math.floor((diff / 1000) % 60).toString().padStart(2, '0');
    return <div className="exam-countdown">{d}d {h}:{m}:{s}</div>;
  } else {
    return <div className="exam-countdown">{d}d {h}:{m}</div>;
  }
};

const IconFlag = (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>);
const ChevronLeft = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>);
const ChevronRight = (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>);
const CircleDot = (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle></svg>);

const DashboardWidget = ({ moodleData = [], manualData = [] }) => {
  const [staticNow] = React.useState(new Date());
  const [viewDate, setViewDate] = React.useState(new Date(staticNow.getFullYear(), staticNow.getMonth(), 1));
  const [selectedDate, setSelectedDate] = React.useState(staticNow.getDate());

  const startOfYear = new Date(staticNow.getFullYear(), 0, 1);
  const endOfYear = new Date(staticNow.getFullYear() + 1, 0, 1);
  const progress = Math.max(0, Math.min(1, (staticNow - startOfYear) / (endOfYear - startOfYear)));
  const pct = (progress * 100).toFixed(1);
  const daysPassed = Math.floor((staticNow - startOfYear) / (86400000)) + 1;
  const daysTotal = Math.round((endOfYear - startOfYear) / (86400000));

  // 修复点：明确划分所有事件与未来事件
  // allEvents 包含全局所有时间点的数据，供右侧日历使用
  const allEvents = [...moodleData, ...manualData].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // allUpcomingEvents 仅过滤出未来的数据，供左侧倒计时列表使用
  const allUpcomingEvents = allEvents.filter(e => new Date(e.date) > staticNow);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  React.useEffect(() => {
    if (selectedDate > daysInMonth) setSelectedDate(daysInMonth);
  }, [month, year, daysInMonth, selectedDate]);

  const handlePrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const handleResetToToday = () => {
    setViewDate(new Date(staticNow.getFullYear(), staticNow.getMonth(), 1));
    setSelectedDate(staticNow.getDate());
  };

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  // 修复点：日历检测逻辑现在使用全集 (allEvents)，包括过去的事件
  const hasEvent = (day) => {
    return allEvents.some(e => {
      const d = new Date(e.date);
      return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
    });
  };

  // 修复点：单日详情现在使用全集 (allEvents) 进行过滤展示
  const filteredEvents = allEvents.filter(e => {
    const d = new Date(e.date);
    return d.getDate() === selectedDate && d.getMonth() === month && d.getFullYear() === year;
  });

  return (
    <div className="glass-card">
      <StaticGlassBackground />
      
      {/* ================= 左侧栏 ================= */}
      <div className="left-panel">
        
        <div className="fixed-header-area">
          <div className="header-row">
            <div className="title-group">{IconFlag}<span>MISSION</span></div>
            <div className="date-text">{staticNow.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
          <div className="stats-row">
            <div className="percentage-text">{pct}%</div>
            <div className="days-text">{daysPassed} / {daysTotal} d</div>
          </div>
          <div className="track"><div className="fill" style={{ width: `${pct}%` }}></div></div>
        </div>

        <div className="horizontal-divider"></div>

        <div className="scroll-area">
          {allUpcomingEvents.length > 0 ? (
            <div className="exam-list">
              
              {(() => {
                const exam = allUpcomingEvents[0];
                const targetDate = new Date(exam.date);
                return (
                  <div className="exam-item primary" key="primary-item">
                    <div className="exam-row-top">
                      <span className="exam-code">{exam.code}</span>
                      <span className="exam-target-date">
                        {targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {targetDate.getHours()}:{targetDate.getMinutes().toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="exam-full-name">{exam.name}</div>
                    <LiveCountdown dateString={exam.date} isPrimary={true} />
                  </div>
                );
              })()}

              {allUpcomingEvents.length > 1 && (
                <div className="secondary-items-container">
                  {allUpcomingEvents.slice(1).map((exam, index) => {
                    const targetDate = new Date(exam.date);
                    return (
                      <div className="exam-item secondary" key={index + 1}>
                        <div className="exam-row-top">
                          <span className="exam-code">{exam.code}</span>
                          <span className="exam-target-date">
                            {targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {targetDate.getHours()}:{targetDate.getMinutes().toString().padStart(2, '0')}
                          </span>
                        </div>
                        <div className="exam-full-name">{exam.name}</div>
                        <LiveCountdown dateString={exam.date} isPrimary={false} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <div className="all-clear-msg">MISSION COMPLETE 🦊</div>
          )}
        </div>

      </div>

      <div className="vertical-divider"></div>

      {/* ================= 右侧栏 ================= */}
      <div className="right-panel">
        <div className="calendar-section">
          <div className="calendar-header">
            <div className="calendar-title">
              {viewDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </div>
            <div className="month-nav">
              <button className="nav-btn" onClick={handlePrevMonth}>{ChevronLeft}</button>
              <button className="nav-btn" onClick={handleResetToToday} title="Back to Today">{CircleDot}</button>
              <button className="nav-btn" onClick={handleNextMonth}>{ChevronRight}</button>
            </div>
          </div>
          
          <div className="calendar-grid">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((w, i) => (
              <div key={i} className="weekday">{w}</div>
            ))}
            {days.map((d, i) => {
              const isToday = d === staticNow.getDate() && month === staticNow.getMonth() && year === staticNow.getFullYear();
              return (
                <div 
                  key={i} 
                  className={`day ${isToday ? 'today' : ''} ${d === selectedDate ? 'selected' : ''}`}
                  onClick={() => d && setSelectedDate(d)}
                  style={{ cursor: d ? 'pointer' : 'default', opacity: d ? 1 : 0 }}
                >
                  {d}
                  {d && hasEvent(d) && (
                    <div className="dot" style={{ background: d === selectedDate ? 'white' : '#FFB067' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="right-divider"></div>

        <div className="details-section">
          <div className="detail-header">
            EVENTS ON {viewDate.toLocaleDateString('en-US', { month: 'short' }).split(' ')[0]} {selectedDate}
          </div>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, idx) => {
              const targetDate = new Date(event.date);
              // 对于过去的事件，计算是否已经结束并优雅地处理展示
              const isPast = targetDate < staticNow;
              return (
                <div className="detail-item" key={idx}>
                  <div className="detail-code" style={{ opacity: isPast ? 0.5 : 1 }}>{event.code}</div>
                  <div className="detail-name" style={{ opacity: isPast ? 0.5 : 1 }}>{event.name}</div>
                  <div className="detail-time">
                    {targetDate.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                    {isPast && <span style={{ marginLeft: "10px", color: "rgba(255,255,255,0.3)" }}>(Ended)</span>}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-event">No missions scheduled.</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. 最终渲染调度
// ==========================================
export const render = ({ output, error }) => {
  let moodleEvents = [];
  
  if (error) {
    console.error("Failed to sync Moodle Calendar");
  } else if (output) {
    moodleEvents = parseMoodleEvents(output);
  }

  return <DashboardWidget moodleData={moodleEvents} manualData={customEvents} />;
};