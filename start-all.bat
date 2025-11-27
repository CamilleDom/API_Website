@echo off
title GeeKingdom - Demarrage complet
color 0B

echo.
echo ========================================
echo        DEMARRAGE DE GEEKINGDOM
echo ========================================
echo.

REM ============================================
REM VERIFICATION DES PREREQUIS
REM ============================================

echo [ETAPE 0/5] Verification des prerequis...
echo.

REM Verifier Docker
docker --version >nul 2>&1
if %errorlevel% neq 0 goto docker_not_found
echo    [OK] Docker detecte
goto check_docker_running

:docker_not_found
color 0C
echo    [ERREUR] Docker n'est pas installe
echo    Telechargez: https://www.docker.com/products/docker-desktop
pause
exit /b 1

:check_docker_running
REM Verifier si Docker Desktop est lance
docker info >nul 2>&1
if %errorlevel% neq 0 goto start_docker
echo    [OK] Docker Desktop operationnel
goto check_node

:start_docker
color 0E
echo    [ATTENTION] Docker Desktop n'est pas demarre
echo    Tentative de demarrage automatique...
start "" "C:\Program Files\Docker\Docker\Docker Desktop.exe"
echo    Attente du demarrage - 60 secondes
timeout /t 60 /nobreak >nul

docker info >nul 2>&1
if %errorlevel% neq 0 goto docker_failed
echo    [OK] Docker Desktop demarre
goto check_node

:docker_failed
color 0C
echo    [ERREUR] Docker Desktop n'a pas pu demarrer
echo    Veuillez le lancer manuellement et relancer ce script
pause
exit /b 1

:check_node
REM Verifier Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 goto node_not_found
echo    [OK] Node.js detecte
goto check_java

:node_not_found
color 0C
echo    [ERREUR] Node.js n'est pas installe
echo    Telechargez: https://nodejs.org
pause
exit /b 1

:check_java
REM Verifier Java - essayer plusieurs methodes
java -version >nul 2>&1
if %errorlevel% equ 0 goto java_found

java --version >nul 2>&1
if %errorlevel% equ 0 goto java_found

REM Verifier si JAVA_HOME est defini
if defined JAVA_HOME goto java_home_found

REM Verifier si mvnw peut fonctionner
if exist "API_GeeKingdom\mvnw.cmd" goto java_skip_check

goto java_not_found

:java_found
echo    [OK] Java detecte
goto prereq_ok

:java_home_found
echo    [OK] Java detecte via JAVA_HOME
echo        JAVA_HOME = %JAVA_HOME%
goto prereq_ok

:java_skip_check
color 0E
echo    [ATTENTION] Java non detecte dans PATH
echo    Maven Wrapper sera utilise pour lancer l'API
echo    Si l'API ne demarre pas, installez Java et ajoutez-le au PATH
color 0B
goto prereq_ok

:java_not_found
color 0E
echo    [ATTENTION] Java non detecte
echo.
echo    Options:
echo    1. Continuer quand meme - appuyez sur une touche
echo    2. Quitter - fermez cette fenetre
echo.
echo    Pour installer Java: https://adoptium.net
echo.
pause
color 0B
goto prereq_ok

:prereq_ok
echo.
echo    Tous les prerequis sont OK
echo.

REM ============================================
REM ETAPE 1: DOCKER
REM ============================================

echo [ETAPE 1/5] Demarrage des containers Docker...
echo.

docker-compose down >nul 2>&1
docker-compose up -d

if %errorlevel% neq 0 goto docker_compose_failed
echo    [OK] Containers Docker lances
echo        - MySQL:      localhost:3306
echo        - phpMyAdmin: http://localhost:8081
echo.
goto wait_mysql

:docker_compose_failed
color 0C
echo    [ERREUR] Impossible de demarrer Docker Compose
pause
exit /b 1

REM ============================================
REM ETAPE 2: ATTENDRE MYSQL
REM ============================================

:wait_mysql
echo [ETAPE 2/5] Attente de MySQL...
echo.

set MAX_ATTEMPTS=30
set ATTEMPT=0

:mysql_loop
set /a ATTEMPT+=1
echo    Tentative %ATTEMPT% sur %MAX_ATTEMPTS%

docker exec geekingdom_mysql mysqladmin ping -h localhost -u root -proot_password_change_me >nul 2>&1
if %errorlevel% equ 0 goto mysql_ok

