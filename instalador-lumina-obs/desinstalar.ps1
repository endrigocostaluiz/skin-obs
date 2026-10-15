# ====================================================================
# DESINSTALADOR - LUMINA OBS SKIN
# Remove os arquivos da skin e restaura o tema padrao (Yami)
# ====================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

Clear-Host
Write-Host "====================================================================" -ForegroundColor Red
Write-Host "             DESINSTALADOR DE SKINS LUMINA OBS STUDIO               " -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Red
Write-Host ""

$obsDir = Join-Path $env:APPDATA "obs-studio"
$themesDir = Join-Path $obsDir "themes"

$confirm = Read-Host "Tem certeza que deseja desinstalar todas as skins Lumina do OBS? (S/N)"
if ($confirm -notmatch "^[sSyY]") {
    Write-Host "Desinstalacao cancelada." -ForegroundColor Yellow
    Pause
    exit
}

Get-Process -Name "obs64", "obs32" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 1

if (Test-Path $themesDir) {
    $itens = Get-ChildItem -Path $themesDir | Where-Object {
        $_.Name -like "Lumina-*" -or $_.Name -like "lumina-*" -or $_.Name -like "cyber-amber.*" -or
        $_.Name -like "midnight-violet.*" -or $_.Name -like "nordic-light.*"
    }
    foreach ($item in $itens) {
        Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "  [OK] Removido: $($item.Name)" -ForegroundColor Gray
    }
}

foreach ($nome in @("user.ini", "global.ini")) {
    $arq = Join-Path $obsDir $nome
    if (-not (Test-Path $arq)) { continue }
    try {
        $txt = Get-Content -Path $arq -Raw -Encoding UTF8
        $txt = $txt -replace "(?m)^Theme=com\.lumina\..*$", "Theme=com.obsproject.Yami.Original"
        [System.IO.File]::WriteAllText($arq, $txt, (New-Object System.Text.UTF8Encoding($true)))
        Write-Host "[OK] $nome restaurado para o tema padrao (Yami)." -ForegroundColor Green
    } catch {
        Write-Host "[AVISO] Nao foi possivel restaurar $nome automaticamente." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "[SUCESSO] Skins Lumina desinstaladas com sucesso!" -ForegroundColor Green
Write-Host ""
Pause
