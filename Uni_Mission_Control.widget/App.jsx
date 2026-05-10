import { React } from "uebersicht";
import { SettingsModal } from "./Settings.jsx";
import { ImportModal } from "./ImportModal.jsx";

const defaultConfig = {
  isGlass: true, showBg: true, textColor: "#ffffff", accentColor: "#e47812", glassColor: "#232a358c", bgColor: "#191e26f2"
};

const StaticGlassBackground = React.memo(({ config }) => {
  if (!config.showBg) return null;
  const glassStyle = {
    backdropFilter: config.isGlass ? "blur(30px) saturate(150%)" : "none",
    WebkitBackdropFilter: config.isGlass ? "blur(30px) saturate(150%)" : "none",
    backgroundColor: config.isGlass ? config.glassColor : config.bgColor,
  };
  return <div className="glass-background" style={{ ...glassStyle, transition: "all 0.3s ease", zIndex: -1 }}></div>;
});

const LiveCountdown = ({ dateString, isPrimary }) => {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const diff = new Date(dateString) - now;
  if (diff <= 0) return <span style={{ opacity: 0.5 }}>Ended</span>;
  const d = Math.floor(diff / 86400000), h = Math.floor((diff / 3600000) % 24).toString().padStart(2, '0'), m = Math.floor((diff / 60000) % 60).toString().padStart(2, '0');
  return isPrimary ? <span>{d}d {h}:{m}:{Math.floor((diff / 1000) % 60).toString().padStart(2, '0')}</span> : <span>{d}d {h}:{m}</span>;
};

// --- 图标定义 ---
const IconEllipsisH = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);
const IconFlag = <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>;
const ChevronLeft = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>;
const ChevronRight = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>;
const CircleDot = <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10"/></svg>;
const ArcResizeHandle = () => (
  <svg width="40" height="40" viewBox="0 0 40 40">
    <path d="M 35 10 A 25 25 0 0 1 10 35" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>
);

