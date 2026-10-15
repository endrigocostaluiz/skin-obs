@echo off
chcp 65001 >nul
title Desinstalador Lumina OBS Skin
color 0C

powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0desinstalar.ps1"
