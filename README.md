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
    * **Auto-Sync**: Automatically parses iCal subscription URLs from Moodle/Canvas.
    * **AI Import**: Built-in AI Prompt helps transform raw text into valid JSON mission formats.
* **Visual Excellence**: 
    * **Glassmorphism**: Deep frosted glass texture designed to match macOS modern aesthetics.
    * **Status Indicators**: Past events automatically dim and display an "ENDED" tag for clarity.
* **GUI Customization**: Integrated settings panel to adjust accent colors, text colors, and blur intensity without touching code.

### 🛠️ Installation
#### Option A: Full-Pack (Recommended for New Users)
1. Go to the **Releases** page of this repository.
2. Download the `Uni-Mission-Control-Full-Pack.zip`.
3. Extract the ZIP and double-click **`Install_Widget.app`**. This pack includes the Übersicht app itself.

#### Option B: Manual Installation
1. Ensure you have [Übersicht](https://tracesof.net/uebersicht/) installed and moved to your `/Applications` folder.
2. Download this repository and move the **`Uni_Mission_Control.widget`** folder to your Übersicht widgets directory.

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

### 🛠️ 安装指南
#### 方案 A：全家桶安装（推荐新手使用）
1. 前往本仓库的 **Releases** 页面。
2. 下载 `Uni-Mission-Control-Full-Pack.zip`。
3. 解压后直接双击运行 **`安装插件.app`**。该包内已包含 Übersicht 原生软件。

#### 方案 B：手动安装
1. 确保您已安装 [Übersicht](https://tracesof.net/uebersicht/) 并将其移至“应用程序”文件夹。
2. 下载本项目，将 **`Uni_Mission_Control.widget`** 文件夹 放入 Übersicht 的插件目录中。

---

### 📂 仓库结构 / Repository Structure

```text
.
├── Uni_Mission_Control.widget/   # 核心代码文件夹 / Core widget code
│   ├── index.jsx                 # 插件入口 / Entry point
│   ├── App.jsx                   # 逻辑核心 / UI Logic
│   ├── api.jsx                   # 数据解析 / Data Parsing
│   ├── styles.jsx                # 样式定义 / Styles
│   ├── Settings.jsx              # 设置面板 / Settings
│   └── ImportModal.jsx           # 导入面板 / Import Modal
├── 安装插件.app (Install.app)     # 一键安装工具 / One-click installer
├── README.md                     # 说明文档 / Documentation
└── image_cf9a5a.jpg              # 预览截图 / Preview screenshot
