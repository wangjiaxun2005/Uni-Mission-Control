// ==========================================
// 样式模块 (styles.jsx) - 原生控件适配版
// ==========================================
export const widgetStyles = `
  /* 基础与容器 */
  top: 0px; left: 0px; user-select: none; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  ::-webkit-scrollbar { display: none; width: 0; height: 0; }
  * { scrollbar-width: none; -ms-overflow-style: none; box-sizing: border-box; }

  /* 🌟 终极防休眠 Hack：在 Z 轴上做 1px 的位移。肉眼看不见，但强制 GPU 保持毛玻璃层激活，且不破坏图层 */
  @keyframes forceComposite {
    0% { transform: translateZ(0px); }
    100% { transform: translateZ(1px); }
  }

  /* 主卡片：必须有 translate3d 才能激活 macOS 的毛玻璃 */
  .glass-card { position: relative; z-index: 1; display: flex; flex-direction: row; padding: 28px 32px; border-radius: 34px; transform: translate3d(0,0,0); overflow: visible; }
  
  .glass-background { 
    position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: -1; 
    border-radius: inherit; border: 1px solid rgba(255, 255, 255, 0.15); 
    box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.2), 0 30px 60px rgba(0, 0, 0, 0.45); 
    overflow: hidden; 
    transform: translate3d(0,0,0); 
    will-change: transform, backdrop-filter;
    animation: forceComposite 2s infinite alternate linear; 
  }
  
  /* --- 拖拽手柄 --- */
  .stepped-drag-trigger { position: absolute; top: 0; left: 0; width: 80px; height: 80px; z-index: 100; cursor: grab; background: transparent; }
  .stepped-drag-trigger:active { cursor: grabbing; }
  
  /* 视觉阶梯渐变 */
  .stepped-drag-visual { position: absolute; top: 0; left: 0; width: 48px; height: 48px; z-index: -2; background: linear-gradient(135deg, rgba(255, 255, 255, 0.65) 0%, rgba(255, 255, 255, 0.15) 45%, rgba(255, 255, 255, 0) 100%); backdrop-filter: blur(25px) saturate(160%); -webkit-backdrop-filter: blur(25px) saturate(160%); border-radius: 10px 0 34px 0; border-left: 0.8px solid rgba(255, 255, 255, 0.4); border-top: 0.8px solid rgba(255, 255, 255, 0.4); opacity: 0; transition: opacity 0.4s cubic-bezier(0.16, 1, 0.3, 1); pointer-events: none; transform: translate3d(0,0,0); }
  .stepped-drag-trigger:hover + .stepped-drag-visual { opacity: 1; }

  /* --- 秘密入口点 --- */
  .title-group { position: relative; z-index: 101; display: flex; align-items: center; gap: 6px; letter-spacing: 1px; font-weight: 700; font-size: 0.85rem; text-transform: uppercase; cursor: pointer; transition: opacity 0.2s ease; }
  .title-group:hover { opacity: 0.6; }

  /* --- 数据导入中心样式 --- */
  .import-modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.3); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(8px); }
  .import-modal-content { background: rgba(28, 32, 40, 0.88); backdrop-filter: blur(40px); border: 1px solid rgba(255, 255, 255, 0.15); width: 460px; padding: 32px; border-radius: 28px; box-shadow: 0 40px 100px rgba(0,0,0,0.6); color: white; transform: translate3d(0,0,0); }
  .import-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
  .import-title { font-weight: 800; letter-spacing: 1.5px; font-size: 0.85rem; opacity: 0.9; text-transform: uppercase; }
  .import-close-btn { background: none; border: none; color: white; font-size: 1.2rem; cursor: pointer; opacity: 0.4; transition: 0.3s; }
  .import-close-btn:hover { opacity: 1; transform: scale(1.1); }
  .import-section { margin-bottom: 24px; }
  .section-label { font-size: 0.65rem; font-weight: 800; opacity: 0.4; margin-bottom: 12px; letter-spacing: 0.5px; }
  
  .ai-prompt-box { background: rgba(0, 0, 0, 0.2); border: 1px dashed rgba(255, 255, 255, 0.2); padding: 12px; border-radius: 14px; font-size: 0.75rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 14px; cursor: pointer; transition: all 0.3s; line-height: 1.4; }
  .ai-prompt-box:hover { background: rgba(0, 0, 0, 0.35); border-color: rgba(255, 255, 255, 0.4); color: white; }

  .import-input, .import-textarea { width: 100%; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; color: white; padding: 14px; font-family: inherit; font-size: 0.9rem; outline: none; transition: all 0.3s; }
  .import-textarea { height: 100px; resize: none; font-family: "JetBrains Mono", Menlo, monospace; font-size: 0.8rem; }
  .import-input:focus, .import-textarea:focus { border-color: rgba(255,255,255,0.25); background: rgba(0,0,0,0.35); }
  
  /* 🌟 原生日期时间选择器在暗色背景下的优化 */
  .import-input::-webkit-calendar-picker-indicator { filter: invert(1); opacity: 0.6; cursor: pointer; transition: 0.2s; }
  .import-input::-webkit-calendar-picker-indicator:hover { opacity: 1; }

  .import-apply-btn { width: 100%; padding: 14px; border-radius: 14px; background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.1); color: white; font-weight: 700; cursor: pointer; transition: all 0.3s; }
  .import-apply-btn:hover { background: rgba(255, 255, 255, 0.15); transform: translateY(-2px); }
  .import-divider { height: 1px; background: rgba(255, 255, 255, 0.06); margin: 24px 0; }

  /* 其他排版 */
  .vertical-divider { width: 1px; background: rgba(255, 255, 255, 0.08); margin: 0 32px; flex-shrink: 0; }
  .horizontal-divider { height: 1px; background: rgba(255, 255, 255, 0.05); flex-shrink: 0; margin: 0; }
  .resize-handle-container { position: absolute; bottom: 0; right: 0; width: 120px; height: 120px; display: flex; align-items: flex-end; justify-content: flex-end; cursor: pointer; z-index: 110; padding: 0px; }
  .resize-handle-container svg { opacity: 0; transition: 0.5s; pointer-events: none; color: rgba(255, 255, 255, 0.15); transform: translate(1px, 1px); }
  .resize-handle-container:hover svg { opacity: 1; color: rgba(255, 255, 255, 0.5); }
  .header-right-stack { position: relative; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; height: 28px; cursor: pointer; }
  .header-right-stack::before { content: ""; position: absolute; top: -50px; right: -50px; bottom: -50px; left: -50px; }
  .settings-ghost-trigger { position: absolute; bottom: 24px; right: 0; opacity: 0; transition: all 0.3s ease; color: rgba(255, 255, 255, 0.15); pointer-events: auto; }
  .header-right-stack:hover .settings-ghost-trigger { opacity: 1; color: rgba(255, 255, 255, 0.8); filter: drop-shadow(0px 0px 4px rgba(255,255,255,0.4)); }
  .left-panel { display: flex; flex-direction: column; width: 290px; flex-shrink: 0; height: 100%; }
  .fixed-header-area { display: flex; flex-direction: column; flex-shrink: 0; }
  .header-row { display: flex; justify-content: space-between; align-items: center; height: 28px; margin-bottom: 20px; }
  .percentage-text { font-size: 2.8rem; font-weight: 700; line-height: 1; letter-spacing: -1.5px; }
  .track { width: 100%; height: 6px; background: rgba(255, 255, 255, 0.08); border-radius: 3px; overflow: hidden; margin: 12px 0 20px 0; transform: translate3d(0,0,0); }
  .fill { height: 100%; border-radius: 3px; transition: all 0.4s ease; }
  .exam-item.primary { margin-top: 25px !important; background: rgba(255, 255, 255, 0.04); padding: 16px; border-radius: 20px; border: 1px solid rgba(255, 255, 255, 0.1); width: 100%; }
  
  .scroll-area { flex: 1; overflow-y: auto; display: flex; flex-direction: column; padding-bottom: 20px; }
  .right-panel { flex: 1; display: flex; flex-direction: column; height: 100%; }
  .calendar-header { display: flex; justify-content: space-between; align-items: center; height: 28px; margin-bottom: 16px; }
  .calendar-title { font-size: 1.2rem; font-weight: 800; line-height: 1; }
  .calendar-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; width: 100%; }
  .weekday { display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: 700; opacity: 0.3; height: 30px; text-align: center; }
  .day { position: relative; height: 36px; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
  .day.today { font-weight: 900; background: rgba(255, 255, 255, 0.08); }
  .day.selected { color: white; }
  .dot { position: absolute; bottom: 4px; width: 4px; height: 4px; border-radius: 50%; }
  .right-divider { height: 1px; background: rgba(255, 255, 255, 0.05); margin: 10px 0 20px 0; flex-shrink: 0; }
  .details-section { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .detail-header { font-size: 0.85rem; opacity: 0.8; margin-bottom: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; flex-shrink: 0; }
  
  .details-scroll-area { flex: 1; overflow-y: auto; display: flex; flex-direction: column; }
  .detail-item { margin-bottom: 16px; padding-bottom: 14px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); }
  .detail-item:last-child { margin-bottom: 0; padding-bottom: 0; border-bottom: none; }
  
  .nav-btn { display: flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: transparent; border: none; opacity: 0.5; transition: all 0.2s; color: inherit; cursor: pointer; outline: none; border-radius: 6px; -webkit-tap-highlight-color: transparent; }
  .nav-btn:focus { outline: none; background: transparent; }
  .nav-btn:hover { opacity: 1; background: rgba(255, 255, 255, 0.1); }
  .nav-btn:active { background: rgba(255, 255, 255, 0.2); transition: none; }
`;