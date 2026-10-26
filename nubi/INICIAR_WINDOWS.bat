@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo.
echo   Nubi - Que cocino hoy
echo   ---------------------
echo   Cuando aparezca el mensaje del puerto, abre en tu navegador:
echo   http://localhost:3000
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo   [!] No encuentro Node.js. Instalalo desde https://nodejs.org y vuelve a abrir este archivo.
  pause
  exit /b 1
)
npm start
pause
