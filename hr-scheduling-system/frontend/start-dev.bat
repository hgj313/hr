@echo off
echo ========================================
echo HR调度系统前端开发服务器启动脚本
echo ========================================
echo.

REM 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到Node.js，请先安装Node.js
    echo 请访问 https://nodejs.org/ 下载并安装最新LTS版本
    echo.
    pause
    exit /b 1
)

echo [信息] Node.js版本:
node --version
echo.

REM 检查npm是否可用
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] npm不可用，请检查Node.js安装
    pause
    exit /b 1
)

echo [信息] npm版本:
npm --version
echo.

REM 检查是否存在node_modules目录
if not exist "node_modules" (
    echo [信息] 首次运行，正在安装依赖...
    echo.
    npm install
    if %errorlevel% neq 0 (
        echo [错误] 依赖安装失败
        pause
        exit /b 1
    )
    echo.
    echo [成功] 依赖安装完成
    echo.
) else (
    echo [信息] 依赖已存在，跳过安装
    echo.
)

echo [信息] 启动开发服务器...
echo [信息] 前端应用将在 http://localhost:3000 启动
echo [信息] 请确保后端服务在 http://localhost:8000 运行
echo.
echo 按 Ctrl+C 停止服务器
echo.

REM 启动开发服务器
npm run dev

pause