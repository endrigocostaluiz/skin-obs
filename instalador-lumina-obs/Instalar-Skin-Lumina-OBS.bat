@echo off
chcp 65001 >nul
title Instalador Oficial Lumina OBS
color 0A
setlocal

echo ====================================================================
echo             LUMINA OBS - INSTALADOR OFICIAL DE SKINS
echo ====================================================================
echo.

if not exist "%~dp0temas\lumina-oled.obt" (
    echo [ERRO] Arquivos da skin nao encontrados em "%~dp0temas".
    echo ATENCAO: Extraia TODOS os arquivos do ZIP antes de executar!
    echo.
    pause
    exit /b 1
)

:: 1. Fechar o OBS Studio para nao bloquear/regravar as configuracoes
taskkill /F /IM obs64.exe /IM obs32.exe >nul 2>&1

:: 2. Criar a pasta de temas se nao existir
set "DESTINO=%APPDATA%\obs-studio\themes"
if not exist "%DESTINO%" mkdir "%DESTINO%"

:: 3. Remover versoes antigas da skin (.qss/.ovt do formato legado nao funcionam no OBS 30+)
del /Q "%DESTINO%\lumina-*.qss" "%DESTINO%\lumina-*.ovt" "%DESTINO%\cyber-amber.*" "%DESTINO%\midnight-violet.*" "%DESTINO%\nordic-light.*" >nul 2>&1
del /Q "%DESTINO%\*.qss" "%DESTINO%\*.ovt" >nul 2>&1

:: 4. Copiar temas (.obt) e as pastas de icones (Lumina-*) - inclui subpastas
echo [+] Instalando temas e icones na pasta do OBS Studio...
xcopy /E /I /Y /Q "%~dp0temas\*" "%DESTINO%\" >nul

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERRO] Nao foi possivel copiar os arquivos de temas.
    echo.
    pause
    exit /b 1
)

echo [OK] 5 skins instaladas com icones em:
echo      %DESTINO%
echo.
echo ====================================================================
echo Qual modelo voce deseja ativar agora no OBS Studio?
echo ====================================================================
echo.
echo  [1] Lumina OLED Obsidian     (Verde Esmeralda - Preto Puro)
echo  [2] Lumina Slate             (Azul Safira - Ardosia Anti-Fadiga)
echo  [3] Cyber Amber Broadcast    (Ambar Estudio Radio e TV)
echo  [4] Midnight Creator         (Violeta Neon Twitch e Kick)
echo  [5] Nordic Clean Studio      (Modo Claro Alto Contraste)
echo  [6] Apenas instalar (escolho depois no menu do OBS)
echo.
set /p escolha="Digite o numero da opcao (1-6) [Padrao: 1]: "

if "%escolha%"=="" set escolha=1
set "TEMA_ID="
if "%escolha%"=="1" set "TEMA_ID=lumina-oled"& set "TEMA_NOME=Lumina OLED Obsidian"
if "%escolha%"=="2" set "TEMA_ID=lumina-slate"& set "TEMA_NOME=Lumina Slate"
if "%escolha%"=="3" set "TEMA_ID=cyber-amber"& set "TEMA_NOME=Cyber Amber Broadcast"
if "%escolha%"=="4" set "TEMA_ID=midnight-violet"& set "TEMA_NOME=Midnight Creator"
if "%escolha%"=="5" set "TEMA_ID=nordic-light"& set "TEMA_NOME=Nordic Clean Studio"

if not defined TEMA_ID (
    echo.
    echo Instalacao concluida sem ativacao direta.
    echo Ative em: Configuracoes - Aparencia - Tema.
    goto finalizar
)

echo.
echo Ativando a skin %TEMA_NOME%...
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0aplicar-tema.ps1" -ThemeId "%TEMA_ID%"

:finalizar
echo.
echo ====================================================================
echo                     INSTALACAO CONCLUIDA!
echo ====================================================================
echo.
echo Dica: para a fonte identica ao preview, instale "Plus Jakarta Sans"
echo e "JetBrains Mono" (fonts.google.com). Sem elas o OBS usa Segoe UI.
echo.
set /p abrir="Deseja abrir o OBS Studio agora com o novo visual? (S/N) [Padrao: S]: "
if "%abrir%"=="" set abrir=S
if /i "%abrir%"=="S" (
    if exist "C:\Program Files\obs-studio\bin\64bit\obs64.exe" (
        start "" /D "C:\Program Files\obs-studio\bin\64bit" "C:\Program Files\obs-studio\bin\64bit\obs64.exe"
    ) else if exist "%LOCALAPPDATA%\Programs\obs-studio\bin\64bit\obs64.exe" (
        start "" /D "%LOCALAPPDATA%\Programs\obs-studio\bin\64bit" "%LOCALAPPDATA%\Programs\obs-studio\bin\64bit\obs64.exe"
    ) else (
        echo Inicie o OBS pelo seu atalho habitual na Area de Trabalho ou Iniciar.
    )
)
echo.
echo Pressione qualquer tecla para encerrar este instalador.
pause >nul
