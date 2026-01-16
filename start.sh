#!/bin/bash

# 一键启动前后端服务脚本
# 适用于 macOS/Linux

set -e  # 遇到错误立即退出

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 清理函数：在脚本退出时清理后台进程
cleanup() {
    print_info "正在清理后台进程..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
    fi
    exit 0
}

# 注册清理函数
trap cleanup SIGINT SIGTERM EXIT

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

print_info "开始启动前后端服务..."

# 1. 检查并启动后端
print_info "检查后端环境..."

if [ ! -d "backend/venv" ]; then
    print_warning "后端虚拟环境不存在，请先创建虚拟环境："
    echo "  cd backend && python3 -m venv venv"
    exit 1
fi

# 激活后端虚拟环境并启动
print_info "启动后端服务..."
cd backend
source venv/bin/activate

# 检查数据库是否已初始化
if [ ! -f "app.db" ]; then
    print_warning "数据库未初始化，正在初始化..."
    PYTHONPATH=$(pwd) python app/db_init.py || python -m app.db_init
fi

# 在后台启动后端服务
python run.py > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

print_success "后端服务已启动 (PID: $BACKEND_PID)"
print_info "后端日志: tail -f backend.log"

# 等待后端启动
sleep 2

# 2. 检查并启动前端
print_info "检查前端环境..."

if [ ! -d "frontend/node_modules" ]; then
    print_warning "前端依赖未安装，正在安装..."
    cd frontend
    if command -v pnpm &> /dev/null; then
        pnpm install
    elif command -v npm &> /dev/null; then
        npm install
    elif command -v yarn &> /dev/null; then
        yarn install
    else
        print_error "未找到包管理器 (pnpm/npm/yarn)，请先安装"
        exit 1
    fi
    cd ..
fi

print_info "启动前端服务..."
cd frontend

# 在后台启动前端服务
if command -v pnpm &> /dev/null; then
    pnpm dev > ../frontend.log 2>&1 &
elif command -v npm &> /dev/null; then
    npm run dev > ../frontend.log 2>&1 &
elif command -v yarn &> /dev/null; then
    yarn dev > ../frontend.log 2>&1 &
else
    print_error "未找到包管理器 (pnpm/npm/yarn)"
    exit 1
fi

FRONTEND_PID=$!
cd ..

print_success "前端服务已启动 (PID: $FRONTEND_PID)"
print_info "前端日志: tail -f frontend.log"

# 等待服务启动
sleep 3

# 3. 显示启动信息
echo ""
print_success "前后端服务已启动！"
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}📦 后端服务${NC}"
echo -e "   地址: ${GREEN}http://localhost:3000${NC}"
echo -e "   API 文档: ${GREEN}http://localhost:3000/docs${NC}"
echo ""
echo -e "${BLUE}🎨 前端服务${NC}"
echo -e "   地址: ${GREEN}http://localhost:5178${NC}"
echo ""
echo -e "${BLUE}📝 日志查看${NC}"
echo -e "   后端日志: ${YELLOW}tail -f backend.log${NC}"
echo -e "   前端日志: ${YELLOW}tail -f frontend.log${NC}"
echo ""
echo -e "${BLUE}🛑 停止服务${NC}"
echo -e "   按 ${YELLOW}Ctrl+C${NC} 停止所有服务"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# 保持脚本运行，等待用户中断
wait
