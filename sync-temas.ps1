# Regenera os temas (.obt + icones), sincroniza com a galeria, recompila o ZIP e monta docs/ (GitHub Pages)
$raiz = $PSScriptRoot
node (Join-Path $raiz "gerar-temas.mjs")

$origem = Join-Path $raiz "instalador-lumina-obs\temas"
$galeria = Join-Path $raiz "galeria-skins\temas"
if (Test-Path $galeria) { Remove-Item "$galeria\*" -Recurse -Force }
Copy-Item -Path "$origem\*" -Destination $galeria -Recurse -Force

$zip = Join-Path $raiz "galeria-skins\assets\Instalador-Skin-Lumina-OBS.zip"
Compress-Archive -Path "$raiz\instalador-lumina-obs\*" -DestinationPath $zip -Force

# Site publicado (GitHub Pages: branch main, pasta /docs)
$docs = Join-Path $raiz "docs"
if (Test-Path $docs) { Remove-Item $docs -Recurse -Force }
New-Item -ItemType Directory -Force -Path $docs | Out-Null
Copy-Item -Path "$raiz\galeria-skins\*" -Destination $docs -Recurse -Force -Exclude "servidor-local.js","*.bat"
New-Item -ItemType File -Force -Path (Join-Path $docs ".nojekyll") | Out-Null
Write-Host "SYNC_CONCLUIDO_COM_SUCESSO"