if %ATTEMPT% geq %MAX_ATTEMPTS% goto mysql_timeout

timeout /t 2 /nobreak >nul
goto mysql_loop

:mysql_timeout
color 0C
echo.
echo    [ERREUR] MySQL n'a pas demarre dans le temps imparti
pause
exit /b 1

:mysql_ok
echo.
echo    [OK] MySQL est pret
echo.

REM ============================================
REM ETAPE 3: API SPRING BOOT
REM ============================================

echo [ETAPE 3/5] Demarrage de l'API Spring Boot...
echo.

if not exist "API_GeeKingdom" goto api_not_found

REM Utiliser mvnw.cmd sur Windows
if exist "API_GeeKingdom\mvnw.cmd" goto use_mvnw_cmd

REM Sinon utiliser mvnw
start "API Spring Boot" cmd /k "cd API_GeeKingdom && echo Demarrage de l API Spring Boot... && mvnw spring-boot:run"
goto api_started

:use_mvnw_cmd
start "API Spring Boot" cmd /k "cd API_GeeKingdom && echo Demarrage de l API Spring Boot... && mvnw.cmd spring-boot:run"
goto api_started

:api_started
echo    [OK] API en cours de demarrage
echo        URL: http://localhost:8080
echo.
echo    Attente de 30 secondes
timeout /t 30 /nobreak >nul
echo.
goto start_node

:api_not_found
color 0C
echo    [ERREUR] Dossier API_GeeKingdom introuvable
pause
exit /b 1

REM ============================================
REM ETAPE 4: SERVEUR NODE.JS
REM ============================================

:start_node
echo [ETAPE 4/5] Demarrage du serveur Node.js...
echo.

if not exist "GeeKingdom\server.js" goto node_server_not_found

if not exist "GeeKingdom\node_modules" goto install_node_deps
goto launch_node

:install_node_deps
echo    Installation des dependances Node.js...
cd GeeKingdom
call npm install
cd ..

:launch_node
start "Node.js Server" cmd /k "cd GeeKingdom && echo Demarrage du serveur Node.js... && node server.js"

echo    [OK] Node.js en cours de demarrage
echo        URL: http://localhost:5000
echo.
timeout /t 5 /nobreak >nul
goto start_react

:node_server_not_found
color 0C
echo    [ERREUR] Fichier GeeKingdom/server.js introuvable
pause
exit /b 1

REM ============================================
REM ETAPE 5: CLIENT REACT
REM ============================================

:start_react
echo [ETAPE 5/5] Demarrage du client React...
echo.

if not exist "GeeKingdom\client\package.json" goto react_not_found

if not exist "GeeKingdom\client\node_modules" goto install_react_deps
goto launch_react

:install_react_deps
echo    Installation des dependances React...
cd GeeKingdom\client
call npm install
cd ..\..

:launch_react
start "React Client" cmd /k "cd GeeKingdom\client && echo Demarrage du client React... && npm start"

echo    [OK] React en cours de demarrage
echo        URL: http://localhost:3000
echo.
goto show_summary

:react_not_found
color 0C
echo    [ERREUR] Dossier GeeKingdom/client introuvable
pause
exit /b 1

REM ============================================
REM RESUME FINAL
REM ============================================

:show_summary
timeout /t 5 /nobreak >nul
cls
color 0A

echo.
echo ========================================
echo    GEEKINGDOM DEMARRE AVEC SUCCES
echo ========================================
echo.
echo    SERVICES ACTIFS:
echo    ----------------------------------------
echo    MySQL:       localhost:3306
echo    phpMyAdmin:  http://localhost:8081
echo    API Java:    http://localhost:8080
echo    Node.js:     http://localhost:5000
echo    React:       http://localhost:3000
echo    ----------------------------------------
echo.
echo    ACCES phpMyAdmin:
echo    ----------------------------------------
echo    Serveur:  mysql
echo    User:     geekingdom_user
echo    Password: Api_Bdml_2025
echo    ----------------------------------------
echo.
echo    Pour arreter: stop-all.bat
echo.
echo ========================================
echo.

echo Ouverture du navigateur dans 5 secondes
timeout /t 5 /nobreak >nul
start http://localhost:3000

echo.
echo Appuyez sur une touche pour fermer cette fenetre
pause >nul