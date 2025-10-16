# HR调度系统前端开发服务器启动脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "HR调度系统前端开发服务器启动脚本" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js是否安装
try {
    $nodeVersion = node --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[信息] Node.js版本: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js未安装"
    }
} catch {
    Write-Host "[错误] 未检测到Node.js，请先安装Node.js" -ForegroundColor Red
    Write-Host "请访问 https://nodejs.org/ 下载并安装最新LTS版本" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "按任意键退出"
    exit 1
}

# 检查npm是否可用
try {
    $npmVersion = npm --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[信息] npm版本: $npmVersion" -ForegroundColor Green
    } else {
        throw "npm不可用"
    }
} catch {
    Write-Host "[错误] npm不可用，请检查Node.js安装" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}

Write-Host ""

# 检查是否存在node_modules目录
if (-not (Test-Path "node_modules")) {
    Write-Host "[信息] 首次运行，正在安装依赖..." -ForegroundColor Yellow
    Write-Host ""
    
    try {
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "[成功] 依赖安装完成" -ForegroundColor Green
        } else {
            throw "依赖安装失败"
        }
    } catch {
        Write-Host "[错误] 依赖安装失败" -ForegroundColor Red
        Read-Host "按任意键退出"
        exit 1
    }
} else {
    Write-Host "[信息] 依赖已存在，跳过安装" -ForegroundColor Green
}

Write-Host ""
Write-Host "[信息] 启动开发服务器..." -ForegroundColor Yellow
Write-Host "[信息] 前端应用将在 http://localhost:3000 启动" -ForegroundColor Cyan
Write-Host "[信息] 请确保后端服务在 http://localhost:8000 运行" -ForegroundColor Cyan
Write-Host ""
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Magenta
Write-Host ""

# 启动开发服务器
try {
    npm run dev
} catch {
    Write-Host "[错误] 启动开发服务器失败" -ForegroundColor Red
    Read-Host "按任意键退出"
    exit 1
}