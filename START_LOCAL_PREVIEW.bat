@echo off
setlocal
cd /d "%~dp0"
where python >nul 2>nul
if errorlevel 1 (
  echo Python was not found. Please install Python or upload the files to a web server.
  pause
  exit /b 1
)
echo Starting local preview at http://127.0.0.1:8080/index.html
echo Press Ctrl+C in this window to stop the preview server.
start "" "http://127.0.0.1:8080/index.html"
python -m http.server 8080 --bind 127.0.0.1
pause
