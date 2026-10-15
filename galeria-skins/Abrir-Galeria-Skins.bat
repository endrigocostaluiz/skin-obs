@echo off
chcp 65001 >nul
title Galeria Lumina OBS Skins
color 0B

echo ====================================================================
echo             LUMINA OBS - GALERIA DE MODELOS
echo ====================================================================
echo.
echo Iniciando servidor local...
echo.

start "" "http://localhost:3333"

node "%~dp0servidor-local.js" 3333

echo.
echo Servidor encerrado. Pressione qualquer tecla para sair.
pause >nul
