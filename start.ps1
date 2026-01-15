# 一键启动前后端服务脚本
# 适用于 Windows PowerShell

$ErrorActionPreference = "Stop"

# 颜色输出函数
function Write-Info {
    Write-Host "ℹ️  $args" -ForegroundColor Cyan
}

function Write-Success {
    Write-Host "✅ $args" -ForegroundColor Green
}

function Write-Warning {
    Write-Host "⚠️  $args" -ForegroundColor Yellow
}

function Write-Error {
    Write-Host "❌ $args" -ForegroundColor Red
}

# 清理函数
function Cleanup {
    Write-Info "正在清理后台进程..."
    if ($backendJob) {
        Stop-Job $backendJob -ErrorAction SilentlyContinue
        Remove-Job $backendJob -ErrorAction SilentlyContinue
    }
    if ($frontendJob) {
        Stop-Job $frontendJob -ErrorAction SilentlyContinue
        Remove-Job $frontendJob -ErrorAction SilentlyContinue
    }
}

# 注册清理函数
Register-EngineEvent PowerShell.Exiting -Action { Cleanup } | Out-Null

# 获取脚本所在目录
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptDir

Write-Info "开始启动前后端服务..."

# 1. 检查并启动后端
Write-Info "检查后端环境..."

if (-not (Test-Path "backend\venv")) {
    Write-Warning "后端虚拟环境不存在，请先创建虚拟环境："
    Write-Host "  cd backend && python -m venv venv"
    exit 1
}

# 检查 Python 命令
$pythonCmd = "python"
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    if (Get-Command py -ErrorAction SilentlyContinue) {
        $pythonCmd = "py"
    } else {
        Write-Error "未找到 Python，请先安装 Python"
        exit 1
    }
}

Write-Info "启动后端服务..."

# 检查数据库是否已初始化
if (-not (Test-Path "backend\app.db")) {
    Write-Warning "数据库未初始化，正在初始化..."
    Set-Location backend
    & $pythonCmd -m app.db_init
    Set-Location ..
}

# 启动后端服务（后台任务）
Set-Location backend
$backendScript = @"
`$env:VIRTUAL_ENV = '$((Get-Location).Path)\venv'
`$env:PATH = '$((Get-Location).Path)\venv\Scripts;' + `$env:PATH
& $pythonCmd run.py
"@

$backendJob = Start-Job -ScriptBlock ([scriptblock]::Create($backendScript)) -Name "Backend"
Set-Location ..

Write-Success "后端服务已启动 (Job ID: $($backendJob.Id))"
Write-Info "后端日志: Receive-Job -Job $($backendJob.Id) -Keep"

# 等待后端启动
Start-Sleep -Seconds 2

# 2. 检查并启动前端
Write-Info "检查前端环境..."

if (-not (Test-Path "frontend\node_modules")) {
    Write-Warning "前端依赖未安装，正在安装..."
    Set-Location frontend
    
    if (Get-Command pnpm -ErrorAction SilentlyContinue) {
        pnpm install
    } elseif (Get-Command npm -ErrorAction SilentlyContinue) {
        npm install
    } elseif (Get-Command yarn -ErrorAction SilentlyContinue) {
        yarn install
    } else {
        Write-Error "未找到包管理器 (pnpm/npm/yarn)，请先安装"
        exit 1
    }
    
    Set-Location ..
}

Write-Info "启动前端服务..."
Set-Location frontend

# 启动前端服务（后台任务）
if (Get-Command pnpm -ErrorAction SilentlyContinue) {
    $frontendJob = Start-Job -ScriptBlock { pnpm dev } -Name "Frontend"
} elseif (Get-Command npm -ErrorAction SilentlyContinue) {
    $frontendJob = Start-Job -ScriptBlock { npm run dev } -Name "Frontend"
} elseif (Get-Command yarn -ErrorAction SilentlyContinue) {
    $frontendJob = Start-Job -ScriptBlock { yarn dev } -Name "Frontend"
} else {
    Write-Error "未找到包管理器 (pnpm/npm/yarn)"
    exit 1
}

Set-Location ..

Write-Success "前端服务已启动 (Job ID: $($frontendJob.Id))"
Write-Info "前端日志: Receive-Job -Job $($frontendJob.Id) -Keep"

# 等待服务启动
Start-Sleep -Seconds 3

# 3. 显示启动信息
Write-Host ""
Write-Success "前后端服务已启动！"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host "📦 后端服务" -ForegroundColor Cyan
Write-Host "   地址: http://localhost:8000" -ForegroundColor Green
Write-Host "   API 文档: http://localhost:8000/docs" -ForegroundColor Green
Write-Host ""
Write-Host "🎨 前端服务" -ForegroundColor Cyan
Write-Host "   地址: http://localhost:5178" -ForegroundColor Green
Write-Host ""
Write-Host "📝 日志查看" -ForegroundColor Cyan
Write-Host "   后端日志: Receive-Job -Job $($backendJob.Id) -Keep" -ForegroundColor Yellow
Write-Host "   前端日志: Receive-Job -Job $($frontendJob.Id) -Keep" -ForegroundColor Yellow
Write-Host ""
Write-Host "🛑 停止服务" -ForegroundColor Cyan
Write-Host "   按 Ctrl+C 停止所有服务" -ForegroundColor Yellow
Write-Host "   或运行: Stop-Job -Job `$backendJob,`$frontendJob" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Green
Write-Host ""

# 保持脚本运行，等待用户中断
try {
    while ($true) {
        Start-Sleep -Seconds 1
        # 检查任务是否还在运行
        if ($backendJob.State -eq "Failed" -or $frontendJob.State -eq "Failed") {
            Write-Error "服务异常退出"
            break
        }
    }
} finally {
    Cleanup
}
