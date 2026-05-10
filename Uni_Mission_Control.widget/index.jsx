// ==========================================
// 主入口文件 (index.jsx)
// ==========================================
import { React } from "uebersicht";

// 像搭积木一样导入我们拆分好的模块
import { MOODLE_URL, customEvents, parseMoodleEvents } from "./api.jsx";
import { widgetStyles } from "./styles.jsx";
import { DashboardWidget } from "./App.jsx";

// 告诉 Uebersicht 该干什么
export const command = `curl -sL "${MOODLE_URL}"`;
export const refreshFrequency = 3600000; 
export const className = widgetStyles;

// 最终渲染
export const render = ({ output, error }) => {
  let moodleEvents = [];
  
  if (error) {
    console.error("Failed to sync Moodle Calendar");
  } else if (output) {
    moodleEvents = parseMoodleEvents(output);
  }

  return <DashboardWidget moodleData={moodleEvents} manualData={customEvents} />;
};