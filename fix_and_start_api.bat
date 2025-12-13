@echo off
title Fix PowerShell PATH and Start API
color 0E

echo.
echo ========================================
echo   CORRECTION PATH POWERSHELL
echo ========================================
echo.

REM Ajouter PowerShell au PATH pour cette session
set "PATH=%PATH%;%SystemRoot%\System32\WindowsPowerShell\v1.0"

echo PowerShell ajoute au PATH
echo.

REM Verifier que PowerShell fonctionne
powershell -Command "Write-Host 'PowerShell OK'" 2>nul
if %errorlevel% neq 0 (
    echo [ERREUR] PowerShell introuvable
    pause
    exit /b 1
)

echo [OK] PowerShell detecte
echo.

REM Demarrer l'API
echo ========================================
echo   DEMARRAGE API SPRING BOOT
echo ========================================
echo.

cd /d "%~dp0"
if exist "API_GeeKingdom" (
    cd API_GeeKingdom
    echo JAVA_HOME = %JAVA_HOME%
    echo.
    echo Demarrage de l'API Spring Boot...
    echo.
    call mvnw.cmd clean compile
    call mvnw.cmd spring-boot:run
    pause
)
          