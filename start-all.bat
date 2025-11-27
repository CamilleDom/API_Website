@echo off
chcp 65001 >nul
title 🚀 GeeKingdom - Demarrage complet
color 0B

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║     ██████╗ ███████╗███████╗██╗  ██╗██╗███╗   ██╗ ██████╗   ║
echo ║    ██╔════╝ ██╔════╝██╔════╝██║ ██╔╝██║████╗  ██║██╔════╝   ║
echo ║    ██║  ███╗█████╗  █████╗  █████╔╝ ██║██╔██╗ ██║██║  ███╗  ║
echo ║    ██║   ██║██╔══╝  ██╔══╝  ██╔═██╗ ██║██║╚██╗██║██║   ██║  ║
echo ║    ╚██████╔╝███████╗███████╗██║  ██╗██║██║ ╚████║╚██████╔╝  ║
echo ║     ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝╚═╝  ╚═══╝ ╚═════╝   ║
echo ║                                                              ║
echo ║                   🚀 Demarrage complet                       ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: ============================================
:: VERIFICATION DES PREREQUIS
:: ============================================

echo [ETAPE 0/5] Verification des prerequis...
echo.

:: Vérifier Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERREUR: Docker n'est pas installe ou n'est pas dans le PATH
    echo    Telechargez Docker Desktop: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)
echo    ✅ Docker detecte

:: Vérifier si Docker Desktop est lancé
docker info >nul 2>&1
if %errorlevel% neq 0 (
    color 0E
    echo    ⚠️  Docker Desktop n'est pas demarre. Demarrage en cours...
    start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
    echo    ⏳ Attente du demarrage de Docker Desktop (60 secondes)...
    timeout /t 60 /nobreak >nul
    
    :: Revérifier
    docker info >nul 2>&1
    if %errorlevel% neq 0 (
        color 0C
        echo ❌ ERREUR: Docker Desktop n'a pas pu demarrer
        echo    Veuillez le lancer manuellement et relancer ce script
        pause
        exit /b 1
    )
)
echo    ✅ Docker Desktop est operationnel

:: Vérifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERREUR: Node.js n'est pas installe
    echo    Telechargez Node.js: https://nodejs.org
    pause
    exit /b 1
)
echo    ✅ Node.js detecte

:: Vérifier Java
java --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERREUR: Java n'est pas installe
    echo    Telechargez Java JDK: https://adoptium.net
    pause
    exit /b 1
)
echo    ✅ Java detecte

echo.
echo ========================================
echo    ✅ Tous les prerequis sont OK !
echo ========================================
echo.

:: ============================================
:: ETAPE 1: DOCKER (MySQL + phpMyAdmin)
:: ============================================

echo [ETAPE 1/5] 🐳 Demarrage des containers Docker...
echo.

:: Arrêter les anciens containers si existants
docker-compose down >nul 2>&1

:: Lancer Docker Compose
docker-compose up -d

if %errorlevel% neq 0 (
    color 0C
    echo ❌ ERREUR: Impossible de demarrer les containers Docker
    pause
    exit /b 1
)

echo.
echo    ✅ Containers Docker lances
echo       - MySQL:      localhost:3306
echo       - phpMyAdmin: http://localhost:8081
echo.

:: ============================================
:: ETAPE 2: ATTENDRE QUE MySQL SOIT PRET
:: ============================================

echo [ETAPE 2/5] ⏳ Attente de MySQL...
echo.

set MAX_ATTEMPTS=30
set ATTEMPT=0

:wait_mysql
set /a ATTEMPT+=1
echo    Tentative %ATTEMPT%/%MAX_ATTEMPTS%...

docker exec geekingdom_mysql mysqladmin ping -h localhost -u root -proot_password_change_me >nul 2>&1
if %errorlevel% equ 0 (
    echo.
    echo    ✅ MySQL est pret !
    goto mysql_ready
)

