# ¿Qué cocino hoy? · versión 3 con Nubi

Aplicación web adaptable a celular y computadora. Incluye **101 recetas**, despensa, cámara/galería, favoritos, recetas propias, planificación, compras y asistente conversacional. Predomina la cocina peruana, con opciones internacionales. Los datos se guardan en el navegador del usuario; no hay cuentas ni sincronización en la nube.

## Empezar en tu computadora

1. Descomprime **todo** el paquete en una carpeta. No basta con reemplazar index.html: ahora usa app.js, core.js, catalog.js, styles.css y assets.
2. Instala Node.js 22.9 o posterior (recomendado Node 24).
3. Abre una terminal en esa carpeta y ejecuta `npm start`. No se necesitan dependencias externas ni `npm install` para ejecutar.
4. Abre `http://localhost:3000` en tu navegador. En Windows puedes usar INICIAR_WINDOWS.bat una vez instalado Node.
5. La despensa, el catálogo, los favoritos, las compras y Nubi visual funcionan sin una clave. Para conversar con IA, sugerir recetas y reconocer fotos, configura el paso siguiente.

## Activar IA real

Copia `.env.example` como `.env` y configura `GEMINI_API_KEY` con una clave de tu cuenta de Google AI Studio. No la pongas en HTML/JavaScript del navegador ni la compartas en un chat. Reinicia el servidor.

El modelo se configura con `MODEL`; por defecto es `gemini-3.8-flash`. Usa un modelo disponible en tu cuenta que soporte visión y JSON Schema. Disponibilidad, límites y facturación dependen del proveedor y tu cuenta. `/api/health` indica si existe una clave, pero eso no demuestra que sea válida: realiza una consulta de prueba.

La integración usa generateContent y respuestas estructuradas. Referencias oficiales consultadas:
- https://ai.google.dev/gemini-api/docs/generate-content/structured-output
- https://ai.google.dev/gemini-api/docs/generate-content/image-understanding

Si falta la clave o la conexión falla, el chat lo comunica y ofrece una **orientación local identificada como sin IA**. No inventa una respuesta del servicio ni finge reconocer una imagen.

## Publicar en tu servidor o Render

Sube la carpeta completa a tu repositorio. Configura Node 24, inicio `npm start` y `GEMINI_API_KEY` en las variables privadas del servicio. Render proporciona PORT automáticamente. Puedes dejar vacío el comando de compilación si tu plataforma lo permite; no hay dependencias por instalar.

El navegador consulta el mismo origen que sirve la app, de modo que index.html y prueba.html ya no apuntan a servidores diferentes. El servidor solo publica una lista explícita de archivos públicos: no expone server.js ni .env.

La app no se publicó ni se cambió tu servicio de Render durante esta entrega. Antes de abrirla a tráfico público amplio, añade autenticación, cuota por usuario y limitación distribuida en tu plataforma: el límite incluido es de 15 peticiones por IP y minuto, en memoria y por proceso; detrás de un proxy puede agrupar usuarios. No es un control de gasto completo.

## App Inventor y Android

En WebViewer usa la **URL HTTPS de tu app** como HomeUrl. Se conserva el nombre enviado con AppInventor.getWebViewString(). No pongas el HTML aislado en assets: esta versión necesita sus archivos y el servidor para la IA.

El selector nativo permite cámara y galería según navegador/WebView. Los permisos y la integración de archivos del WebViewer dependen de tu proyecto Android y deben probarse en el dispositivo. Esta entrega es código web, no un APK compilado. El manifiesto y service worker permiten uso como web app y caché del catálogo; la instalación depende del navegador y HTTPS.

## Despensa y compras corregidas

