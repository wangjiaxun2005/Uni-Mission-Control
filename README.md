# 🚀 Uni Mission Control

[**English**](#-uni-mission-control-en) | [**中文说明**](#-uni-mission-control-zh)

---

<a name="-uni-mission-control-en"></a>
## 🇬🇧 Uni Mission Control (English)

**An aesthetic, high-performance mission management widget for macOS.**

Built on the [Übersicht](https://tracesof.net/uebersicht/) framework, this widget provides a transparent, "jelly-like" elastic mission monitoring panel. It features automatic Moodle/iCal synchronization and AI-driven field recognition.

### 📸 Preview
![Widget Preview](preview.png) 

### ✨ Key Features
* **Dynamic Layout**: Window height automatically adjusts based on task count with smooth elastic animations.
* **Smart Sync**: Automatically parses iCal subscription URLs from Moodle/Canvas using system `curl`.
* **AI Import**: Built-in AI Prompt helps transform raw text into valid JSON mission formats.
* **Visual Excellence**: Deep frosted glass texture designed to match macOS modern aesthetics.

### 🛠️ Installation & Sync Guide
1. **Download Übersicht**: Visit the [Official Website](https://tracesof.net/uebersicht/) to download and open the software.
   * ⚠️ **IMPORTANT**: **Do NOT** move the Übersicht app to your `/Applications` folder. Keep it in your local folder to ensure the "Open Widgets Folder" function works correctly.
2. **Download Widget**: Click on **`Uni_Mission_Control.widget.zip`** in this repository and download it.
3. **Install**: 
   * Extract the zip to get the **`Uni_Mission_Control.widget`** folder.
   * Click the `Ü` icon in your menu bar -> **"Open Widgets Folder"**.
   * Drag the folder into the directory that just opened.
4. **Sync URL**: 
   * Click the **"MISSION"** title or the flag icon on the widget.
   * Paste your Moodle/iCal subscription URL and click **Save**.

---

<a name="-uni-mission-control-zh"></a>
## 🇨🇳 Uni Mission Control (中文说明)

**一款为 macOS 打造的极致美学任务管理插件。**

基于 [Übersicht](https://tracesof.net/uebersicht/) 框架开发，提供具有“果冻感”弹性动画的任务监控面板。支持 Moodle/iCal 自动同步及 AI 智能字段识别。

### 📸 预览
![插件预览](preview.png) 

### ✨ 核心特性
* **动态布局**：窗口高度随任务数量自动伸缩，并带有丝滑的弹性过渡动画。
* **自动同步**：支持自动解析 Moodle/Canvas 的 iCal 订阅链接，实时更新任务。
* **AI 导入**：内置 AI Prompt 引导，支持将文本一键转化为标准的 JSON 任务字段。
* **极致视觉**：完美契合 macOS 系统的深色毛玻璃质感设计。

### 🛠️ 安装与同步指南
1. **下载运行环境**: 前往 [Übersicht 官网](https://tracesof.net/uebersicht/) 下载并打开软件。
   * ⚠️ **重要提示**: **请勿** 将 Übersicht 软件移动到系统的“应用程序 (Applications)”文件夹中。请将其保留在本地运行，以确保“Open Widgets Folder”功能正常响应。
2. **下载插件**: 点击仓库中的 **`Uni_Mission_Control.widget.zip`** 并下载。
3. **安装插件**: 
   * 解压获得 **`Uni_Mission_Control.widget`** 文件夹。
   * 点击菜单栏的 `Ü` 图标 -> **"Open Widgets Folder"**。
   * 将文件夹整体拖入打开的目录中。
4. **同步订阅链接**:
   * 在桌面上点击插件左上角的 **"MISSION"** 标题或小旗子图标。
   * 在弹出的输入框中粘贴你的 **Moodle/iCal 订阅链接**，点击 **Save** 即可实时同步。

---

### 📂 仓库结构 / Repository Structure
```text
.
├── Uni_Mission_Control.widget.zip  # 插件压缩包
├── README.md                       # 说明文档
└── preview.png                     # 预览截图
