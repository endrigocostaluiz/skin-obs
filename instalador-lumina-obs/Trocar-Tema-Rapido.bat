@echo off
chcp 65001 >nul
title Alternador Rápido de Temas Lumina OBS
color 0B

echo ====================================================================
echo             LUMINA OBS - TROCADOR RÁPIDO DE TEMAS
echo ====================================================================
echo.
echo Escolha qual tema você deseja ativar no OBS Studio:
echo.
echo  [1] Lumina OLED Obsidian     (Verde Esmeralda - Preto Puro)
echo  [2] Lumina Slate             (Azul Safira - Ardósia Anti-Fadiga)
echo  [3] Cyber Amber Broadcast    (Âmbar Console Rádio e TV)
echo  [4] Midnight Creator         (Violeta Neon Twitch e Kick)
echo  [5] Nordic Clean Studio      (Modo Claro Alto Contraste)
echo  [0] Cancelar / Sair
echo.
echo ====================================================================
set /p opc="Digite o número do tema desejado (1-5): "

if "%opc%"=="1" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0aplicar-tema.ps1" -ThemeId "lumina-oled"
    goto iniciar
)
if "%opc%"=="2" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0aplicar-tema.ps1" -ThemeId "lumina-slate"
    goto iniciar
)
if "%opc%"=="3" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0aplicar-tema.ps1" -ThemeId "cyber-amber"
    goto iniciar
)
if "%opc%"=="4" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0aplicar-tema.ps1" -ThemeId "midnight-violet"
    goto iniciar
)
if "%opc%"=="5" (
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0aplicar-tema.ps1" -ThemeId "nordic-light"
    goto iniciar
)
if "%opc%"=="0" exit
echo Opção inválida!
pause
exit

:iniciar
echo.
set /p openObs="Deseja abrir o OBS Studio agora com a nova skin? (S/N) [Padrão: S]: "
if /i "%openObs%"=="" set openObs=S
if /i "%openObs%"=="S" (
    start "" "obs64.exe" 2>nul
    if %ERRORLEVEL% NEQ 0 (
        if exist "C:\Program Files\obs-studio\bin\64bit\obs64.exe" (
            start "" "C:\Program Files\obs-studio\bin\64bit\obs64.exe"
        ) else (
            echo Inicie o OBS Studio pelo seu atalho habitual.
        )
    )
)
echo.
echo Concluído! Pressione qualquer tecla para fechar.
pause >nul
