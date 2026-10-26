import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp, filterVision, imagePart, providerError, csp, inlineHashes, apiKey, VERSION } from '../server.js';

/* Servidor de pruebas con una IA simulada: nunca se llama al proveedor real. */
function start(generate) {
  const server = createApp({ generate: generate || (async () => ({})) });
  return new Promise(resolve => {
    server.listen(0, '127.0.0.1', () => {
      const { port } = server.address();
      resolve({
        url: `http://127.0.0.1:${port}`,
        close: () => new Promise(r => server.close(r))
      });
    });
  });
}
const post = (url, path, body) => fetch(url + path, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
});

const JPEG = Buffer.concat([Buffer.from([0xff, 0xd8, 0xff]), Buffer.alloc(40, 1)]).toString('base64');

test('salud responde la versión y si hay clave', async () => {
  const s = await start();
  const r = await fetch(s.url + '/api/health');
  const d = await r.json();
  assert.equal(r.status, 200);
  assert.equal(d.ok, true);
  assert.equal(d.version, VERSION);
  assert.equal(typeof d.aiConfigured, 'boolean');
  await s.close();
});

test('la clave se lee de GEMINI_API_KEY o de GEMINI_AI_KEY', () => {
  const before = { a: process.env.GEMINI_API_KEY, b: process.env.GEMINI_AI_KEY };
  delete process.env.GEMINI_API_KEY; delete process.env.GEMINI_AI_KEY;
  assert.equal(apiKey(), '');
  process.env.GEMINI_AI_KEY = ' abc ';
  assert.equal(apiKey(), 'abc');
  delete process.env.GEMINI_AI_KEY;
  if (before.a) process.env.GEMINI_API_KEY = before.a;
  if (before.b) process.env.GEMINI_AI_KEY = before.b;
});

test('sirve archivos públicos y bloquea los privados', async () => {
  const s = await start();
  for (const path of ['/', '/app.js', '/styles.css', '/base.css', '/manifest.webmanifest', '/privacidad.html', '/terminos.html', '/offline.html', '/assets/icon-192.png']) {
    assert.equal((await fetch(s.url + path)).status, 200, path);
  }
  for (const path of ['/server.js', '/.env', '/package.json', '/../server.js', '/tests/core.test.js']) {
    assert.equal((await fetch(s.url + path)).status, 404, path);
  }
  await s.close();
});

test('la portada lleva CSP con el hash del JSON-LD y sin inline suelto', async () => {
  const s = await start();
  const r = await fetch(s.url + '/');
  const header = r.headers.get('content-security-policy');
  assert.ok(header.includes("script-src 'self' 'sha256-"), header);
  assert.ok(!header.includes("'unsafe-inline'; script"), header);
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  await s.close();
});

test('calcula el hash solo de los scripts en línea', () => {
  const h = inlineHashes('<script src="a.js"></script><script>var a=1</script>');
  assert.equal(h.length, 1);
  assert.ok(csp(h).includes("'sha256-" + h[0] + "'"));
});

test('robots y sitemap incluyen las páginas legales', async () => {
  const s = await start();
  const robots = await (await fetch(s.url + '/robots.txt')).text();
  assert.ok(robots.includes('Disallow: /api/'));
  const sitemap = await (await fetch(s.url + '/sitemap.xml')).text();
  assert.ok(sitemap.includes('/privacidad.html'));
  assert.ok(sitemap.includes('/terminos.html'));
  await s.close();
});

test('rechaza entradas inválidas del chat y de recetas', async () => {
  const s = await start();
  assert.equal((await post(s.url, '/chat', { message: '' })).status, 400);
  assert.equal((await post(s.url, '/recetas', { ingredientes: [] })).status, 400);
  assert.equal((await post(s.url, '/noexiste', {})).status, 404);
  await s.close();
});

