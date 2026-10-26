# Validación de la versión 4.0.0

Fecha: 26 de octubre de 2026. Entorno de trabajo: Node.js 22, sin clave de Gemini configurada.

## Comprobado en esta entrega

- **24 pruebas automáticas aprobadas** (`npm test`): lógica de cantidades y unidades, identidad de ingredientes, acumulación de existencias, suma del plan antes de descontar la despensa, rutas públicas y privadas, CSP con hash de los scripts en línea, robots y sitemap, validación de entradas del chat y de recetas, descarte de ids de receta inventados, filtro de objetos no comestibles, veto de la segunda revisión visual, rechazo de fotos de pantalla, errores del proveedor sin exponer la clave y límite de consultas por minuto.
- El servidor arranca y responde 200 en `/`, `/app.js`, `/core.js`, `/catalog.js`, `/styles.css`, `/base.css`, `/legal.css`, `/manifest.webmanifest`, `/sw.js`, `/favicon.ico`, `/privacidad.html`, `/terminos.html`, `/offline.html`, `/robots.txt`, `/sitemap.xml`, `/api/health` y los iconos de `assets/`.
- Responde 404 en `/server.js`, `/.env`, `/package.json`, `/tests/...` y en intentos de salir de la carpeta.
- Los marcadores `%SITE_URL%`, `%CONTACT_EMAIL%` y `%UPDATED%` se sustituyen al servir las páginas HTML. No quedan visibles para el usuario.
- La cabecera CSP incluye un hash por cada script en línea del HTML, sin `unsafe-inline` en `script-src`.
- Revisión estática cruzada entre `index.html` y `app.js`: todos los identificadores de elementos usados existen, y todas las acciones `data-a` y `data-c` tienen su caso correspondiente. No quedan acciones huérfanas.
- Sintaxis verificada en `server.js`, `app.js`, `core.js` y `catalog.js`.
- Los iconos se generaron a 192, 512 y maskable 512, más `apple-touch-icon` 180, `favicon.ico` y las imágenes 1200 × 630 y 1024 × 500.

## Aún requiere verificación tuya

- **Calidad real de Gemini**: validez de la clave, modelo habilitado en tu cuenta, cuotas y latencia. No había clave en el entorno de trabajo. Ejecuta `npm run diagnostico` en tu computadora; ese comando sí hace una consulta real.
- **La clave que venía en el archivo `.env` quedó expuesta en el chat. Revócala en Google AI Studio y crea una nueva.** No se incluyó ninguna clave en este paquete.
- **La foto concreta del mouse confundido con una papa.** No se adjuntó. Los filtros y la doble revisión reducen el riesgo, no lo eliminan.
- Comportamiento en dispositivos reales: instalación como PWA, permisos de cámara en Android y iOS, y funcionamiento del APK generado con PWABuilder. Aquí no hay navegador ni teléfono.
- Publicación en el hosting, verificación en Search Console y revisión de la Play Store.
- Preparación culinaria de las 101 recetas y validación nutricional. Las imágenes siguen siendo ilustrativas por categoría.

## Limitaciones que siguen vigentes

- El límite de consultas vive en la memoria del proceso. Detrás de un proxy puede agrupar a varios usuarios bajo la misma IP, y si el hosting levanta más de un proceso, cada uno cuenta por separado. No es un control de gasto completo: el tope real lo pones en Google AI Studio.
- Sin cuentas ni nube: los datos viven en un solo dispositivo. Cambiar de teléfono o de navegador no los traslada; para eso están Exportar y Restaurar.
- `assets/food-grid.webp` no se incluye. La app detecta su ausencia y usa ilustraciones por categoría, sin errores visibles.
- El archivo `assetlinks.json` lo genera PWABuilder al empaquetar. Hasta que lo copies, `/.well-known/assetlinks.json` responde 404 y la app de Android mostraría la barra del navegador.

## Qué se entrega

Código fuente completo, iconos e imágenes de tienda, páginas legales, pruebas automáticas, diagnóstico de IA, configuración de ejemplo, guía de publicación y lanzador para Windows. No se publicó ningún servicio, no se generó un APK y no se incluyó ninguna clave.
