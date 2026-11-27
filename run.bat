@echo off
cd /d "%~dp0"
echo ============================================
echo  Dormie is starting.
echo  Open your browser at: http://localhost:5173/index.html
echo ============================================
python -m http.server 5173
pause