- `1,5 kg papa` equivale a 1500 g. Se admiten gramos, kilogramos, litros, mililitros, unidades y fracciones simples como `1/2 kg papa`.
- Separa ingredientes con coma y espacio, punto y coma o salto de línea. La coma entre dígitos es decimal.
- Sin cantidad, el ingrediente queda pendiente de confirmar; nunca se da por suficiente.
- No se inventan conversiones entre gramos, mililitros y piezas. Pesa las piezas si la receta exige gramos.
- Cebolla y cebolla china, arroz seco y cocido, leche y leche de coco son ingredientes distintos.
- Agregar más cantidad del mismo ingrediente y unidad suma existencias. Para corregir un registro, elimínalo y vuelve a introducirlo.
- La lista del plan suma todas las recetas antes de descontar existencias. Regenerarla reemplaza ese cálculo, sin volver a sumar. Conserva el marcado si el artículo y la cantidad no cambiaron. Las listas de recetas individuales y los artículos manuales son independientes y aparecen identificados por origen; si usas ambos, revisa solapamientos.
- Generar la lista no consume la despensa. Al pasar compras marcadas a la despensa, se suman sus cantidades. El plan es una previsión, no un registro automático de consumos.
- Los precios originales solo cubren algunos ingredientes. Se muestran como **subtotales orientativos incompletos**, no como costo total ni precios actuales. El filtro económico limita ese subtotal; no garantiza un presupuesto final. Se retiraron las puntuaciones de salud y calorías no sustentadas.

## Reconocimiento de imágenes

1. Se comprueba tipo y tamaño del archivo y se normaliza a JPEG de hasta 1400 px de lado mayor.
2. La IA clasifica la escena y propone solo alimentos claramente visibles, con evidencia visual y confianza alta.
3. Se filtran objetos no comestibles y respuestas ambiguas. Una segunda consulta visual debe confirmar cada candidato; puede devolver una lista vacía.
4. Siempre se muestra la foto y una lista editable. El usuario confirma los nombres y escribe cantidades reales antes de guardar. Nunca se infiere peso a partir de una foto.

Se incluyen reglas explícitas para no confundir un mouse, botones, ruedas o cables con una papa. **No se garantiza reconocimiento perfecto**: dos consultas al mismo modelo pueden compartir errores; la confianza declarada no es una probabilidad calibrada. La doble revisión aumenta las llamadas y la latencia. No se ha probado la foto real del mouse porque no se adjuntó a esta solicitud; tampoco se ejecutó visión real sin una clave.

Las fotos se mantienen temporalmente en el navegador, se envían al servidor y al proveedor de IA al analizar, y no se guardan como archivos por esta app. El chat envía tu consulta, hasta ocho mensajes previos, la receta, la despensa y las preferencias. No escribas datos que no quieras enviar al proveedor. Este servidor no registra cuerpos de solicitudes, fotos ni claves.

## Nubi

Fantasmita SVG animada, con preferencia para pausar los ánimos y respeto a “reducir movimiento”. El chat puede recibir receta, número de personas, tiempo disponible, presupuesto y restricciones. Propone adaptaciones; no modifica automáticamente ingredientes ni recetas. Los mensajes se muestran como texto, no HTML ejecutable.

## Recetas e imágenes

Son 10 recetas originales revisadas y 91 nuevas con cantidades para 2 personas y pasos. El número de porciones escala ingredientes. Las preparaciones que necesitan remojo o refrigeración lo indican en sus pasos; revisa todo antes de cocinar. No se han cocinado ni validado nutricionalmente las 101 recetas.

Las imágenes son ilustraciones gastronómicas creadas con IA, compartidas por nueve categorías. No son 101 fotos de platos específicos. El mosaico se generó con la herramienta de imágenes integrada y se convirtió a WebP (aprox. 442 KB) sin cambiar su contenido. La fantasmita es vectorial y conserva nitidez a cualquier tamaño.

Prompt del asset: composición fotográfica gastronómica 3×3, sin texto ni separadores, nueve celdas iguales sobre piedra crema; lomo saltado, arroz con pollo, pasta de tomate, sopa de verduras, ensalada de quinua, pollo al horno, panqueques, arroz con leche y lentejas con verduras. Fotografía editorial cenital, luz natural y textura realista.

## Datos anteriores y respaldo

Se conserva la clave local `qch2` y los identificadores b1–b10, por lo que se mantienen despensa, favoritos, avatar, recetas propias y planificación **si abres la nueva versión en el mismo origen y navegador**. Antes de la primera modificación, se crea `qch2-before-v3` como respaldo local. Cambiar dominio, puerto, navegador o reinstalar/borrar datos no traslada automáticamente el almacenamiento.

