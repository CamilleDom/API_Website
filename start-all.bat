@echo off
chcp 65001 >nul
title GeeKingdom - Demarrage complet
color 0B

echo.
echo ==============================================================
echo
echo      ██████╗ ███████╗███████╗██╗  ██╗██╗███╗   ██╗ ██████╗
echo     ██╔════╝ ██╔════╝██╔════╝██║ ██╔╝██║████╗  ██║██╔════╝
echo     ██║  ███╗█████╗  █████╗  █████╔╝ ██║██╔██╗ ██║██║  ███╗
echo     ██║   ██║██╔══╝  ██╔══╝  ██╔═██╗ ██║██║╚██╗██║██║   ██║
echo     ╚██████╔╝███████╗███████╗██║  ██╗██║██║ ╚████║╚██████╔╝
echo      ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝
echo
echo                   Demarrage complet
echo ==============================================================
echo.

:: ============================================
:: VERIFICATION DES PREREQUIS
:: ============================================

echo [ETAPE 0/5] Verification des prerequis...
echo.

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERREUR: Docker n'est pas installe ou n'est pas dans le PATH
    echo Telechargez Docker Desktop sur le site officiel
    pause
    exit /b 1
)
echo Docker detecte

docker info >nul 2>&1
if %errorlevel% neq 0 (
    color 0E
    echo Docker Desktop n'est pas demarre. Demarrage en cours...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo Attente du demarrage de Docker Desktop (60 secondes)...
    timeout /t 60 /nobreak >nul
    
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        color 0C
        echo ERREUR: Docker Desktop n'a pas pu demarrer
        echo Veuillez le lancer manuellement et relancer ce script
        pause
        exit /b 1
    )
)
echo Docker Desktop est operationnel

node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERREUR: Node.js n'est pas installe
    pause
    exit /b 1
)
echo Node.js detecte

java --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ERREUR: Java n'est pas installe
    pause
    exit /b 1
)
echo Java detecte

echo.
echo =============================================================
echo    Tous les prerequis sont OK !
echo =============================================================
echo.

:: ============================================
:: ETAPE 1: DOCKER (MySQL + phpMyAdmin)
:: ============================================

echo [ETAPE 1/5] Demarrage des containers Docker...
echo.

docker-compose down >nul 2>&1
docker-compose up -d

if %errorlevel% neq 0 (
    color 0C
    echo ERREUR: Impossible de demarrer les containers Docker
    pause
    exit /b 1
)

echo Containers Docker lances
echo - MySQL:      localhost:3306
echo - phpMyAdmin: http://localhost:8081
echo.

:: ============================================
:: ETAPE 2: ATTENTE MYSQL
:: ============================================

echo [ETAPE 2/5] Attente de MySQL...
echo.

set MAX_ATTEMPTS=30
set ATTEMPT=0

:wait_mysql
set /a ATTEMPT+=1
echo Tentative %ATTEMPT%/%MAX_ATTEMPTS%...

docker exec geekingdom_mysql mysqladmin ping -h localhost -u root -proot_password_change_me >nul 2>&1
if %errorlevel% equ 0 (
    echo MySQL est pret !
    goto mysql_ready
)

if %ATTEMPT% geq %MAX_ATTEMPTS% (
    color 0C
    echo ERREUR: MySQL n'a pas demarre dans le temps imparti
    pause
    exit /b 1
)

timeout /t 2 /nobreak >nul
goto wait_mysql

:mysql_ready
echo.

:: ============================================
:: ETAPE 3: API SPRING BOOT
:: ============================================

echo [ETAPE 3/5] Demarrage de l'API Spring Boot...
echo.

if not exist "API_GeeKingdom" (
    color 0C
    echo ERREUR: Dossier API_GeeKingdom introuvable
    pause
    exit /b 1
)

start "API Spring Boot - GeeKingdom" cmd /k "cd API_GeeKingdom && echo Demarrage de l'API Spring Boot... && mvnw spring-boot:run"

echo API Spring Boot en cours de demarrage
echo URL: http://localhost:8080
echo.

timeout /t 30 /nobreak >nul

:: ============================================
:: ETAPE 4: NODE.JS
:: ============================================

echo [ETAPE 4/5] Demarrage du serveur Node.js...
echo.

if not exist "GeeKingdom\server.js" (
    color 0C
    echo ERREUR: Fichier GeeKingdom/server.js introuvable
    pause
    exit /b 1
)

if not exist "GeeKingdom\node_modules" (
    echo Installation des dependances Node.js...
    cd GeeKingdom
    npm install
    cd ..
)

start "Node.js Server - GeeKingdom" cmd /k "cd GeeKingdom && echo Demarrage du serveur Node.js... && node server.js"

echo Serveur Node.js en cours de demarrage
echo URL: http://localhost:5000
echo.

timeout /t 5 /nobreak >nul

:: ============================================
:: ETAPE 5: CLIENT REACT
:: ============================================

echo [ETAPE 5/5] Demarrage du client React...
echo.

if not exist "GeeKingdom\client\package.json" (
    color 0C
    echo ERREUR: Dossier GeeKingdom/client introuvable
    pause
    exit /b 1
)

if not exist "GeeKingdom\client\node_modules" (
    echo Installation des dependances React...
    cd GeeKingdom\client
    npm install
    cd ..\..
)

start "React Client - GeeKingdom" cmd /k "cd GeeKingdom\client && echo Demarrage du client React... && npm start"

echo Client React en cours de demarrage
echo URL: http://localhost:3000
echo.

timeout /t 5 /nobreak >nul

cls
color 0A
echo.
echo ==============================================================
echo        GEEKINGDOM DEMARRE AVEC SUCCES !
echo ==============================================================
echo DOCKER
echo    MySQL:       localhost:3306
echo    phpMyAdmin:  http://localhost:8081
echo API SPRING BOOT
echo    URL:         http://localhost:8080
echo SERVEUR NODE.JS
echo    URL:         http://localhost:5000
echo CLIENT REACT
echo    URL:         http://localhost:3000
echo ==============================================================
echo ACCES phpMyAdmin:
echo    Serveur:  mysql
echo    User:     geekingdom_user
echo    Password: Api_Bdml_2025
echo ==============================================================
echo Pour arreter tous les services: stop-all.bat
echo ==============================================================

echo.
echo Ouverture du navigateur dans 5 secondes...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo Appuyez sur une touche pour fermer cette fenetre...
pause >nul
