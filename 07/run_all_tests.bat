@echo off
echo ========================================================
echo       🚀 All-in-One Test Suite Launcher
echo ========================================================

:: 1. Run Unit Tests (Fastest, no server needed)
echo.
echo [1/3] Running Unit Tests (Rust)...
cd /d %~dp0server
cargo test
if %errorlevel% neq 0 (
    echo [!] Unit Tests FAILED
) else (
    echo [OK] Unit Tests PASSED
)

:: 2. Run System Tests (Needs Server)
echo.
echo [2/3] Running System Tests (API)...
echo Starting server in background...
start /B cmd /c "cd /d %~dp0server && cargo run"
timeout /t 5 /nobreak > nul
cd /d %~dp0tests\system
python system_test.py
if %errorlevel% neq 0 (
    echo [!] System Tests FAILED
) else (
    echo [OK] System Tests PASSED
)

:: 3. Run E2E Tests (Needs Server + Client)
echo.
echo [3/3] Running E2E Tests (Playwright)...
echo Starting frontend in background...
start /B cmd /c "cd /d %~dp0client && npx serve ."
timeout /t 5 /nobreak > nul
cd /d %~dp0tests\e2e
npx playwright test
if %errorlevel% neq 0 (
    echo [!] E2E Tests FAILED
) else (
    echo [OK] E2E Tests PASSED
)

echo.
echo ========================================================
echo    Tests Completed! Please check the results above.
echo ========================================================
pause