test('el chat descarta ids de receta inventados', async () => {
  const s = await start(async () => ({
    reply: 'Prueba', sugerencias: ['Dame los pasos'],
    acciones: [
      { tipo: 'abrir_receta', etiqueta: 'Abrir', receta_id: 'inventado' },
      { tipo: 'abrir_receta', etiqueta: 'Abrir b2', receta_id: 'b2' }
    ]
  }));
  const d = await (await post(s.url, '/chat', { message: 'hola', catalogIds: ['b1', 'b2'] })).json();
  assert.equal(d.acciones.length, 1);
  assert.equal(d.acciones[0].receta_id, 'b2');
  await s.close();
});

test('la foto necesita confirmación en la segunda revisión', async () => {
  let n = 0;
  const s = await start(async () => {
    n++;
    if (n === 1) return { scene: 'food', message: 'ok', items: [{ name: 'papa', confidence: 0.97, evidence: 'tubérculo con tierra y piel irregular', isFood: true }] };
    return { confirmed: [] }; // veto de la segunda revisión
  });
  const d = await (await post(s.url, '/ingredientes', { imagen: JPEG, mimeType: 'image/jpeg' })).json();
  assert.equal(d.items.length, 0);
  await s.close();
});

test('filtra objetos no comestibles y confianza baja', () => {
  const base = { scene: 'food', items: [], message: '' };
  assert.equal(filterVision({ ...base, items: [{ name: 'mouse', confidence: 0.99, evidence: 'tiene botones', isFood: true }] }).length, 0);
  assert.equal(filterVision({ ...base, items: [{ name: 'papa', confidence: 0.5, evidence: 'forma ovalada', isFood: true }] }).length, 0);
  assert.equal(filterVision({ ...base, items: [{ name: 'papa', confidence: 0.99, evidence: 'piel con tierra', isFood: false }] }).length, 0);
  assert.equal(filterVision({ scene: 'non_food', items: [{ name: 'papa', confidence: 0.99, evidence: 'x', isFood: true }] }).length, 0);
  assert.equal(filterVision({ ...base, items: [{ name: 'Papa', confidence: 0.99, evidence: 'piel con tierra y brotes', isFood: true }] })[0].name, 'papa');
});

test('solo acepta imágenes con cabecera real', () => {
  assert.throws(() => imagePart({ imagen: Buffer.from('hola').toString('base64'), mimeType: 'image/jpeg' }));
  assert.throws(() => imagePart({ imagen: JPEG, mimeType: 'image/gif' }));
  assert.equal(imagePart({ imagen: JPEG, mimeType: 'image/jpeg' }).inlineData.mimeType, 'image/jpeg');
});

test('verificar plato rechaza fotos de pantalla', async () => {
  const s = await start(async () => ({ es_comida: true, es_pantalla: true, coincide: true, plato_detectado: 'lomo saltado', confianza: 0.9, comentario: 'Parece una pantalla' }));
  const d = await (await post(s.url, '/verificar-plato', { imagen: JPEG, mimeType: 'image/jpeg', receta: { nombre: 'Lomo saltado', ingredientes: ['carne'] } })).json();
  assert.equal(d.verificado, false);
  assert.equal(d.motivo, 'pantalla');
  await s.close();
});

test('los errores del proveedor no exponen la clave', () => {
  const e = providerError(400, { error: { message: 'API key not valid: AIzaSyXXXX' } }, 'gemini-2.5-flash');
  assert.ok(!e.message.includes('AIzaSy'));
  assert.equal(e.status, 502);
  assert.equal(providerError(429, { error: { message: 'quota' } }, 'gemini-2.5-flash').status, 429);
});

test('limita las consultas por minuto', async () => {
  process.env.RATE_PER_MIN = '3';
  const s = await start(async () => ({ reply: 'ok', sugerencias: [], acciones: [] }));
  const codes = [];
  for (let i = 0; i < 5; i++) codes.push((await post(s.url, '/chat', { message: 'hola' })).status);
  assert.ok(codes.includes(429), codes.join(','));
  delete process.env.RATE_PER_MIN;
  await s.close();
});
