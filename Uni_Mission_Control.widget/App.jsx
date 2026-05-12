// ==========================================
// 核心视图模块 (App.jsx) - 背景模式整合版
// ==========================================
import { React, run } from "uebersicht";
import { SettingsModal } from "./Settings.jsx";
import { ImportModal } from "./ImportModal.jsx";
import { parseMoodleEvents } from "./api.jsx";
import { WorldClock } from "./WorldClock.jsx";

const defaultConfig = {
  bgMode: "blur", // 新增：blur | transparent | solid | none
  textColor: "#ffffff", accentColor: "#e47812", glassColor: "#232a358c", bgColor: "#191e26f2"
};

const StaticGlassBackground = React.memo(({ config }) => {
  const mode = config.bgMode || "blur";
  if (mode === 'none') return null;

  const glassStyle = {
    // 只有 blur 模式开启模糊
    backdropFilter: mode === 'blur' ? "blur(30px) saturate(150%)" : "none",
    WebkitBackdropFilter: mode === 'blur' ? "blur(30px) saturate(150%)" : "none",
    // blur 和 transparent 使用半透明色 (glassColor)，solid 使用不透明色 (bgColor)
    backgroundColor: (mode === 'blur' || mode === 'transparent') ? config.glassColor : config.bgColor,
  };
  
  return <div className="glass-background" style={{ ...glassStyle, transition: "background-color 0.3s ease, backdrop-filter 0.3s ease", zIndex: -1 }}></div>;
});

const LiveCountdown = ({ dateString, isPrimary }) => {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t); }, []);
  const diff = new Date(dateString) - now;
  if (diff <= 0) return <span style={{ opacity: 0.5 }}>Ended</span>;
  const d = Math.floor(diff / 86400000), h = Math.floor((diff / 3600000) % 24).toString().padStart(2, '0'), m = Math.floor((diff / 60000) % 60).toString().padStart(2, '0');
  return isPrimary ? <span>{d}d {h}:{m}:{Math.floor((diff / 1000) % 60).toString().padStart(2, '0')}</span> : <span>{d}d {h}:{m}</span>;
};

const getDynamicTitleStyle = (text, isPrimary, accentColor) => {
  const len = text ? text.length : 0;
  let size;
  if (isPrimary) { size = len <= 8 ? '1.4rem' : (len <= 14 ? '1.1rem' : '0.9rem'); } 
  else { size = len <= 8 ? '1.05rem' : (len <= 14 ? '0.85rem' : '0.75rem'); }
  return { fontSize: size, fontWeight: isPrimary ? "800" : "700", color: accentColor, lineHeight: "1.1", wordBreak: "break-word", maxWidth: isPrimary ? "65%" : "140px" };
};

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

