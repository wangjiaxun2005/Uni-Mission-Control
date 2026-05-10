import { React } from "uebersicht";

export const ImportModal = ({ isOpen, onClose, onImportManual, onSaveUrl, currentUrl }) => {
  const [manualText, setManualText] = React.useState("");
  const [urlText, setUrlText] = React.useState(currentUrl || "");
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  // 定制的 AI Prompt
  const promptText = `Act as an academic assistant. Extract course codes, task types, and due dates from the text I provide. Output strictly in valid JSON array format, e.g.: [{"code": "CS101", "name": "Final Exam", "date": "2026-05-12T14:30:00"}]. Do not include markdown formatting or other text.`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // 2秒后恢复状态
  };

  return (
    <div className="import-modal-overlay" onClick={onClose}>
      <div className="import-modal-content" onClick={e => e.stopPropagation()}>
        <div className="import-header">
          <div className="import-title">MISSION DATA CONTROL</div>
          <button className="import-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* --- 区域 1：URL 订阅 --- */}
        <div className="import-section">
          <div className="section-label">iCAL SUBSCRIPTION URL (Moodle / Canvas)</div>
          <input 
            className="import-input" 
            placeholder="Paste your .ics URL here..." 
            value={urlText}
            onChange={(e) => setUrlText(e.target.value)}
          />
          <button className="import-apply-btn" onClick={() => onSaveUrl(urlText)}>
            SYNC SUBSCRIPTION
          </button>
        </div>

        <div className="import-divider"></div>

        {/* --- 区域 2：AI 手动导入 --- */}
        <div className="import-section">
          <div className="section-label">AI ASSISTANT IMPORT (Paste JSON)</div>
          
          {/* 可交互的 Prompt 提示框 */}
          <div className="ai-prompt-box" onClick={handleCopyPrompt}>
            <div style={{fontWeight: 'bold', marginBottom: '6px', color: copied ? '#4ade80' : 'white'}}>
              {copied ? "✓ PROMPT COPIED!" : "📋 CLICK TO COPY AI PROMPT"}
            </div>
            <div>{promptText}</div>
          </div>

          <textarea 
            className="import-textarea" 
            placeholder='Paste JSON output here...'
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
          />
          <button className="import-apply-btn" onClick={() => {
            onImportManual(manualText);
            setManualText(""); // 清空以便下次使用
          }}>
            IMPORT MISSIONS
          </button>
        </div>
        
        <div className="import-footer">
          * Data is saved to local storage. Refresh after URL change.
        </div>
      </div>
    </div>
  );
};