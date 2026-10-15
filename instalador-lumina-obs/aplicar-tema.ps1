param (
    [string]$ThemeId = "lumina-oled"
)

# Aceita o id curto (lumina-oled) ou o id completo (com.lumina.luminaoled)
$mapa = @{
    "lumina-oled"     = "com.lumina.luminaoled"
    "lumina-slate"    = "com.lumina.luminaslate"
    "cyber-amber"     = "com.lumina.cyberamber"
    "midnight-violet" = "com.lumina.midnightviolet"
    "nordic-light"    = "com.lumina.nordiclight"
    "yami"            = "com.obsproject.Yami.Original"
}
if ($mapa.ContainsKey($ThemeId)) { $ThemeId = $mapa[$ThemeId] }

$obsDir = Join-Path $env:APPDATA "obs-studio"

# Fecha o OBS: ele regrava os .ini ao sair e desfaria a alteracao
$obs = Get-Process -Name "obs64", "obs32" -ErrorAction SilentlyContinue
if ($obs) {
    Write-Host "[AVISO] Fechando o OBS Studio para poder aplicar a skin..." -ForegroundColor Yellow
    $obs | Stop-Process -Force
    Start-Sleep -Seconds 2
}

# O OBS 31+ le [Appearance] Theme de user.ini; versoes anteriores leem de global.ini.
# Por isso o tema e gravado nos dois arquivos.
function Set-ObsTheme([string]$arquivo, [string]$id) {
    if (-not (Test-Path $arquivo)) { return $false }
    Copy-Item $arquivo "$arquivo.bak" -Force

    $linhas = Get-Content -Path $arquivo -Encoding UTF8
    $novas = New-Object System.Collections.Generic.List[string]
    $emAparencia = $false
    $aplicado = $false

    foreach ($l in $linhas) {
        if ($l.Trim() -match "^\[.*\]$") {
            # Saindo de [Appearance] sem ter achado Theme=: insere antes da proxima secao
            if ($emAparencia -and -not $aplicado) { $novas.Add("Theme=$id"); $aplicado = $true }
            $emAparencia = ($l.Trim() -eq "[Appearance]")
        }
        elseif ($emAparencia -and $l -match "^Theme=") {
            $novas.Add("Theme=$id"); $aplicado = $true
            continue
        }
        $novas.Add($l)
    }

    if ($emAparencia -and -not $aplicado) { $novas.Add("Theme=$id"); $aplicado = $true }
    if (-not $aplicado) { $novas.Add(""); $novas.Add("[Appearance]"); $novas.Add("Theme=$id") }

    # OBS grava os .ini em UTF-8 com BOM
    [System.IO.File]::WriteAllLines($arquivo, $novas, (New-Object System.Text.UTF8Encoding($true)))
    return $true
}

$ok = $false
foreach ($nome in @("user.ini", "global.ini")) {
    if (Set-ObsTheme (Join-Path $obsDir $nome) $ThemeId) { $ok = $true }
}

if ($ok) {
    Write-Host "[OK] Skin '$ThemeId' configurada como padrao no OBS Studio!" -ForegroundColor Green
    Write-Host "     Ao abrir o OBS, a skin ja estara ativa." -ForegroundColor Cyan
} else {
    Write-Host "[AVISO] Nenhum user.ini/global.ini encontrado em $obsDir." -ForegroundColor Yellow
    Write-Host "        Abra o OBS uma vez e escolha a skin em Configuracoes -> Aparencia -> Tema." -ForegroundColor Gray
    exit 1
}
