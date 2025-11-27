@echo off
title GeeKingdom - Redemarrage complet
color 0E

echo.
echo ========================================
echo      REDEMARRAGE DE GEEKINGDOM
echo ========================================
echo.

echo [ETAPE 1/2] Arret des services en cours...
echo.

echo    Arret des containers Docker...
docker-compose down >nul 2>&1
echo    [OK] Docker arrete

echo    Arret de Node.js...
taskkill /F /IM node.exe >nul 2>&1
echo    [OK] Node.js arrete

echo    Arret de Java...
taskkill /F /IM java.exe >nul 2>&1
echo    [OK] Java arrete

echo    Fermeture des fenetres...
taskkill /FI "WINDOWTITLE eq API Spring Boot*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq Node.js Server*" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq React Client*" /F >nul 2>&1
echo    [OK] Fenetres fermees

echo.
echo    Tous les services sont arretes.
echo.

echo    Redemarrage dans 5 secondes
timeout /t 5 /nobreak >nul
echo.

echo [ETAPE 2/2] Demarrage des services...
echo.

call start-all.bat