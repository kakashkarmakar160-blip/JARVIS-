@echo off
setlocal
cd /d "%~dp0"

echo.
echo ========================================
echo   JARVIS - Gemini Setup
 echo ========================================
echo.

if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :error
)

if not exist .env (
  echo.
  echo ERROR: .env file was not found.
  echo Copy .env.example to .env and add your Gemini API key.
  goto :error
)

echo.
echo Starting JARVIS...
echo Open http://localhost:3000 in your browser.
echo.
call npm start
if errorlevel 1 goto :error
exit /b 0

:error
echo.
echo JARVIS setup/start failed. Read the message above.
pause
exit /b 1
