// ==========================================
// 图标资源模块 (icons.jsx)
// ==========================================
import { React } from "uebersicht";

export const IconEllipsisH = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
  </svg>
);

export const IconFlag = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/>
  </svg>
);

export const ChevronLeft = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

export const ChevronRight = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

export const CircleDot = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

export const ArcResizeHandle = () => (
  <svg width="40" height="40" viewBox="0 0 40 40">
    <path d="M 35 10 A 25 25 0 0 1 10 35" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
  </svg>
);