@echo off
chcp 65001 >nul
title 📊 GeeKingdom - Statut
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║              📊 STATUT DE GEEKINGDOM                        ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: ============================================
:: DOCKER
:: ============================================

echo 🐳 DOCKER CONTAINERS:
echo ─────────────────────────────────────────
docker ps --format "   {{.Names}}: {{.Status}}" --filter "name=geekingdom"
echo.

:: ============================================
:: PORTS
:: ============================================

echo 🔌 PORTS EN ECOUTE:
echo ─────────────────────────────────────────

:: Port 3000 (React)
netstat -an | findstr ":3000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    🔵 Port 3000 (React):     ✅ ACTIF
) else (
    echo    🔵 Port 3000 (React):     ❌ INACTIF
)

:: Port 3306 (MySQL)
netstat -an | findstr ":3306" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    🐬 Port 3306 (MySQL):     ✅ ACTIF
) else (
    echo    🐬 Port 3306 (MySQL):     ❌ INACTIF
)

:: Port 5000 (Node.js)
netstat -an | findstr ":5000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    🟡 Port 5000 (Node.js):   ✅ ACTIF
) else (
    echo    🟡 Port 5000 (Node.js):   ❌ INACTIF
)

:: Port 8080 (Spring Boot)
netstat -an | findstr ":8080" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    🟣 Port 8080 (API Java):  ✅ ACTIF
) else (
    echo    🟣 Port 8080 (API Java):  ❌ INACTIF
)

:: Port 8081 (phpMyAdmin)
netstat -an | findstr ":8081" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 (
    echo    📊 Port 8081 (phpMyAdmin):✅ ACTIF
) else (
    echo    📊 Port 8081 (phpMyAdmin):❌ INACTIF
)

echo.
echo ─────────────────────────────────────────
echo.
echo Appuyez sur une touche pour fermer...
pause >nul