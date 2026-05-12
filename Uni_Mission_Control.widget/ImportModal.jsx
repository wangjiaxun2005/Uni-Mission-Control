// ==========================================
// 数据管理模态框 (ImportModal.jsx) - 按钮风格统一版
// ==========================================
import { React } from "uebersicht";

export const ImportModal = ({ 
  isOpen, onClose, onImportManual, onAddSingleManual, onAddUrl, onDeleteUrl, onDeleteManual, moodleUrls, userManualData 
}) => {
  // 🌟 AI 导入状态
  const [manualText, setManualText] = React.useState("");
  const [urlText, setUrlText] = React.useState("");
  const [copied, setCopied] = React.useState(false);

  // 🌟 手动表单状态
  const [newTitle, setNewTitle] = React.useState("");
  const [newType, setNewType] = React.useState("");
  const [newDate, setNewDate] = React.useState("");
  const [newTime, setNewTime] = React.useState("");

  if (!isOpen) return null;

  const promptText = `Act as an academic assistant. Extract course codes/event names, task types (e.g., Final Exam, Assignment), and due dates from the text I provide. Output strictly in valid JSON array format, e.g.: [{"code": "CS101", "type": "Final Exam", "date": "2026-05-12T14:30:00"}]. CRITICAL: Do NOT put the title in the "type" field. If not explicit, leave it blank (""). No markdown formatting.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleQuickAdd = () => {
    if (!newTitle.trim() || !newDate || !newTime) {
      alert("Please provide at least a Title, Date, and Time.");
      return;
    }
    const isoString = `${newDate}T${newTime}:00`;
    onAddSingleManual({
      code: newTitle.trim().toUpperCase(),
      type: newType.trim() || "Task",
      date: isoString
    });
    // 清空表单
    setNewTitle(""); setNewType(""); setNewDate(""); setNewTime("");
  };

  return (
    <div className="import-modal-overlay" onClick={onClose}>
      <div className="import-modal-content" onClick={e => e.stopPropagation()} style={{ width: '520px', maxHeight: '85vh', overflowY: 'auto' }}>
        <div className="import-header">
          <div className="import-title">MISSION DATA CONTROL</div>
          <button className="import-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* --- 区域 1：URL 订阅管理 --- */}
        <div className="import-section">
          <div className="section-label">iCAL SUBSCRIPTIONS</div>
          <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {moodleUrls.map((url, i) => (
              <div key={i} style={listItemStyle}>
                <span style={urlTextStyle}>{url}</span>
                <button style={deleteBtnStyle} onClick={() => onDeleteUrl(url)}>REMOVE</button>
              </div>
            ))}
            {moodleUrls.length === 0 && <div style={emptyTextStyle}>No active subscriptions.</div>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input className="import-input" placeholder="Paste new .ics URL..." value={urlText} onChange={(e) => setUrlText(e.target.value)} />
            <button className="import-apply-btn" style={{ marginTop: 0, width: '100px' }} onClick={() => { onAddUrl(urlText); setUrlText(""); }}>ADD</button>
          </div>
        </div>

        <div className="import-divider"></div>

        {/* --- 区域 2：直接手动创建任务 --- */}
        <div className="import-section">
          <div className="section-label">QUICK ADD MISSION</div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input className="import-input" style={{flex: 1.5}} placeholder="Title (e.g. BASKETBALL)" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <input className="import-input" style={{flex: 1}} placeholder="Type (e.g. Event)" value={newType} onChange={e => setNewType(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input className="import-input" type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
            <input className="import-input" type="time" value={newTime} onChange={e => setNewTime(e.target.value)} />
            {/* 🌟 恢复了纯净的按钮样式，保持 width 为 100px */}
            <button className="import-apply-btn" style={{ marginTop: 0, width: '100px' }} onClick={handleQuickAdd}>CREATE</button>
          </div>
        </div>

        <div className="import-divider"></div>

        {/* --- 区域 3：任务列表与 AI 导入 --- */}
        <div className="import-section">
          <div className="section-label">MANUAL MISSIONS LIST</div>
          <div style={{ marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '140px', overflowY: 'auto', paddingRight: '4px' }}>
            {userManualData.map((item, i) => (
              <div key={i} style={listItemStyle}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: '800', color: '#e47812', fontSize: '0.75rem' }}>{item.code}</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.6 }}>{item.type} · {item.date.replace('T', ' ').substring(0, 16)}</span>
                </div>
                <button style={deleteBtnStyle} onClick={() => onDeleteManual(item)}>DELETE</button>
              </div>
            ))}
            {userManualData.length === 0 && <div style={emptyTextStyle}>No manual missions added.</div>}
          </div>

          <div className="section-label" style={{marginTop: '20px'}}>OR IMPORT VIA AI JSON</div>
          <div className="ai-prompt-box" onClick={handleCopyPrompt}>
            <div style={{fontWeight: 'bold', marginBottom: '6px', color: copied ? '#4ade80' : 'white'}}>{copied ? "✓ PROMPT COPIED!" : "📋 CLICK TO COPY AI PROMPT"}</div>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <textarea className="import-textarea" style={{height: '46px', padding: '12px'}} placeholder='Paste JSON here...' value={manualText} onChange={(e) => setManualText(e.target.value)} />
            <button className="import-apply-btn" style={{ marginTop: 0, width: '100px' }} onClick={() => { onImportManual(manualText); setManualText(""); }}>IMPORT</button>
          </div>
        </div>

      </div>
    </div>
  );
};

const listItemStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' };
const urlTextStyle = { fontSize: '0.7rem', opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '300px', fontFamily: 'monospace' };
const deleteBtnStyle = { background: 'rgba(255, 69, 58, 0.1)', border: 'none', color: '#ff453a', fontSize: '0.6rem', fontWeight: '800', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', transition: '0.2s' };
const emptyTextStyle = { fontSize: '0.7rem', opacity: 0.3, textAlign: 'center', padding: '10px' };