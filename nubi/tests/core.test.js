import test from 'node:test';
import assert from 'node:assert/strict';
import '../core.js';

const C = globalThis.CookingCore;

test('parsea cantidades, unidades y fracciones', () => {
  assert.deepEqual(C.parseP('1,5 kg papa'), { raw: '1,5 kg papa', name: 'papa', n: 1500, u: 'g' });
  assert.deepEqual(C.parseP('1/2 kg papa').n, 500);
  assert.equal(C.parseP('200 gramos arroz').n, 200);
  assert.equal(C.parseP('1 litro leche').u, 'ml');
  assert.equal(C.parseP('1 litro leche').n, 1000);
  assert.equal(C.parseP('2 huevos').name, 'huevo');
});

test('un ingrediente sin cantidad queda pendiente de confirmar', () => {
  const p = C.parseP('papa');
  assert.equal(p.n, null);
  assert.equal(p.name, 'papa');
});

test('rechaza cantidades no positivas', () => {
  assert.throws(() => C.parseP('0 kg papa'));
});

test('alias e identidad de ingredientes', () => {
  assert.ok(C.same('papas', 'patata'));
  assert.ok(C.same('Tomates', 'tomate'));
  assert.ok(!C.same('cebolla', 'cebolla china'));
  assert.ok(!C.same('arroz', 'arroz cocido'));
  assert.ok(!C.same('leche', 'leche de coco'));
});

test('nunca convierte entre gramos, mililitros y piezas', () => {
  assert.equal(C.conv('papa', 500, 'g', 'u'), null);
  assert.equal(C.conv('leche', 500, 'ml', 'g'), null);
  assert.equal(C.conv('papa', 500, 'g', 'g'), 500);
});

test('acumula existencias del mismo ingrediente y unidad', () => {
  const pantry = [];
  C.mergePantry(pantry, C.parseP('200 g arroz'));
  C.mergePantry(pantry, C.parseP('300 g arroz'));
  assert.equal(pantry.length, 1);
  assert.equal(pantry[0].n, 500);
});

test('unidades distintas no se mezclan', () => {
  const pantry = [];
  C.mergePantry(pantry, C.parseP('2 huevos'));
  C.mergePantry(pantry, C.parseP('100 g huevo'));
  assert.equal(pantry.length, 2);
});

test('puntúa lo que alcanza, lo parcial y lo desconocido', () => {
  const pantry = [C.parseP('300 g papa'), C.parseP('cebolla')];
  const items = [
    { name: 'papa', n: 300, u: 'g' },
    { name: 'papa', n: 600, u: 'g' },
    { name: 'cebolla', n: 1, u: 'u' },
    { name: 'arroz', n: 100, u: 'g' }
  ];
  const r = C.scoreItems([items[0]], pantry).concat(
    C.scoreItems([items[1]], pantry), C.scoreItems([items[2]], pantry), C.scoreItems([items[3]], pantry));
  assert.equal(r[0].st, 'ok');
  assert.equal(r[1].st, 'pa');
  assert.equal(r[2].st, 'unknown');
  assert.equal(r[3].st, 'no');
});

test('la lista del plan suma todas las recetas antes de descontar la despensa', () => {
  const receta = { serv: 2, items: [{ name: 'papa', n: 300, u: 'g' }] };
  const rows = C.missing([
    { recipe: receta, people: 2 },
    { recipe: receta, people: 4 }
  ], [C.parseP('200 g papa')]);
  assert.equal(rows.length, 1);
  assert.equal(rows[0].n, 700); // 300 + 600 - 200
});

test('separa ingredientes por coma, punto y coma y salto de línea', () => {
  assert.deepEqual(C.split('2 huevos; 1,5 kg papa\n3 tomates'), ['2 huevos', '1,5 kg papa', '3 tomates']);
  assert.deepEqual(C.split('1,5 kg papa'), ['1,5 kg papa']);
});
