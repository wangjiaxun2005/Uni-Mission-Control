# 🚀 Uni Mission Control

[**English**](#-uni-mission-control-en) | [**中文说明**](#-uni-mission-control-zh)

---

<a name="-uni-mission-control-en"></a>
## 🇬🇧 Uni Mission Control (English)

**An aesthetic, high-performance mission management widget for macOS.**

Built on the [Übersicht](https://tracesof.net/uebersicht/) framework, this widget provides a transparent, "jelly-like" elastic mission monitoring panel. It features automatic Moodle/iCal synchronization and AI-driven field recognition.

### 📸 Preview
![Widget Preview](image_cf9a5a.jpg) 
*(The panel displays countdowns, progress bars, and calendar details)*

### ✨ Key Features
* **Dynamic Layout**: Window height automatically adjusts based on task count with smooth `cubic-bezier` animations.
* **Smart Sync**: 
    * **Auto-Sync**: Automatically parses iCal subscription URLs (Moodle/Canvas).
    * **AI Import**: Built-in AI Prompt helps transform raw text into valid JSON mission formats.
* **Visual Excellence**: 
    * **Glassmorphism**: Deep frosted glass texture designed to match macOS modern aesthetics.
    * **Status Indicators**: Past events automatically dim and display an "ENDED" tag for clarity.
* **GUI Customization**: Integrated settings panel to adjust accent colors, text colors, and blur intensity without touching code.

### 🛠️ One-Click Installation (Recommended)
1.  **Requirement**: Ensure you have [Übersicht](https://tracesof.net/uebersicht/) installed.
2.  **Download**: Click `Code` -> `Download ZIP` and extract the package.
3.  **Run**: Double-click **`Install_Widget.app`** (or your designated installer app).
4.  **Done**: The widget will be moved to the widgets folder and refreshed automatically.

---

<a name="-uni-mission-control-zh"></a>
## 🇨🇳 Uni Mission Control (中文说明)

**一款为 macOS 打造的极致美学任务管理插件。**

基于 [Übersicht](https://tracesof.net/uebersicht/) 框架开发，提供具有“果冻感”弹性动画的任务监控面板。支持 Moodle/iCal 自动同步及 AI 智能字段识别。

### 📸 预览
![插件预览](image_cf9a5a.jpg) 
*(面板展示了任务倒计时、年度进度条以及详细的日历日程)*

### ✨ 核心特性
* **动态布局**：窗口高度随任务数量自动伸缩，并带有丝滑的弹性过渡动画。
* **多维同步**：
    * **自动订阅**：支持自动解析 iCal 订阅链接（如 Moodle/Canvas）。
    * **AI 导入**：内置 AI Prompt 引导，支持将繁杂的文本一键转化为标准的 JSON 任务字段。
* **极致视觉**：
    * **磨砂玻璃**：完美契合 macOS 系统的深色毛玻璃质感设计。
    * **状态识别**：已结束的事件会自动变淡并显示 “ENDED” 标签。
* **图形化定制**：内置设置面板，可直接自定义强调色、文字颜色及背景模糊度。

### 🛠️ 一键安装 (推荐)
1.  **前提条件**：请确保已安装 [Übersicht 原生软件](https://tracesof.net/uebersicht/)。
2.  **下载项目**：点击页面右上方 `Code` -> `Download ZIP` 并解压。
3.  **运行工具**：在文件夹中双击 **`安装插件.app`**。
4.  **安装完成**：脚本会自动将插件移动至正确目录并刷新桌面预览。

---

### 📂 仓库结构 / Repository Structure

```text
.
├── Uni_Mission_Control.widget/   # 核心代码文件夹 / Core widget code
│   ├── index.jsx                 # 插件入口 / Entry point
│   ├── App.jsx                   # 逻辑核心 / UI Logic
│   ├── api.jsx                   # 数据解析 / Data Parsing
│   └── ...
├── 安装插件.app (Install.app)     # 一键安装工具 / One-click installer
├── README.md                     # 说明文档 / Documentation
└── image_cf9a5a.jpg              # 预览截图 / Preview screenshot
