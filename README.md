# Desktop Mission Control: Integrated Academic Dashboard

## Project Overview
**Desktop Mission Control** is a high-performance desktop widget built for the **Übersicht** platform using **React**. It is designed to act as a centralized hub for academic and personal scheduling, combining real-time data synchronization with an elegant, system-integrated aesthetic.

The widget provides a live snapshot of your semester's progress, upcoming deadlines from institutional sources (like HKU Moodle), and personal milestones, all rendered directly onto the macOS desktop.

## Core Functional Modules

### 1. Yearly Progress Tracker
- **Real-time Visualization**: Displays the current percentage of the year completed.
- **Dynamic Calculation**: Automatically updates based on the current date, providing a constant macro-perspective on time management.

### 2. Intelligent Task Sidebar
- **Hybrid Data Integration**: Merges automated data from external URLs (via `.ics` parsing) with manually defined entries in `customEvents`.
- **Global Sorting**: Intelligently ranks all upcoming tasks by proximity to the current time.
- **Single Focus Primary Card**: Isolates and highlights the most immediate task with a high-visibility, large-scale countdown.
- **Scrollable Secondary List**: Organizes subsequent tasks in an elegant, scrollable container with an invisible scrollbar to maintain UI cleanliness.

### 3. Interactive Multi-Month Calendar
- **Dynamic Navigation**: Users can browse across different months using intuitive navigation arrows.
- **"Return to Today" Utility**: A centralized hollow-circle icon allows for instant re-centering of the view to the current date and month.
- **Comprehensive History**: Unlike standard lists, the calendar displays both past and future events (with past events styled as "Ended") to provide a full monthly context.

## Technical Specifications & Performance

### 🎨 Aesthetics: Apple-Style Glassmorphism
- **Liquid Border**: Implements a sophisticated multi-layered border using `box-shadow` and `inset` properties to mimic the "Liquid" aesthetic of modern macOS interfaces.
- **Variable Transparency**: Utilizes `backdrop-filter: blur(30px)` and adjustable alpha channels to ensure optimal legibility against any wallpaper.

### ⚡ Performance Engineering (Anti-Flicker)
To solve the common "flicker" issue in WebKit-based widgets during high-frequency updates (every second), the following "extreme" optimizations were implemented:
- **GPU Layer Separation**: Forced hardware acceleration via `transform: translate3d(0,0,0)` to separate the background, UI frame, and dynamic text into distinct compositor layers.
- **Micro-State Isolation**: The real-time second counter is isolated within a dedicated `<LiveCountdown />` component. This prevents the entire dashboard from re-rendering every second.
- **Rendering Constraints**: Utilized the CSS `contain` property (`layout`, `paint`, `style`) to prevent style recalculations from leaking across component boundaries.

## Setup and Customization

### Prerequisites
- [Übersicht]((https://tracesof.net/uebersicht/)) for macOS.

### Installation
1. Move the `index.jsx` (or `Exam countdown.jsx`) file into your Übersicht widgets folder.
2. The widget will automatically initialize and attempt to fetch the remote calendar data.

### Configuration
- **Data Source**: Modify the `MOODLE_URL` constant at the top of the script to point to your specific `.ics` feed.
- **Manual Tasks**: Add permanent or offline tasks to the `customEvents` array using the following schema:
  ```javascript
  { code: "COURSE_CODE", name: "Event Name", date: "YYYY-MM-DDTHH:MM:SS" }
