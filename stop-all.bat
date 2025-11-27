@echo off
chcp 65001 >nul
title GeeKingdom - Arret complet
color 0C

echo.
echo =============================================================
echo
echo                  ARRET DE GEEKINGDOM
echo
echo =============================================================
echo.

:: ============================================
:: ARRETER LES CONTAINERS DOCKER
:: ============================================

echo [1/4]   Arret des containers Docker...
docker-compose down
echo     Containers Docker arretes
echo.

:: ============================================
:: ARRETER NODE.JS
:: ============================================

echo [2/4]  Arret du serveur Node.js...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo     Node.js arrete
) else (
    echo         Node.js n'etait pas en cours d'execution
)
echo.

:: ============================================
:: ARRETER JAVA (Spring Boot)
:: ============================================

echo [3/4]   Arret de l'API Spring Boot...
taskkill /F /IM java.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo       Java/Spring Boot arrete
) else (
    echo      Java n'etait pas en cours d'execution
)
echo.

:: ============================================
:: FERMER LES FENETRES DE COMMANDE
:: ============================================

echo [4/4]   Fermeture des fenetres...

:: Fermer les fenêtres par leur titre
taskkill /FI "WINDOWTITLE eq API Spring Boot*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Node.js Server*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq React Client*" /F >nul 2>&1

echo         Fenetres fermees
echo.

:: ============================================
:: RESUME
:: ============================================

color 0A
echo.
echo =============================================================
echo
echo              TOUS LES SERVICES SONT ARRETES
echo
echo =============================================================
echo.
echo Appuyez sur une touche pour fermer...
pause >nul
