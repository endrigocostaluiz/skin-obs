// Servidor estático mínimo em Node.js nativo para visualização local da galeria
// Inspirado no servidor-local.js de compartilhar-tela
const http = require('http');
const fs = require('fs');
const path = require('path');

const raiz = __dirname;
const porta = Number(process.argv[2]) || 3333;

const tipos = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.json': 'application/json; charset=utf-8',
  '.zip': 'application/zip',
  '.qss': 'text/css; charset=utf-8',
  '.ovt': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  if (p === '/favicon.ico') p = '/assets/favicon.svg';
  if (p.endsWith('/')) p += 'index.html';
  
  const arquivo = path.join(raiz, path.normalize(p));
  
  if (!arquivo.startsWith(raiz) || arquivo.endsWith('servidor-local.js')) {
    res.writeHead(403);
    return res.end('Acesso negado');
  }

  fs.readFile(arquivo, (err, dados) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      return res.end('Arquivo não encontrado: ' + p);
    }
    const ext = path.extname(arquivo).toLowerCase();
    res.writeHead(200, {
      'Content-Type': tipos[ext] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
    });
    res.end(dados);
  });
}).listen(porta, () => {
  console.log(`====================================================================`);
  console.log(`  ✨ Galeria de Skins Lumina OBS rodando com sucesso!`);
  console.log(`  🌐 Acesse no seu navegador: http://localhost:${porta}`);
  console.log(`====================================================================`);
});
