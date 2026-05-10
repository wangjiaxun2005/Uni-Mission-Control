import { React } from "uebersicht";

export const SettingsModal = ({ isOpen, onClose, config, updateConfig, onReset }) => {
  if (!isOpen) return null;

  const Row = ({ label, desc, children }) => (
    <div style={rowStyle}>
      <div style={labelGroupStyle}>
        <span style={titleStyle}>{label}</span>
        <span style={descStyle}>{desc}</span>
      </div>
      {children}
    </div>
  );

  const ColorPicker = ({ value, onChange }) => (
    <input type="color" value={value.substring(0, 7)} onChange={(e) => onChange(e.target.value)} style={pickerStyle} />
  );

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <div style={{ width: '20px' }}></div>
          {/* 统一排版文字风格 */}
          <span style={{ fontWeight: 800, color: config.accentColor, fontSize: '0.85rem', letterSpacing: '1.5px', textTransform: 'uppercase' }}>PREFERENCES</span>
          <div 
            onClick={onClose} 
            style={closeBtnStyle}
            onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = 0.4)}
          >✕</div>
        </div>
        
        <div style={scrollAreaStyle}>
          <section style={sectionStyle}>
            <Row label="Background" desc="Show main container"><Toggle active={config.showBg} onClick={() => updateConfig('showBg', !config.showBg)} color={config.accentColor} /></Row>
            <Row label="Glass Effect" desc="Enable backdrop blur"><Toggle active={config.isGlass} onClick={() => updateConfig('isGlass', !config.isGlass)} color={config.accentColor} /></Row>
          </section>

          <section style={sectionStyle}>
            <Row label="Text Color" desc="Primary font color"><ColorPicker value={config.textColor} onChange={(v) => updateConfig('textColor', v)} /></Row>
            <Row label="Accent Color" desc="Theme highlight color"><ColorPicker value={config.accentColor} onChange={(v) => updateConfig('accentColor', v)} /></Row>
            <Row label="Blur Color" desc="Color with blur ON"><ColorPicker value={config.glassColor} onChange={(v) => updateConfig('glassColor', v + "8c")} /></Row>
            <Row label="Solid Color" desc="Color with blur OFF"><ColorPicker value={config.bgColor} onChange={(v) => updateConfig('bgColor', v + "f2")} /></Row>
          </section>
        </div>

        <button onClick={onReset} style={{ ...resetButtonStyle, color: config.accentColor, borderColor: config.accentColor + '44' }}>
          Reset to Defaults
        </button>

        <div style={footerStyle}>Mission Control v2.3.1</div>
      </div>
    </div>
  );
};

const Toggle = ({ active, onClick, color }) => (
  <div style={{...toggleBaseStyle, backgroundColor: active ? color : 'rgba(255,255,255,0.1)'}} onClick={onClick}>
    <div style={{...toggleHandleStyle, transform: active ? 'translateX(18px)' : 'translateX(0px)'}} />
  </div>
);

// 核心修复点：将 absolute 修改为 fixed 以覆盖全屏幕，防止窗口极小时被裁切；更新了 modal 样式以匹配 ImportModal
const overlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' };
const modalStyle = { width: '380px', backgroundColor: 'rgba(28, 32, 40, 0.88)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(40px)', borderRadius: '28px', padding: '32px', boxShadow: '0 40px 100px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', color: 'white' };
const scrollAreaStyle = { display: 'flex', flexDirection: 'column' };
const sectionStyle = { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const closeBtnStyle = { cursor: 'pointer', opacity: 0.4, color: '#fff', fontSize: '1.2rem', transition: 'all 0.3s', padding: '0px' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const labelGroupStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const titleStyle = { fontSize: '0.85rem', fontWeight: 600, color: '#fff' };
const descStyle = { fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' };
const toggleBaseStyle = { width: '38px', height: '20px', borderRadius: '10px', padding: '2px', cursor: 'pointer', transition: 'all 0.3s' };
const toggleHandleStyle = { width: '16px', height: '16px', backgroundColor: '#fff', borderRadius: '50%', transition: 'all 0.3s' };
const pickerStyle = { width: '30px', height: '20px', border: 'none', padding: '0', background: 'none', cursor: 'pointer' };
const resetButtonStyle = { marginTop: '10px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' };
const footerStyle = { fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '15px' };