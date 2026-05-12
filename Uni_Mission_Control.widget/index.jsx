// ==========================================
// 主入口文件 (index.jsx)
// ==========================================
import { React } from "uebersicht";

import { MOODLE_URL, customEvents, parseMoodleEvents } from "./api.jsx";
import { widgetStyles } from "./styles.jsx";
import { DashboardWidget } from "./App.jsx";

export const command = `curl -sL "${MOODLE_URL}"`;
export const refreshFrequency = 3600000; 
export const className = widgetStyles;

export const render = ({ output, error }) => {
  let moodleEvents = [];
  
  if (error) {
    console.error("Failed to sync Moodle Calendar");
  } else if (output) {
    moodleEvents = parseMoodleEvents(output);
  }

  return <DashboardWidget moodleData={moodleEvents} manualData={customEvents} />;
};