@echo off
title GeeKingdom - Arret complet
color 0C

echo.
echo ========================================
echo        ARRET DE GEEKINGDOM
echo ========================================
echo.

REM ============================================
REM ETAPE 1: CONTAINERS DOCKER
REM ============================================

echo [1/4] Arret des containers Docker...
docker-compose down >nul 2>&1
if %errorlevel% equ 0 goto docker_ok
echo    [INFO] Aucun container actif
goto stop_node

:docker_ok
echo    [OK] Containers Docker arretes
echo.

REM ============================================
REM ETAPE 2: NODE.JS
REM ============================================

:stop_node
echo [2/4] Arret de Node.js...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 goto node_ok
echo    [INFO] Node.js n'etait pas en cours d'execution
goto stop_java

:node_ok
echo    [OK] Node.js arrete
echo.

REM ============================================
REM ETAPE 3: JAVA / SPRING BOOT
REM ============================================

:stop_java
echo [3/4] Arret de Java/Spring Boot...
taskkill /F /IM java.exe >nul 2>&1
if %errorlevel% equ 0 goto java_ok
echo    [INFO] Java n'etait pas en cours d'execution
goto close_windows

:java_ok
echo    [OK] Java/Spring Boot arrete
echo.

REM ============================================
REM ETAPE 4: FERMER LES FENETRES
REM ============================================

:close_windows
echo [4/4] Fermeture des fenetres de commande...

taskkill /FI "WINDOWTITLE eq API Spring Boot*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Node.js Server*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq React Client*" /F >nul 2>&1

echo    [OK] Fenetres fermees
echo.

REM ============================================
REM RESUME
REM ============================================

color 0A
echo ========================================
echo    TOUS LES SERVICES SONT ARRETES
echo ========================================
echo.
echo    Services arretes:
echo    ----------------------------------------
echo    - Docker MySQL
echo    - Docker phpMyAdmin
echo    - API Spring Boot
echo    - Serveur Node.js
echo    - Client React
echo    ----------------------------------------
echo.
echo    Pour redemarrer: start-all.bat
echo.
echo ========================================
echo.
pause