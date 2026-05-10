#!/bin/bash

# --- 脚本说明：自动安装 Uni Mission Control 插件 ---

# 1. 定义插件名称和 Übersicht 的目标路径
WIDGET_NAME="Uni_Mission_Control.widget"
DEST_PATH="$HOME/Library/Application Support/Uebersicht/widgets"

echo "🚀 开始安装 $WIDGET_NAME..."

# 2. 检查当前目录下是否存在插件文件夹
if [ -d "$WIDGET_NAME" ]; then
    # 3. 创建目标目录（如果不存在）
    mkdir -p "$DEST_PATH"
    
    # 4. 将插件复制过去
    cp -R "$WIDGET_NAME" "$DEST_PATH/"
    
    echo "✅ 插件已成功复制到 Übersicht 目录！"
    
    # 5. 尝试运行/重新运行 Übersicht
    if pgrep -x "Uebersicht" > /dev/null; then
        echo "🔄 检测到 Übersicht 正在运行，请在菜单栏点击 'Refresh All Widgets'。"
    else
        echo "💡 正在尝试为你启动 Übersicht..."
        open -a "Uebersicht"
    fi
else
    echo "❌ 错误：在当前目录下找不到 $WIDGET_NAME 文件夹。"
    echo "请确保你在下载的文件夹内运行此脚本。"
fi

echo "🎉 安装完成！现在你可以尽情使用了。"
