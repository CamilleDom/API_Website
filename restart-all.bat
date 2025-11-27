@echo off
chcp 65001 >nul
title GeeKingdom - Redemarrage
color 0E

echo.
echo =============================================================
echo
echo                  REDEMARRAGE DE GEEKINGDOM
echo
echo =============================================================
echo.

echo [1/2] Arret des services...
call stop-all.bat

echo.
echo [2/2] Demarrage des services...
timeout /t 3 /nobreak >nul
call start-all.bat

echo.
echo =============================================================
echo
echo                  REDEMARRAGE TERMINE
echo
echo =============================================================
echo.
pause >nul
