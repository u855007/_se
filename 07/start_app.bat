@echo off
echo Starting Backend...
start /B cmd /c "cd /d %~dp0server && cargo run"

echo Starting Frontend...
start /B cmd /c "cd /d %~dp0client && npx serve ."

echo Waiting for servers...
timeout /t 7 /nobreak > nul

echo Opening Browser...
start http://localhost:3000

echo App is running. Keep this window open.
pause
