@echo off
title CA BillMate - Multi-Engine AI Bill Recognition System
color 0B

echo ===============================================================================
echo                CA BillMate - AI Bill Recognition System
echo          FastAPI AI Microservice + Vite React Chartered Accountant UI
echo ===============================================================================
echo.

:: 1. Launch Backend in a dedicated window
echo [*] Starting AI OCR Backend Microservice (FastAPI on port 8000)...
start "CA BillMate - AI Backend (FastAPI)" cmd /k "cd backend && call start_backend.bat"

:: 2. Wait a moment for backend initialization
timeout /t 2 /nobreak >nul

:: 3. Launch Frontend Vite Dev Server
echo [*] Starting Frontend UI (Vite on port 5173)...
echo [*] Opening application in your default web browser...
start http://localhost:5173

npm run dev

pause
