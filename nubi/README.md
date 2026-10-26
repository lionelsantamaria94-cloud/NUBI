# Nubi · ¿Qué cocino hoy? · versión 4.0.0

App web instalable, pensada para celular y computadora. Incluye 101 recetas, despensa, cámara/galería, favoritos, recetas propias, planificación, lista de compras, modo cocina con niveles y un asistente conversacional con IA. Predomina la cocina peruana, con opciones internacionales. Los datos se guardan en el navegador del usuario: no hay cuentas ni sincronización en la nube.

Para publicarla en internet y en la Play Store, sigue **PUBLICAR.md**.

---

## Qué cambió en la versión 4

**Correcciones críticas**

- La clave de IA no se leía. El archivo `.env` decía `GEMINI_AI_KEY` y el servidor buscaba `GEMINI_API_KEY`, así que el chat, las sugerencias y las fotos nunca funcionaban. Ahora el servidor acepta `GEMINI_API_KEY`, `GEMINI_AI_KEY` o `GOOGLE_API_KEY`.
- El modelo por omisión era `gemini-3.8-flash`, que podía no existir en tu cuenta. Ahora es `gemini-2.5-flash` y la búsqueda de alternativas incluye los modelos Flash de la serie 2 en adelante.
- `npm test` fallaba porque no existía la carpeta `tests`. Ahora hay 24 pruebas automáticas.
- Faltaban todos los iconos (`assets/`). Sin ellos la app no se puede instalar ni empaquetar para Android. Ya están incluidos.

**Requisitos de la Play Store**

- Página de **política de privacidad** (`/privacidad.html`) y de **términos de uso** (`/terminos.html`), con la fecha, el correo de contacto y el detalle de qué se envía a Gemini.
- Botón **Borrar todos mis datos** en ⚙️ Ajustes, que es el borrado que exige Google.
- Botón **Restaurar una copia** para reponer un respaldo exportado antes.
- Iconos 192, 512 y maskable, `apple-touch-icon`, `favicon.ico`, imagen para compartir (1200 × 630) y gráfico de función para la ficha de Play (1024 × 500).

**Seguridad**

- Content Security Policy estricta. Los dos bloques en línea del HTML se autorizan por hash, no con `unsafe-inline`.
- Cabeceras `Permissions-Policy` (cámara sí, micrófono y ubicación no) y `Strict-Transport-Security` cuando hay proxy.
- Límite de consultas de IA por minuto **y por día**, con tabla acotada para que no crezca sin fin.
- Se eliminó `prueba.html`, una página de depuración que quedaba pública. Su función la cumple ahora `npm run diagnostico`, que se ejecuta en tu terminal.
- Se eliminó `u.js`, código duplicado que no se cargaba.

**Experiencia de uso**

- El tema oscuro se aplica antes de pintar, así que ya no parpadea en blanco al abrir.
- La barra de estado del celular cambia de color con el tema.
- Funciona sin internet: nuevo service worker con red primero, respaldo en caché y página de "sin conexión". Avisa cuando hay una versión nueva.
- Accesos directos al mantener pulsado el icono: Despensa, Platos y Mi cocina.
- Enlaces directos: `/?ir=1` abre la despensa, `/?ir=2` los platos, `/?ir=4` tu cocina.
- Si ocurre un error de JavaScript, la app avisa en vez de quedarse congelada.
- El CSS que estaba dentro del HTML pasó a `base.css`, así se guarda en caché y la página pesa menos.

---

## Empezar en tu computadora

1. Descomprime **todo** el paquete en una carpeta.
2. Instala Node.js 20.11 o posterior (recomendado 22).
3. Abre una terminal en esa carpeta y ejecuta `npm start`. No hace falta `npm install`: no hay dependencias.
4. Abre `http://localhost:3000`. En Windows puedes usar `INICIAR_WINDOWS.bat`.
5. La despensa, el catálogo, los favoritos, las compras y el modo cocina funcionan sin clave. Para el chat, las sugerencias y las fotos, configura la IA.

## Activar la IA

Copia `.env.example` como `.env` y pon tu clave de Google AI Studio en `GEMINI_API_KEY`. No la pongas en el HTML ni en el JavaScript del navegador, y no la compartas en un chat. Reinicia el servidor.

Comprueba que funciona de verdad:

```
npm run diagnostico
```

`/api/health` dice si hay clave configurada, pero no prueba que sea válida. El diagnóstico sí hace una consulta real.