El botón “Exportar mis datos” descarga un JSON. No hay importador automático en esta versión. Para recuperar un respaldo en el mismo navegador, un desarrollador puede restaurar qch2 desde la copia, después de exportar el estado actual. Revisa cantidades que la versión anterior ya hubiera guardado mal: no siempre es posible reconstruir lo que se quiso escribir.

## Pruebas

Ejecuta `npm test`: pruebas deterministas de cantidades, identidad, unidades, acumulación de existencias, compras del plan, catálogo, validación HTTP, objetos no alimentarios y veto en la segunda revisión visual. Las respuestas del proveedor se simulan en las pruebas de servidor; no se contabilizan como validación real de IA.

Consulta VALIDACION.md dentro del paquete para el alcance final verificado y las limitaciones.

## Versión 3.1 · Nubi interactiva

- **Arreglo del "sin respuesta"**: antes cada intento a Gemini se cortaba a los 15 s (35 s en total), y un modelo "flash" que razona con el catálogo y el contexto puede tardar más. Ahora cada intento tiene hasta 45 s (70 s en total), se pide razonamiento `low` para responder más rápido y no se repite el mismo modelo cuando se agota el tiempo. Ajustables en `.env`: `AI_ATTEMPT_MS`, `AI_DEADLINE_MS`, `THINKING_LEVEL` (`low`, `medium`, `high` u `off`).
- **Nubi conoce las 101 recetas**: recomienda platos reales de la app y muestra botones para abrirlos (los ids inventados se descartan).
- **Botones de acción**: abrir receta, buscar platos, agregar a la lista de compras o a la despensa. Siempre piden confirmación antes de cambiar algo.
- **Sugerencias de seguimiento**: después de cada respuesta aparecen 2–3 preguntas para continuar con un toque.
- Indicador de escritura, botón **Reintentar** si falla, **↺ Nueva conversación**, y Enter para enviar (Shift+Enter = salto de línea).

## Versión 3.2 · Chef con niveles y modo cocina

- **Imágenes correctas**: la foto real solo se usa en los 9 platos que aparecen en ella (lomo saltado, arroz con pollo, tallarines/pasta de tomate, sopa de verduras, ensalada de quinua, pollo al horno, panqueques, arroz con leche y lentejas). El resto muestra una ilustración propia del plato. Cuando cocinas un plato, **tu foto** pasa a ser su imagen.
- **Modo cocina estilo Duolingo**: «▶ Iniciar receta» abre una pantalla completa: lista de ingredientes para marcar, un paso por pantalla con barra de progreso, botón «Listo, siguiente paso», temporizador automático cuando el paso indica minutos y ánimos de Nubi.
- **Foto verificada por IA**: al terminar, abres la cámara; el servidor (`/verificar-plato`) pregunta a Gemini si la foto es comida real, no una pantalla, y si coincide con la receta. Se rechazan fotos repetidas.
- **Reflexión**: antes de reclamar la XP indicas qué te pareció (1–5 estrellas) y cómo te sentiste.
- **XP por plato**: base por dificultad (Fácil 45, Media 70) + mitad de los minutos (máx. 90) + 5 por paso, redondeado a 5. La primera vez de cada plato da +50 % de bonus. Repetir el mismo plato el mismo día no suma XP.
- **Niveles**: para subir del nivel N al N+1 se necesitan `80 × 1,3^(N−1) + 20 × (N−1)` XP (redondeado a 10): 80, 120, 180, 240, 310, 400… cada nivel cuesta más. Títulos: Aprendiz, Ayudante de cocina (3), Cocinero casero (5), Chef de partida (8), Sous chef (12), Chef ejecutivo (16), Gran chef (20), Leyenda de la cocina (30).
- **Racha 🔥** de días seguidos cocinando y **Mi diario** (en Mi cocina) con tus fotos, estrellas y emociones. Si la IA no está disponible, puedes guardar el plato y verificarlo después.
- Todo se guarda en el navegador (`qch2`). Se conservan solo las últimas 25 fotos para no llenar el almacenamiento.

## Versión 3.3 · Publicación

Lista para Google (SEO, robots.txt, sitemap.xml, imagen para compartir) y para instalar como app o APK. Sigue **PUBLICAR.md** paso a paso. Nuevas variables: `SITE_URL`, `GOOGLE_SITE_VERIFICATION`, `TRUST_PROXY` (ver `.env.example`).
