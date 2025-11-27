@echo off
title GeeKingdom - Statut
color 0B

echo.
echo ========================================
echo        STATUT DE GEEKINGDOM
echo ========================================
echo.

echo [DOCKER CONTAINERS]
echo ----------------------------------------
docker ps --format "   {{.Names}}: {{.Status}}" --filter "name=geekingdom" 2>nul
echo.

echo [PORTS EN ECOUTE]
echo ----------------------------------------

set "PORT3000=INACTIF"
set "PORT3306=INACTIF"
set "PORT5000=INACTIF"
set "PORT8080=INACTIF"
set "PORT8081=INACTIF"

netstat -an 2>nul | findstr ":3000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 set "PORT3000=ACTIF"

netstat -an 2>nul | findstr ":3306" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 set "PORT3306=ACTIF"

netstat -an 2>nul | findstr ":5000" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 set "PORT5000=ACTIF"

netstat -an 2>nul | findstr ":8080" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 set "PORT8080=ACTIF"

netstat -an 2>nul | findstr ":8081" | findstr "LISTENING" >nul 2>&1
if %errorlevel% equ 0 set "PORT8081=ACTIF"

echo    Port 3000 [React]      : %PORT3000%
echo    Port 3306 [MySQL]      : %PORT3306%
echo    Port 5000 [Node.js]    : %PORT5000%
echo    Port 8080 [API Java]   : %PORT8080%
echo    Port 8081 [phpMyAdmin] : %PORT8081%

echo.
echo ========================================
echo.
pause