export const DashboardWidget = ({ moodleData = [], manualData = [] }) => {
  const [pos, setPos] = React.useState(() => JSON.parse(localStorage.getItem("uni_mission_pos")) || { x: 20, y: 20 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragOffset = React.useRef({ x: 0, y: 0 });

  const [level, setLevel] = React.useState(() => parseInt(localStorage.getItem("uni_mission_level")) || 3);
  const [config, setConfig] = React.useState(() => JSON.parse(localStorage.getItem("uni_mission_config")) || defaultConfig);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);

  const [userManualData, setUserManualData] = React.useState(() => 
    JSON.parse(localStorage.getItem("uni_mission_user_data")) || []
  );

  const [staticNow] = React.useState(new Date());
  const [viewDate, setViewDate] = React.useState(new Date(staticNow.getFullYear(), staticNow.getMonth(), 1));
  const [selectedDate, setSelectedDate] = React.useState(staticNow.getDate());
  
  // 强制刷新状态
  const [renderPulse, setRenderPulse] = React.useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      let newX = e.clientX - dragOffset.current.x;
      let newY = e.clientY - dragOffset.current.y;
      const currentWidth = level === 3 ? 800 : 354;
      const currentHeight = document.querySelector('.glass-card')?.clientHeight || 345;
      const maxX = window.innerWidth - currentWidth;
      const maxY = window.innerHeight - currentHeight;
      newX = Math.max(0, Math.min(newX, maxX));
      newY = Math.max(0, Math.min(newY, maxY));
      setPos({ x: newX, y: newY });
    };
    const handleMouseUp = () => {
      if (isDragging) {
        setIsDragging(false);
        localStorage.setItem("uni_mission_pos", JSON.stringify(pos));
      }
    };
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, pos, level]);

  React.useEffect(() => {
    const currentWidth = level === 3 ? 800 : 354;
    const currentHeight = document.querySelector('.glass-card')?.clientHeight || 345;
    const maxX = Math.max(0, window.innerWidth - currentWidth);
    const maxY = Math.max(0, window.innerHeight - currentHeight);
    setPos((prev) => {
      const safeX = Math.min(prev.x, maxX);
      const safeY = Math.min(prev.y, maxY);
      if (safeX !== prev.x || safeY !== prev.y) {
        const newPos = { x: safeX, y: safeY };
        localStorage.setItem("uni_mission_pos", JSON.stringify(newPos));
        return newPos;
      }
      return prev;
    });
  }, [level]);

  const cycleLevel = () => { const nl = level >= 3 ? 1 : level + 1; setLevel(nl); localStorage.setItem("uni_mission_level", nl); };
  const updateConfig = (k, v) => { const nc = { ...config, [k]: v }; setConfig(nc); localStorage.setItem("uni_mission_config", JSON.stringify(nc)); };

  const handleImportManual = (text) => {
    try {
      const newData = JSON.parse(text);
      const updatedData = [...userManualData, ...newData];
      const uniqueData = updatedData.filter((item, index, self) =>
        index === self.findIndex((t) => (t.code === item.code && t.date === item.date && t.name === item.name))
      );
      setUserManualData(uniqueData);
      localStorage.setItem("uni_mission_user_data", JSON.stringify(uniqueData));
      alert("Missions successfully imported!");
    } catch (e) { alert("Invalid JSON format."); }
  };

  const handleSaveUrl = (url) => {
    localStorage.setItem("uni_mission_moodle_url", url);
    alert("URL Saved! Refresh to sync.");
  };

  // 移出区域时触发重绘，彻底解决阴影残留
  const handleRefreshArea = () => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    setRenderPulse(prev => prev + 1);
  };

  const startOfYear = new Date(staticNow.getFullYear(), 0, 1), endOfYear = new Date(staticNow.getFullYear() + 1, 0, 1);
  const pct = (((staticNow - startOfYear) / (endOfYear - startOfYear)) * 100).toFixed(1);
  const daysPassed = Math.floor((staticNow - startOfYear) / 86400000) + 1, daysTotal = Math.round((endOfYear - startOfYear) / 86400000);
  const allEvents = [...moodleData, ...manualData, ...userManualData].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = allEvents.filter((e) => new Date(e.date) > staticNow);
  const year = viewDate.getFullYear(), month = viewDate.getMonth(), firstDay = new Date(year, month, 1).getDay(), daysInMonth = new Date(year, month + 1, 0).getDate(), daysArray = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const filteredDetails = allEvents.filter((e) => { const dt = new Date(e.date); return dt.getDate() === selectedDate && dt.getMonth() === month && dt.getFullYear() === year; });

  // 高度计算
  const secondaryCount = Math.max(0, upcoming.length - 1);
  const boundedSecondaryCount = Math.min(secondaryCount, 6);
  const detailCount = filteredDetails.length;
  const boundedDetailCount = Math.min(detailCount, 3);
  
  const leftCalculated = 310 + (boundedSecondaryCount * 70);
  const rightCalculated = 430 + (boundedDetailCount * 90);
  
  let currentHeight = 345;
  if (level === 2) {
    currentHeight = Math.max(345, leftCalculated);
  } else if (level === 3) {
    currentHeight = Math.max(345, leftCalculated, rightCalculated);
  }

  const sizeMap = { 
    1: { width: '354px', height: '345px' }, 
    2: { width: '354px', height: `${currentHeight}px` }, 
    3: { width: '800px', height: `${currentHeight}px` } 
  };

  return (
    <div key={renderPulse} style={{ position: 'absolute', left: `${pos.x}px`, top: `${pos.y}px`, zIndex: 100, userSelect: 'none', transition: isDragging ? 'none' : 'top 0.3s ease, left 0.3s ease' }}>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} config={config} updateConfig={updateConfig} onReset={() => setConfig(defaultConfig)} />
      <ImportModal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} onImportManual={handleImportManual} onSaveUrl={handleSaveUrl} currentUrl={localStorage.getItem("uni_mission_moodle_url")} />

      <div className="glass-card" style={{ ...sizeMap[level], color: config.textColor, transition: "width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <StaticGlassBackground config={config} />

        <div className="stepped-drag-trigger" onMouseDown={handleMouseDown}></div>
        <div className="stepped-drag-visual"></div>
        <div className="resize-handle-container" onClick={cycleLevel}><ArcResizeHandle /></div>

        <div className="left-panel">
          <div className="fixed-header-area">
            <div className="header-row">
              <div className="title-group" style={{color: config.accentColor, cursor: 'pointer'}} onClick={() => setIsImportOpen(true)}>
                {IconFlag}<span>MISSION</span>
              </div>
              <div className="header-right-stack" onClick={() => setIsSettingsOpen(true)}>
                <div className="settings-ghost-trigger">{IconEllipsisH}</div>
                <div style={{ opacity: 0.7, fontWeight: 700, fontSize: '0.85rem' }}>
                  {staticNow.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "2px", marginTop: "4px" }}>
              <div className="percentage-text">{pct}%</div>
              <div style={{opacity: 0.7, fontSize: '0.85rem', fontWeight: 600, paddingLeft: '2px', letterSpacing: '0.5px'}}>
                {daysPassed} / {daysTotal} d
              </div>
            </div>
            
            <div className="track"><div className="fill" style={{ width: `${pct}%`, background: config.accentColor }}></div></div>
            <div className="horizontal-divider"></div>
            
            {upcoming.length > 0 && (() => {
              const exam = upcoming[0]; const targetDate = new Date(exam.date);
              return (
                <div className="exam-item primary" style={{ marginTop: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "10px" }}><span style={{ fontSize: "1.4rem", fontWeight: "800", color: config.accentColor, lineHeight: "1" }}>{exam.code}</span><span style={{ fontSize: "0.75rem", fontWeight: "700", opacity: 0.5, textTransform: "uppercase" }}>{exam.name}</span></div>
                  <div style={{ fontSize: "2rem", fontWeight: "700", fontFamily: "JetBrains Mono, Menlo, monospace", lineHeight: "1", marginBottom: "6px" }}><LiveCountdown dateString={exam.date} isPrimary={true} /></div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.4, fontFamily: "Menlo, monospace" }}>Due: {targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} {targetDate.getHours()}:{targetDate.getMinutes().toString().padStart(2, "0")}</div>
                </div>
              );
            })()}
          </div>
          
          <div className="scroll-area" style={{ marginTop: "30px", opacity: level >= 2 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: level >= 2 ? 'auto' : 'none' }}>
            {upcoming.slice(1).map((exam, index) => {
              const targetDate = new Date(exam.date);
              return (
                <div className="exam-item secondary" key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "92%", margin: "0 auto 24px auto", textAlign: "left" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}><span style={{ fontSize: "1.05rem", fontWeight: "700", color: config.accentColor, lineHeight: "1" }}>{exam.code}</span><span style={{ fontSize: "0.65rem", opacity: 0.5, textTransform: "uppercase" }}>{exam.name}</span></div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}><div style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "JetBrains Mono, Menlo, monospace", lineHeight: "1" }}><LiveCountdown dateString={exam.date} isPrimary={false} /></div><span style={{ fontSize: "0.65rem", opacity: 0.4 }}>{targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div>
                </div>
              );
            })}
            {upcoming.length === 0 && <div className="all-clear-msg" style={{color: config.accentColor, marginTop: '20px', textAlign: 'center'}}>MISSION COMPLETE 🦊</div>}
          </div>
        </div>

        <div className="vertical-divider" style={{ opacity: level === 3 ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: level === 3 ? 'auto' : 'none' }}></div>
        
        <div className="right-panel" style={{ opacity: level === 3 ? 1 : 0, visibility: level === 3 ? 'visible' : 'hidden', transition: level === 3 ? 'opacity 0.3s ease 0.3s, visibility 0.3s' : 'opacity 0.1s ease, visibility 0.1s', pointerEvents: level === 3 ? 'auto' : 'none' }}>
          <div className="calendar-section">
            <div className="calendar-header">
              <div className="calendar-title" style={{color: config.accentColor}}>{viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
              
              <div style={{ display: "flex", gap: "8px" }} onMouseLeave={handleRefreshArea}>
                <button className="nav-btn" onClick={() => setViewDate(new Date(year, month - 1, 1))}>{ChevronLeft}</button>
                <button className="nav-btn" onClick={() => { setViewDate(new Date(staticNow.getFullYear(), staticNow.getMonth(), 1)); setSelectedDate(staticNow.getDate()); }}>{CircleDot}</button>
                <button className="nav-btn" onClick={() => setViewDate(new Date(year, month + 1, 1))}>{ChevronRight}</button>
              </div>

            </div>
            <div className="calendar-grid">
              {["S", "M", "T", "W", "T", "F", "S"].map((w) => (<div key={w} className="weekday">{w}</div>))}
              {daysArray.map((d, i) => (
                <div key={i} className={`day ${d === staticNow.getDate() && month === staticNow.getMonth() && year === staticNow.getFullYear() ? "today" : ""} ${d === selectedDate ? "selected" : ""}`} onClick={() => d && setSelectedDate(d)} style={{ opacity: d ? 1 : 0, backgroundColor: d === selectedDate ? config.accentColor : 'transparent' }}>
                  {d}
                  {d && allEvents.some(e => { const dt = new Date(e.date); return dt.getDate() === d && dt.getMonth() === month && dt.getFullYear() === year; }) && (<div className="dot" style={{ background: d === selectedDate ? "white" : config.accentColor }} />)}
                </div>
              ))}
            </div>
          </div>
          <div className="right-divider"></div>
          <div className="details-section">
            <div className="detail-header">EVENTS ON {viewDate.toLocaleDateString("en-US", { month: "short" }).split(" ")[0]} {selectedDate}</div>
            <div className="details-scroll-area">
              {filteredDetails.length > 0 ? filteredDetails.map((event, idx) => { 
                const targetDate = new Date(event.date); 
                const isPast = targetDate < staticNow;
                return (
                  <div className="detail-item" key={idx} style={{ opacity: isPast ? 0.4 : 1, transition: "opacity 0.3s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                      <div style={{ fontSize: "1.2rem", color: config.accentColor, fontWeight: "800" }}>{event.code}</div>
                      {isPast && (
                        <div style={{ fontSize: "0.6rem", fontWeight: "800", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", marginTop: "2px", letterSpacing: "0.5px" }}>ENDED</div>
                      )}
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.95, lineHeight: "1.2" }}>{event.name}</div>
                    <div style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, Menlo, monospace", opacity: 0.7, marginTop: "4px" }}>{targetDate.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                ); 
              }) : <div style={{ textAlign: "left", opacity: 0.5, fontSize: "0.85rem", marginTop: "10px" }}>No missions scheduled.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};