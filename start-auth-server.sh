#!/bin/bash

# Brat Generator 认证服务器启动脚本

echo "🚀 启动 Brat Generator 认证服务器..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js，请先安装 Node.js"
    echo "   下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm，请先安装 npm"
    exit 1
fi

# 进入服务器目录
cd server

# 检查package.json是否存在
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 未找到 package.json 文件"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖包..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 错误: 依赖安装失败"
        exit 1
    fi
fi

# 检查环境变量文件
if [ ! -f ".env" ]; then
    echo "⚠️  警告: 未找到 .env 文件"
    echo "   请复制 env.example 为 .env 并配置您的 Google OAuth 凭据"
    echo "   命令: cp env.example .env"
    echo ""
    echo "   然后编辑 .env 文件，填入以下信息："
    echo "   - GOOGLE_CLIENT_ID=您的Google客户端ID"
    echo "   - GOOGLE_CLIENT_SECRET=您的Google客户端密钥"
    echo "   - JWT_SECRET=您的JWT密钥"
    echo ""
    read -p "是否继续启动服务器？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 启动服务器
echo "🔧 启动认证服务器..."
echo "   服务器地址: http://localhost:3001"
echo "   健康检查: http://localhost:3001/health"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm start
