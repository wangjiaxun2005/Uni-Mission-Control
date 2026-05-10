// ==========================================
// 数据与解析模块 (api.js)
// ==========================================

export const MOODLE_URL = "https://moodle.hku.hk/calendar/export_execute.php?userid=324899&authtoken=77df42d9aea44d7787f086c49b6586848918d6a8&preset_what=all&preset_time=monthnow";

export const customEvents = [
  { code: "MATH3911", name: "Final Exam", date: "2026-05-12T14:30:00" },
  { code: "STAT2602", name: "Final Exam", date: "2026-05-16T18:30:00" },
  { code: "IIMT2601", name: "Final Exam", date: "2026-05-19T09:30:00" },
  { code: "ECON2280", name: "Final Exam", date: "2026-05-23T18:30:00" }
];

export const parseMoodleEvents = (icalText) => {
  if (!icalText || !icalText.includes("BEGIN:VEVENT")) return [];
  
  const events = [];
  const lines = icalText.split(/\r\n|\n|\r/);
  
  let currentEvent = null;
  let rawSummary = "";
  let rawCategories = "";

  const getCategory = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes("exam") || lower.includes("test") || lower.includes("final")) return "Final Exam";
    if (lower.includes("assignment") || lower.includes("homework")) return "Assignment";
    if (lower.includes("quiz") || lower.includes("classwork") || lower.includes("lab")) return "Classwork";
    return "Task"; 
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line === "BEGIN:VEVENT") {
      currentEvent = { code: "", name: "", date: "" };
      rawSummary = "";
      rawCategories = "";
    } else if (line === "END:VEVENT") {
      if (currentEvent && currentEvent.date) {
        let courseCode = "EVENT";
        const strictCodeRegex = /([a-zA-Z]{4})\s*(\d{4})/;
        let match = rawCategories.match(strictCodeRegex);
        if (match) {
          courseCode = (match[1] + match[2]).toUpperCase();
        } else {
          match = rawSummary.match(strictCodeRegex);
          if (match) {
             courseCode = (match[1] + match[2]).toUpperCase();
          } else {
             const firstWord = rawSummary.split(" ")[0].replace(/[^a-zA-Z0-9]/g, '');
             courseCode = firstWord.length <= 8 ? firstWord.toUpperCase() : firstWord.substring(0, 8).toUpperCase();
          }
        }
        currentEvent.code = courseCode;
        currentEvent.name = getCategory(rawSummary);
        events.push(currentEvent);
      }
      currentEvent = null;
    } else if (currentEvent) {
      if (line.startsWith("SUMMARY:")) {
        rawSummary = line.substring(8).trim();
      } else if (line.startsWith("CATEGORIES:")) {
        rawCategories = line.substring(11).trim();
      } else if (line.startsWith("DTSTART")) {
         const colonIdx = line.indexOf(":");
         if (colonIdx > -1) {
           const dt = line.substring(colonIdx + 1).trim();
           const isUTC = dt.endsWith('Z');
           const cleanDt = dt.replace(/Z$/, '');
           if (cleanDt.length >= 15) {
             currentEvent.date = `${cleanDt.substring(0, 4)}-${cleanDt.substring(4, 6)}-${cleanDt.substring(6, 8)}T${cleanDt.substring(9, 11)}:${cleanDt.substring(11, 13)}:${cleanDt.substring(13, 15)}${isUTC ? 'Z' : ''}`;
           } else if (cleanDt.length === 8) {
             currentEvent.date = `${cleanDt.substring(0, 4)}-${cleanDt.substring(4, 6)}-${cleanDt.substring(6, 8)}T00:00:00`;
           }
         }
      }
    }
  }
  return events;
};