if %ATTEMPT% geq %MAX_ATTEMPTS% (
    color 0C
    echo.
    echo ❌ ERREUR: MySQL n'a pas demarre dans le temps imparti
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

echo [ETAPE 3/5] 🟣 Demarrage de l'API Spring Boot...
echo.

:: Vérifier que le dossier existe
if not exist "API_GeeKingdom" (
    color 0C
    echo ❌ ERREUR: Dossier API_GeeKingdom introuvable
    pause
    exit /b 1
)

:: Lancer l'API dans une nouvelle fenêtre
start "🟣 API Spring Boot - GeeKingdom" cmd /k "cd API_GeeKingdom && echo 🟣 Demarrage de l'API Spring Boot... && mvnw spring-boot:run"

echo    ✅ API Spring Boot en cours de demarrage...
echo       URL: http://localhost:8080
echo.

:: Attendre que l'API soit prête
echo    ⏳ Attente du demarrage de l'API (30 secondes)...
timeout /t 30 /nobreak >nul
echo.

:: ============================================
:: ETAPE 4: SERVEUR NODE.JS
:: ============================================

echo [ETAPE 4/5] 🟡 Demarrage du serveur Node.js...
echo.

:: Vérifier que le dossier existe
if not exist "GeeKingdom\server.js" (
    color 0C
    echo ❌ ERREUR: Fichier GeeKingdom/server.js introuvable
    pause
    exit /b 1
)

:: Installer les dépendances si nécessaire
if not exist "GeeKingdom\node_modules" (
    echo    📦 Installation des dependances Node.js...
    cd GeeKingdom
    npm install
    cd ..
)

:: Lancer le serveur Node.js dans une nouvelle fenêtre
start "🟡 Node.js Server - GeeKingdom" cmd /k "cd GeeKingdom && echo 🟡 Demarrage du serveur Node.js... && node server.js"

echo    ✅ Serveur Node.js en cours de demarrage...
echo       URL: http://localhost:5000
echo.

:: Attendre
timeout /t 5 /nobreak >nul

:: ============================================
:: ETAPE 5: CLIENT REACT
:: ============================================

echo [ETAPE 5/5] 🔵 Demarrage du client React...
echo.

:: Vérifier que le dossier existe
if not exist "GeeKingdom\client\package.json" (
    color 0C
    echo ❌ ERREUR: Dossier GeeKingdom/client introuvable
    pause
    exit /b 1
)

:: Installer les dépendances si nécessaire
if not exist "GeeKingdom\client\node_modules" (
    echo    📦 Installation des dependances React...
    cd GeeKingdom\client
    npm install
    cd ..\..
)

:: Lancer le client React dans une nouvelle fenêtre
start "🔵 React Client - GeeKingdom" cmd /k "cd GeeKingdom\client && echo 🔵 Demarrage du client React... && npm start"

echo    ✅ Client React en cours de demarrage...
echo       URL: http://localhost:3000
echo.

:: ============================================
:: RESUME FINAL
:: ============================================

timeout /t 5 /nobreak >nul

cls
color 0A
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║          ✅ GEEKINGDOM DEMARRE AVEC SUCCES !                ║
echo ║                                                              ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║   🐳 DOCKER                                                  ║
echo ║      MySQL:       localhost:3306                             ║
echo ║      phpMyAdmin:  http://localhost:8081                      ║
echo ║                                                              ║
echo ║   🟣 API SPRING BOOT                                         ║
echo ║      URL:         http://localhost:8080                      ║
echo ║                                                              ║
echo ║   🟡 SERVEUR NODE.JS                                         ║
echo ║      URL:         http://localhost:5000                      ║
echo ║                                                              ║
echo ║   🔵 CLIENT REACT                                            ║
echo ║      URL:         http://localhost:3000                      ║
echo ║                                                              ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║   📊 ACCES phpMyAdmin:                                       ║
echo ║      Serveur:  mysql                                         ║
echo ║      User:     geekingdom_user                               ║
echo ║      Password: Api_Bdml_2025                                 ║
echo ║                                                              ║
echo ╠══════════════════════════════════════════════════════════════╣
echo ║                                                              ║
echo ║   💡 Pour arreter tous les services: stop-all.bat            ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Ouvrir le navigateur automatiquement
echo Ouverture du navigateur dans 5 secondes...
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo Appuyez sur une touche pour fermer cette fenetre...
echo (Les services continueront de fonctionner)
pause >nul