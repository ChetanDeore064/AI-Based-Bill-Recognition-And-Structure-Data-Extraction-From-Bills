@echo off
setlocal enabledelayedexpansion

echo ===================================================================
echo     CA BillMate - AI OCR & FastAPI Backend Microservice
echo ===================================================================
echo.

:: 1. Check if python is in PATH
where python >nul 2>nul
if %errorlevel% equ 0 (
    set "PYTHON_EXE=python"
    goto :found_python
)

where py >nul 2>nul
if %errorlevel% equ 0 (
    set "PYTHON_EXE=py"
    goto :found_python
)

:: 2. Check AppData local python installs
for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python*") do (
    if exist "%%D\python.exe" (
        set "PYTHON_EXE=%%D\python.exe"
        goto :found_python
    )
)

:: 3. Check Program Files
for /d %%D in ("%ProgramFiles%\Python*") do (
    if exist "%%D\python.exe" (
        set "PYTHON_EXE=%%D\python.exe"
        goto :found_python
    )
)

echo [!] Python was not found in PATH or standard directories.
echo.
echo Would you like to install Python 3.11 automatically using Windows Package Manager (winget)?
echo.
set /p INSTALL_CHOICE="Install Python now? (Y/N): "
if /i "%INSTALL_CHOICE%"=="Y" (
    echo [*] Installing Python 3.11...
    winget install Python.Python.3.11 --silent --accept-package-agreements --accept-source-agreements
    echo.
    echo [*] Python installed! Please close and re-run this script.
    pause
    exit /b 0
) else (
    echo.
    echo Please download and install Python from: https://www.python.org/downloads/
    echo (Make sure to check 'Add python.exe to PATH' during installation)
    pause
    exit /b 1
)

:found_python
echo [*] Using Python executable: %PYTHON_EXE%
%PYTHON_EXE% --version
echo.

:: Check virtual environment
if not exist "venv" (
    echo [*] Creating virtual environment (venv)...
    %PYTHON_EXE% -m venv venv
)

if exist "venv\Scripts\activate.bat" (
    echo [*] Activating venv...
    call venv\Scripts\activate.bat
    set "PY_CMD=python"
) else (
    set "PY_CMD=%PYTHON_EXE%"
)

echo [*] Installing dependencies from requirements.txt...
%PY_CMD% -m pip install -r requirements.txt --quiet

echo.
echo ===================================================================
echo   Backend is live at: http://localhost:8000
echo   API Docs (Swagger): http://localhost:8000/docs
echo   Health Check:       http://localhost:8000/api/health
echo ===================================================================
echo.

%PY_CMD% -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
pause