Si falta la clave o falla la conexión, el chat lo dice y ofrece una **orientación local identificada como sin IA**. Nunca inventa una respuesta del servicio ni finge reconocer una imagen.

## Variables disponibles

Están todas comentadas en `.env.example`: `GEMINI_API_KEY`, `MODEL`, `SITE_URL`, `CONTACT_EMAIL`, `GOOGLE_SITE_VERIFICATION`, `TRUST_PROXY`, `RATE_PER_MIN`, `RATE_PER_DAY`, `AI_ATTEMPT_MS`, `AI_DEADLINE_MS`, `THINKING_LEVEL`, `PORT`.

## Despensa y compras

- `1,5 kg papa` equivale a 1500 g. Se admiten gramos, kilogramos, litros, mililitros, unidades y fracciones como `1/2 kg papa`.
- Separa ingredientes con coma y espacio, punto y coma o salto de línea. La coma entre dígitos es decimal.
- Sin cantidad, el ingrediente queda pendiente de confirmar; nunca se da por suficiente.
- No se inventan conversiones entre gramos, mililitros y piezas. Pesa las piezas si la receta exige gramos.
- Cebolla y cebolla china, arroz seco y cocido, leche y leche de coco son ingredientes distintos.
- Agregar más cantidad del mismo ingrediente y unidad suma existencias. Para corregir un registro, elimínalo y vuelve a introducirlo.
- La lista del plan suma todas las recetas antes de descontar existencias. Regenerarla reemplaza ese cálculo sin volver a sumar, y conserva el marcado si el artículo y la cantidad no cambiaron.
- Generar la lista no consume la despensa. Al pasar compras marcadas a la despensa, se suman sus cantidades.
- Los precios solo cubren algunos ingredientes. Se muestran como **subtotales orientativos incompletos**, nunca como costo total ni precios actuales.

## Reconocimiento de imágenes

1. Se comprueba tipo y tamaño del archivo y se normaliza a JPEG de hasta 1400 px de lado mayor.
2. La IA clasifica la escena y propone solo alimentos claramente visibles, con evidencia visual y confianza alta.
3. Una segunda consulta debe confirmar cada candidato; puede devolver una lista vacía.
4. Siempre se muestra la foto y una lista editable. El usuario confirma los nombres y escribe cantidades reales antes de guardar. Nunca se infiere peso a partir de una foto.

Hay reglas explícitas para no confundir un mouse, botones, ruedas o cables con una papa. **No se garantiza reconocimiento perfecto**: dos consultas al mismo modelo pueden compartir errores y la confianza declarada no es una probabilidad calibrada.

Las fotos se mantienen en el navegador, se envían al servidor y al proveedor de IA al analizar, y no se guardan como archivos en el servidor.

## Privacidad

Todo lo que se envía y lo que se guarda está explicado en `/privacidad.html`, que es la página que pide la Play Store. Antes de publicar, pon tu correo real en `CONTACT_EMAIL`.

## Recetas e imágenes

101 recetas con cantidades para 2 personas y pasos; el número de porciones escala los ingredientes. Las que necesitan remojo o refrigeración lo indican. **No se han cocinado ni validado nutricionalmente.**

Las imágenes de plato son ilustraciones generadas por categoría, no fotos de cada receta. Si colocas `assets/food-grid.webp`, nueve recetas concretas usan esa foto; si el archivo no existe, la app usa las ilustraciones automáticamente. Cuando cocinas un plato, tu propia foto pasa a ser su imagen.

## Datos del usuario y respaldo

Se conserva la clave local `qch2`, por lo que se mantienen despensa, favoritos, avatar, recetas propias y planificación **si abres la nueva versión en el mismo origen y navegador**. Cambiar dominio, puerto o navegador no traslada el almacenamiento.

En ⚙️ Ajustes hay tres botones: **Exportar mis datos** (descarga un JSON), **Restaurar una copia** (lee ese JSON y reemplaza lo actual) y **Borrar todos mis datos** (pide doble confirmación).

## Pruebas

```
npm test
```

24 pruebas deterministas: cantidades, identidad de ingredientes, unidades, acumulación de existencias, compras del plan, rutas públicas y privadas, CSP con hash, robots y sitemap, validación de entradas, descarte de ids de receta inventados, filtros de objetos no comestibles, veto de la segunda revisión visual, rechazo de fotos de pantalla, errores del proveedor sin filtrar la clave y límite de consultas.

Las respuestas del proveedor se simulan. No cuentan como validación real de la IA: para eso está `npm run diagnostico`.

Consulta `VALIDACION.md` para el alcance verificado y las limitaciones.
