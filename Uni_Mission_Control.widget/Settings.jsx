import { React } from "uebersicht";

// 🌟 内部子组件定义在外部以防止重绘闪退
const Row = ({ label, desc, children }) => (
  <div style={rowStyle}>
    <div style={labelGroupStyle}>
      <span style={titleStyle}>{label}</span>
      <span style={descStyle}>{desc}</span>
    </div>
    {children}
  </div>
);

// 🌟 视觉升级版的色块组件
const ColorPicker = ({ value, onChange }) => (
  <div style={{
    position: 'relative',
    width: '28px',
    height: '20px',
    borderRadius: '6px',
    backgroundColor: value.substring(0, 7),
    // 💡 解决深色融合：添加一层淡淡的白色半透明外边框，让深色也能清晰勾勒出轮廓
    border: '1px solid rgba(255, 255, 255, 0.18)', 
    // 💡 解决浅色膨胀：添加一层极淡的黑色内阴影收束高光，外加一点外阴影增加立体感
    boxShadow: 'inset 0 0 0 1px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    overflow: 'hidden',
    flexShrink: 0
  }}>
    {/* 隐藏的苹果原生拾色器，覆盖在整个 div 上，负责处理点击调出系统界面的逻辑 */}
    <input 
      type="color" 
      value={value.substring(0, 7)} 
      onChange={(e) => onChange(e.target.value)} 
      style={{
        position: 'absolute',
        top: '-10px',
        left: '-10px',
        width: '50px',
        height: '50px',
        opacity: 0,
        cursor: 'pointer'
      }} 
    />
  </div>
);

// 背景模式切换器
const BackgroundCycler = ({ mode, onCycle, accentColor }) => {
  const modes = ['blur', 'transparent', 'solid', 'none'];
  const currentIndex = modes.indexOf(mode);

  const cycle = (dir) => {
    const nextIndex = (currentIndex + dir + modes.length) % modes.length;
    onCycle(modes[nextIndex]);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <div style={arrowBtnStyle} onClick={() => cycle(-1)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="15 18 9 12 15 6"/></svg>
      </div>
      <div 
        style={{ ...modeNameStyle, color: accentColor }} 
        onClick={() => cycle(1)}
      >
        {mode.toUpperCase()}
      </div>
      <div style={arrowBtnStyle} onClick={() => cycle(1)}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  );
};

// ==========================
// 主设置面板
// ==========================
export const SettingsModal = ({ isOpen, onClose, config, updateConfig, onReset }) => {
  if (!isOpen) return null;

  return (
    <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
      <div style={headerStyle}>
        <div style={{ width: '20px' }}></div>
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
          <Row label="Background" desc="Cycler background modes">
            <BackgroundCycler 
              mode={config.bgMode || 'blur'} 
              onCycle={(newMode) => updateConfig('bgMode', newMode)}
              accentColor={config.accentColor}
            />
          </Row>
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
  );
};

// 样式定义区
const modalStyle = { position: 'absolute', top: '20px', left: '20px', zIndex: 1000, width: '314px', backgroundColor: 'rgba(28, 32, 40, 0.95)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(40px)', borderRadius: '24px', padding: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', color: 'white' };
const scrollAreaStyle = { display: 'flex', flexDirection: 'column' };
const sectionStyle = { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' };
const closeBtnStyle = { cursor: 'pointer', opacity: 0.4, color: '#fff', fontSize: '1.2rem', transition: 'all 0.3s', padding: '0px' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const labelGroupStyle = { display: 'flex', flexDirection: 'column', gap: '4px' };
const titleStyle = { fontSize: '0.85rem', fontWeight: 600, color: '#fff' };
const descStyle = { fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)' };
const resetButtonStyle = { marginTop: '10px', padding: '14px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid', borderRadius: '14px', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' };
const footerStyle = { fontSize: '0.65rem', color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: '15px' };

// Cycler 专属样式
const arrowBtnStyle = { cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', transition: '0.2s', userSelect: 'none' };
const modeNameStyle = { fontSize: '0.7rem', fontWeight: '800', width: '90px', textAlign: 'center', cursor: 'pointer', letterSpacing: '1px', userSelect: 'none' };