/* Comprueba que la clave y el modelo de Gemini funcionan de verdad.
   Uso:  npm run diagnostico        */
import { gemini, apiKey, VERSION } from './server.js';

const ok = t => console.log('\x1b[32m✓\x1b[0m ' + t);
const no = t => console.log('\x1b[31m✗\x1b[0m ' + t);

console.log(`\nNubi v${VERSION} · diagnóstico\n`);

const key = apiKey();
if (!key) {
  no('No hay clave. Crea un archivo .env con GEMINI_API_KEY=tu_clave y vuelve a intentar.');
  process.exit(1);
}
ok(`Clave encontrada (termina en …${key.slice(-4)}). No la compartas con nadie.`);
ok(`Modelo configurado: ${(process.env.MODEL || 'gemini-2.5-flash').trim()}`);

const schema = {
  type: 'object',
  properties: { saludo: { type: 'string' } },
  required: ['saludo']
};

try {
  console.log('\nConsultando al proveedor…');
  const t0 = Date.now();
  const r = await gemini(
    [{ text: 'Responde el campo saludo con la palabra listo, en minúsculas.' }],
    schema, 'Eres un verificador de configuración. Responde solo el JSON pedido.',
    { maxOutputTokens: 200, temperature: 0 }
  );
  const seg = ((Date.now() - t0) / 1000).toFixed(1);
  ok(`La IA respondió en ${seg} s: ${JSON.stringify(r)}`);
  console.log('\nTodo correcto. El chat, las sugerencias y las fotos deberían funcionar.\n');
} catch (e) {
  no(e.message);
  console.log('\nLa app sigue funcionando sin IA: catálogo, despensa, compras y modo cocina.\n');
  process.exit(1);
}