export const DashboardWidget = ({ manualData = [] }) => {
  const [pos, setPos] = React.useState(() => JSON.parse(localStorage.getItem("uni_mission_pos")) || { x: 20, y: 20 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragOffset = React.useRef({ x: 0, y: 0 });

  const [level, setLevel] = React.useState(() => parseInt(localStorage.getItem("uni_mission_level")) || 3);
  const [config, setConfig] = React.useState(() => JSON.parse(localStorage.getItem("uni_mission_config")) || defaultConfig);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isImportOpen, setIsImportOpen] = React.useState(false);
  const [showClockOverride, setShowClockOverride] = React.useState(false);

  const [userManualData, setUserManualData] = React.useState(() => {
    const saved = localStorage.getItem("uni_mission_user_data");
    const isMigrated = localStorage.getItem("uni_mission_migrated_hardcoded");
    let currentData = saved ? JSON.parse(saved) : [];
    currentData = currentData.map(item => ({ code: item.code, type: item.type || item.name || "Task", date: item.date }));
    const safeManualData = manualData.map(item => ({ code: item.code, type: item.type || item.name || "Task", date: item.date }));

    if (!isMigrated && safeManualData && safeManualData.length > 0) {
      const merged = [...currentData, ...safeManualData];
      const uniqueData = merged.filter((item, index, self) => index === self.findIndex((t) => (t.code === item.code && t.date === item.date && t.type === item.type)));
      currentData = uniqueData;
      localStorage.setItem("uni_mission_user_data", JSON.stringify(currentData));
      localStorage.setItem("uni_mission_migrated_hardcoded", "true");
    } else if (saved) {
      localStorage.setItem("uni_mission_user_data", JSON.stringify(currentData));
    }
    return currentData;
  });

  const [moodleUrls, setMoodleUrls] = React.useState(() => {
    const saved = localStorage.getItem("uni_mission_moodle_urls");
    if (saved) return JSON.parse(saved);
    const old = localStorage.getItem("uni_mission_moodle_url");
    return old ? [old] : [];
  });

  const [fetchedMoodleData, setFetchedMoodleData] = React.useState([]);
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const ticker = setInterval(() => setCurrentTime(new Date()), 60000); 
    return () => clearInterval(ticker);
  }, []);

  const [viewDate, setViewDate] = React.useState(new Date(currentTime.getFullYear(), currentTime.getMonth(), 1));
  const [selectedDate, setSelectedDate] = React.useState(currentTime.getDate());
  const [renderPulse, setRenderPulse] = React.useState(0);

  const fetchAllData = React.useCallback(() => {
    if (moodleUrls.length === 0) { setFetchedMoodleData([]); return; }
    Promise.all(moodleUrls.map(url => run(`curl -sL "${url}"`).then(text => parseMoodleEvents(text)).catch(err => { console.error(`Fetch failed for ${url}:`, err); return []; })))
    .then(results => {
      const merged = results.flat();
      const uniqueMerged = merged.filter((item, index, self) => index === self.findIndex((t) => (t.code === item.code && t.date === item.date && t.type === item.type)));
      setFetchedMoodleData(uniqueMerged);
    });
  }, [moodleUrls]);

  React.useEffect(() => {
    fetchAllData();
    const interval = setInterval(fetchAllData, 3600000);
    return () => clearInterval(interval);
  }, [fetchAllData]);

  const handleAddUrl = (url) => {
    if (!url || moodleUrls.includes(url)) return;
    const newList = [...moodleUrls, url]; setMoodleUrls(newList); localStorage.setItem("uni_mission_moodle_urls", JSON.stringify(newList));
  };
  const handleDeleteUrl = (urlToDelete) => {
    const newList = moodleUrls.filter(url => url !== urlToDelete); setMoodleUrls(newList); localStorage.setItem("uni_mission_moodle_urls", JSON.stringify(newList));
  };
  const handleDeleteManual = (itemToDelete) => {
    const newList = userManualData.filter(item => !(item.code === itemToDelete.code && item.date === itemToDelete.date && item.type === itemToDelete.type));
    setUserManualData(newList); localStorage.setItem("uni_mission_user_data", JSON.stringify(newList));
  };
  const handleAddSingleManual = (newItem) => {
    const updatedData = [...userManualData, newItem];
    const uniqueData = updatedData.filter((item, index, self) => index === self.findIndex((t) => (t.code === item.code && t.date === item.date && t.type === item.type)));
    setUserManualData(uniqueData); localStorage.setItem("uni_mission_user_data", JSON.stringify(uniqueData));
  };

  const handleImportManual = (text) => {
    try {
      const newData = JSON.parse(text);
      const safeNewData = newData.map(item => ({ code: item.code, type: item.type || item.name || "Task", date: item.date }));
      const updatedData = [...userManualData, ...safeNewData];
      const uniqueData = updatedData.filter((item, index, self) => index === self.findIndex((t) => (t.code === item.code && t.date === item.date && t.type === item.type)));
      setUserManualData(uniqueData); localStorage.setItem("uni_mission_user_data", JSON.stringify(uniqueData));
      alert("Missions successfully imported!");
    } catch (e) { alert("Invalid JSON format."); }
  };

  const handleMouseDown = (e) => { setIsDragging(true); dragOffset.current = { x: e.clientX - pos.x, y: e.clientY - pos.y }; };

  React.useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      let newX = e.clientX - dragOffset.current.x, newY = e.clientY - dragOffset.current.y;
      const currentWidth = level === 3 ? 800 : 354;
      const currentHeight = document.querySelector('.glass-card')?.clientHeight || 345;
      const maxX = window.innerWidth - currentWidth, maxY = window.innerHeight - currentHeight;
      setPos({ x: Math.max(0, Math.min(newX, maxX)), y: Math.max(0, Math.min(newY, maxY)) });
    };
    const handleMouseUp = () => { if (isDragging) { setIsDragging(false); localStorage.setItem("uni_mission_pos", JSON.stringify(pos)); } };
    if (isDragging) { window.addEventListener("mousemove", handleMouseMove); window.addEventListener("mouseup", handleMouseUp); }
    return () => { window.removeEventListener("mousemove", handleMouseMove); window.removeEventListener("mouseup", handleMouseUp); };
  }, [isDragging, pos, level]);

  React.useEffect(() => {
    const currentWidth = level === 3 ? 800 : 354, currentHeight = document.querySelector('.glass-card')?.clientHeight || 345;
    const maxX = Math.max(0, window.innerWidth - currentWidth), maxY = Math.max(0, window.innerHeight - currentHeight);
    setPos((prev) => {
      const safeX = Math.min(prev.x, maxX), safeY = Math.min(prev.y, maxY);
      if (safeX !== prev.x || safeY !== prev.y) { const newPos = { x: safeX, y: safeY }; localStorage.setItem("uni_mission_pos", JSON.stringify(newPos)); return newPos; }
      return prev;
    });
  }, [level]);

  const updateConfig = (k, v) => { const nc = { ...config, [k]: v }; setConfig(nc); localStorage.setItem("uni_mission_config", JSON.stringify(nc)); };
  const handleRefreshArea = () => { if (document.activeElement && document.activeElement.blur) document.activeElement.blur(); setRenderPulse(prev => prev + 1); };

  const startOfYear = new Date(currentTime.getFullYear(), 0, 1), endOfYear = new Date(currentTime.getFullYear() + 1, 0, 1);
  const pct = (((currentTime - startOfYear) / (endOfYear - startOfYear)) * 100).toFixed(1);
  const daysPassed = Math.floor((currentTime - startOfYear) / 86400000) + 1, daysTotal = Math.round((endOfYear - startOfYear) / 86400000);
  
  const allEvents = [...fetchedMoodleData, ...userManualData].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = allEvents.filter((e) => new Date(e.date) > currentTime);
  const year = viewDate.getFullYear(), month = viewDate.getMonth(), firstDay = new Date(year, month, 1).getDay(), daysInMonth = new Date(year, month + 1, 0).getDate(), daysArray = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const filteredDetails = allEvents.filter((e) => { const dt = new Date(e.date); return dt.getDate() === selectedDate && dt.getMonth() === month && dt.getFullYear() === year; });

  const cycleLevel = () => { 
    const nl = level >= 3 ? 1 : level + 1; 
    setLevel(nl); localStorage.setItem("uni_mission_level", nl); 
  };

  const secondaryCount = Math.max(0, upcoming.length - 1);
  const boundedSecondaryCount = Math.min(secondaryCount, 6);
  const detailCount = filteredDetails.length;
  const boundedDetailCount = Math.min(detailCount, 3);
  
  const leftCalculated = 330 + (boundedSecondaryCount * 70);
  const rightCalculated = 410 + (boundedDetailCount * 90);
  
  const displayClock = upcoming.length === 0 || showClockOverride;

  let height1 = !displayClock ? 345 : 200;
  let height2 = !displayClock ? Math.max(345, leftCalculated) : 320;
  let height3 = !displayClock ? Math.max(345, leftCalculated, rightCalculated) : Math.max(530, rightCalculated);

  const sizeMap = { 
    1: { width: '354px', height: `${height1}px` }, 
    2: { width: '354px', height: `${height2}px` }, 
    3: { width: '800px', height: `${height3}px` } 
  };

  return (
    <div key={renderPulse} style={{ position: 'absolute', left: `${pos.x}px`, top: `${pos.y}px`, zIndex: 100, userSelect: 'none', transition: isDragging ? 'none' : 'top 0.3s ease, left 0.3s ease' }}>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} config={config} updateConfig={updateConfig} onReset={() => setConfig(defaultConfig)} />
      
      <ImportModal 
        isOpen={isImportOpen} onClose={() => setIsImportOpen(false)} 
        onImportManual={handleImportManual} onAddSingleManual={handleAddSingleManual}
        onAddUrl={handleAddUrl} onDeleteUrl={handleDeleteUrl} onDeleteManual={handleDeleteManual}
        moodleUrls={moodleUrls} userManualData={userManualData}
      />

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
                  {currentTime.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
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
            <div className="horizontal-divider" style={ {marginTop: '2px'} }></div>
            
            {!displayClock && (() => {
              const exam = upcoming[0]; const targetDate = new Date(exam.date);
              return (
                <div className="exam-item primary" style={{ marginTop: "12px", cursor: "pointer" }} onClick={() => setShowClockOverride(true)}>
                  <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center", marginBottom: "10px" }}>
                    <span style={getDynamicTitleStyle(exam.code, true, config.accentColor)}>{exam.code}</span>
                    <span style={{ fontSize: "0.75rem", fontWeight: "700", opacity: 0.5, textTransform: "uppercase", textAlign: "right" }}>{exam.type}</span>
                  </div>
                  <div style={{ fontSize: "2rem", fontWeight: "700", fontFamily: "JetBrains Mono, Menlo, monospace", lineHeight: "1", marginBottom: "6px" }}><LiveCountdown dateString={exam.date} isPrimary={true} /></div>
                  <div style={{ fontSize: "0.75rem", opacity: 0.4, fontFamily: "Menlo, monospace" }}>Due: {targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })} {targetDate.getHours()}:{targetDate.getMinutes().toString().padStart(2, "0")}</div>
                </div>
              );
            })()}
          </div>
          
          <div className="scroll-area" style={{ marginTop: "30px", opacity: level >= 2 ? 1 : 0, transition: 'opacity 0.3s', pointerEvents: level >= 2 ? 'auto' : 'none' }}>
            {!displayClock ? (
              upcoming.length > 1 && (
                <div className="secondary-items-container" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {upcoming.slice(1).map((exam, index) => {
                    const targetDate = new Date(exam.date);
                    return (
                      <div className="exam-item secondary" key={index} style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", margin: "0", textAlign: "left" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
                          <span style={getDynamicTitleStyle(exam.code, false, config.accentColor)}>{exam.code}</span>
                          <span style={{ fontSize: "0.65rem", opacity: 0.5, textTransform: "uppercase" }}>{exam.type}</span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}><div style={{ fontSize: "1rem", fontWeight: "600", fontFamily: "JetBrains Mono, Menlo, monospace", lineHeight: "1" }}><LiveCountdown dateString={exam.date} isPrimary={false} /></div><span style={{ fontSize: "0.65rem", opacity: 0.4 }}>{targetDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span></div>
                      </div>
                    );
                  })}
                </div>
              )
            ) : (
              <div style={{ cursor: upcoming.length > 0 ? "pointer" : "default" }} onClick={() => { if (upcoming.length > 0) setShowClockOverride(false); }}>
                <WorldClock config={config} level={level} />
              </div>
            )}
          </div>
        </div>

        <div className="vertical-divider" style={{ opacity: level === 3 ? 1 : 0, transition: 'opacity 0.2s', pointerEvents: level === 3 ? 'auto' : 'none' }}></div>
        
        <div className="right-panel" style={{ opacity: level === 3 ? 1 : 0, visibility: level === 3 ? 'visible' : 'hidden', transition: level === 3 ? 'opacity 0.3s ease 0.3s, visibility 0.3s' : 'opacity 0.1s ease, visibility 0.1s', pointerEvents: level === 3 ? 'auto' : 'none' }}>
          <div className="calendar-section">
            <div className="calendar-header">
              <div className="calendar-title" style={{color: config.accentColor}}>{viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</div>
              <div style={{ display: "flex", gap: "8px" }} onMouseLeave={handleRefreshArea}>
                <button className="nav-btn" onClick={() => setViewDate(new Date(year, month - 1, 1))}>{ChevronLeft}</button>
                <button className="nav-btn" onClick={() => { setViewDate(new Date(currentTime.getFullYear(), currentTime.getMonth(), 1)); setSelectedDate(currentTime.getDate()); }}>{CircleDot}</button>
                <button className="nav-btn" onClick={() => setViewDate(new Date(year, month + 1, 1))}>{ChevronRight}</button>
              </div>
            </div>
            <div className="calendar-grid">
              {["S", "M", "T", "W", "T", "F", "S"].map((w) => (<div key={w} className="weekday">{w}</div>))}
              {daysArray.map((d, i) => (
                <div key={i} className={`day ${d === currentTime.getDate() && month === currentTime.getMonth() && year === currentTime.getFullYear() ? "today" : ""} ${d === selectedDate ? "selected" : ""}`} onClick={() => d && setSelectedDate(d)} style={{ opacity: d ? 1 : 0, backgroundColor: d === selectedDate ? config.accentColor : 'transparent' }}>
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
                const isPast = targetDate < currentTime;
                return (
                  <div className="detail-item" key={idx} style={{ opacity: isPast ? 0.4 : 1, transition: "opacity 0.3s ease" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2px" }}>
                      <div style={{ fontSize: "1.2rem", color: config.accentColor, fontWeight: "800", wordBreak: 'break-word', maxWidth: '80%', lineHeight: '1.1' }}>{event.code}</div>
                      {isPast && (<div style={{ fontSize: "0.6rem", fontWeight: "800", background: "rgba(255,255,255,0.1)", padding: "2px 6px", borderRadius: "4px", marginTop: "2px", letterSpacing: "0.5px", flexShrink: 0 }}>ENDED</div>)}
                    </div>
                    <div style={{ fontSize: "0.8rem", opacity: 0.95, lineHeight: "1.2" }}>{event.type}</div>
                    <div style={{ fontSize: "0.75rem", fontFamily: "JetBrains Mono, Menlo, monospace", opacity: 0.7, marginTop: "4px" }}>{targetDate.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" })}</div>
                  </div>
                ); 
              }) : (
                <div style={{ opacity: 0.25, marginTop: '-1px', paddingLeft: '2px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.5px' }}>No missions</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};