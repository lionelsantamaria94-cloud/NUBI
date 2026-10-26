# Publicar Nubi en internet y en la Play Store

Esta guía va paso a paso. La parte de internet es gratis. La Play Store cuesta 25 dólares una sola vez.

Orden obligatorio: **primero la web, después el APK/AAB**. La app de Android es una envoltura de tu web, así que si la web no está en línea, la app no funciona.

---

## Paso 1 · Poner la app en internet

Necesitas un hosting que ejecute Node.js. Un hosting normal de páginas (cPanel con PHP) no sirve para esto, porque Nubi tiene un servidor propio que habla con Gemini.

Opciones gratis o baratas: **Render**, **Railway** o **Fly.io**.

Con Render, que ya traes configurado:

1. Sube la carpeta completa de Nubi a tu repositorio, como haces normalmente. **Sin el archivo `.env`**: ahí está tu clave. El `.gitignore` ya lo excluye.
2. En Render toca **New → Blueprint** y elige ese repositorio. Render lee `render.yaml` y se configura solo.
3. Completa las variables que te pide:

| Variable | Qué poner |
|---|---|
| `GEMINI_API_KEY` | Tu clave **nueva** de Google AI Studio |
| `SITE_URL` | Déjala vacía ahora; la llenas en el punto 5 |
| `CONTACT_EMAIL` | El correo que aparecerá en privacidad y términos |
| `GOOGLE_SITE_VERIFICATION` | Vacía por ahora (paso 3) |

4. Espera a que diga **Live**. Tu enlace será algo como `https://nubi.onrender.com`.
5. Vuelve a **Environment** y escribe ese enlace en `SITE_URL`, sin barra al final. Guarda; se reinicia solo.
6. Abre `https://tu-enlace/api/health`. Debe responder `"aiConfigured": true`. Si dice `false`, la clave no quedó guardada.

> En el plan gratis de Render la app se duerme tras unos minutos sin visitas, y la siguiente visita tarda casi un minuto en despertarla. Para la Play Store conviene el plan de pago más barato, o Railway, porque Google revisa la app y una app dormida puede parecer rota.

### Comprobar que la IA responde de verdad

En tu computadora, con el archivo `.env` configurado:

```
npm run diagnostico
```

Si sale ✓, el chat y las fotos funcionan. Si sale ✗, el mensaje te dice exactamente qué revisar.

---

## Paso 2 · Un dominio propio (recomendado antes de la Play Store)

Un dominio como `nubicocina.com` cuesta unos 10 a 15 dólares al año y da mucha más confianza en la ficha de Play. Se conecta en Render → **Settings → Custom Domains**. Después cambia `SITE_URL` por ese dominio y vuelve a generar el APK.

Hazlo **antes** de generar el paquete de Android: el enlace queda grabado dentro de la app y cambiarlo después obliga a publicar otra versión.

---

## Paso 3 · Que aparezca en Google

1. Entra a <https://search.google.com/search-console> → **Agregar propiedad → Prefijo de URL** y escribe tu enlace.
2. Elige **Etiqueta HTML**. Google te muestra algo como `<meta name="google-site-verification" content="AbC123...">`.
3. Copia **solo lo que va entre comillas** en `content` y pégalo en la variable `GOOGLE_SITE_VERIFICATION`. Guarda.
4. Vuelve a Search Console y toca **Verificar**.
5. En **Sitemaps** escribe `sitemap.xml` y envía.
6. En **Inspección de URLs** pega tu enlace y toca **Solicitar indexación**.

Google suele tardar de unos días a dos semanas. Buscar "Nubi" a secas no te pondrá primero, porque esa palabra la usan muchos sitios. Lo que sí funciona pronto: "Nubi qué cocino hoy", "Nubi recetas peruanas".

---

## Paso 4 · Generar el paquete de Android

Se usa PWABuilder, que es gratis y convierte tu web en una app nativa real (TWA).

1. Entra a <https://www.pwabuilder.com>, pega tu enlace y toca **Start**. Debe darte buena puntuación; si marca algo en rojo, avísame antes de seguir.
2. **Package for stores → Android → Generate Package**:
   - **Package ID**: por ejemplo `com.nubi.cocina`. Minúsculas, sin espacios, y **jamás lo cambies**: es la identidad de tu app para siempre.
   - **App name**: `Nubi`
   - **Short name**: `Nubi`
   - Deja marcada la opción de **signing key: generar una nueva**.
3. Descargas un `.zip` con:
   - `.aab` → **este es el que sube a la Play Store**
   - `.apk` → para instalar a mano en celulares, fuera de la tienda
   - `assetlinks.json` → hace que la app abra sin barra de navegador
   - `signing.keystore` + `signing-key-info.txt` → **tu llave de firma**

> ⚠️ Guarda `signing.keystore` y `signing-key-info.txt` en dos lugares seguros (por ejemplo, tu disco y tu nube personal). Si los pierdes **no podrás actualizar nunca más la app** y tendrías que publicar una app nueva desde cero.

4. Copia `assetlinks.json` a la carpeta principal de Nubi, al lado de `server.js`, y vuelve a publicar. Compruébalo abriendo `https://tu-enlace/.well-known/assetlinks.json`.
5. Si quieres ofrecer el APK desde tu web: renombra el `.apk` a `nubi.apk` y ponlo en la carpeta `descargas`. El botón aparece solo en ⚙️ Ajustes.

---

## Paso 5 · Lo que la Play Store te va a pedir

Crea la cuenta en <https://play.google.com/console> (pago único de 25 USD, mayor de edad, verificación de identidad con documento; puede tardar días).

Ten esto listo antes de empezar la ficha:

| Lo que piden | Dónde está / qué responder |
|---|---|
| Política de privacidad (URL pública) | `https://tu-enlace/privacidad.html` |
| Correo de contacto | El mismo de `CONTACT_EMAIL` |
| Ícono 512 × 512 | `assets/icon-512.png` |
| Gráfico de función 1024 × 500 | `assets/feature-graphic.png` |
| Capturas de pantalla (mínimo 2, teléfono) | Tómalas tú desde el celular: inicio, despensa, lista de platos, receta y modo cocina |
| Descripción corta (80 caracteres) | *Recetas caseras paso a paso, con despensa y asistente de cocina.* |
| Descripción larga | Está abajo, lista para copiar |
| Categoría | Comida y bebida |
| Clasificación de contenido | Cuestionario: sin violencia, sin sexo, sin apuestas, sin alcohol. Sale "Para todos" |
| Público objetivo | 13 años o más (si eliges público infantil, las reglas son mucho más estrictas) |
| Anuncios | **No** contiene anuncios |
| App de salud / finanzas | No |

### Formulario de seguridad de los datos (Data safety)

Este es el que más gente falla. Responde así, que es lo que de verdad hace la app:

- **¿Recoges o compartes datos de usuario?** Sí, se recogen pero no se comparten con terceros para publicidad.
- **Fotos:** se recogen; se **procesan de forma efímera** para identificar ingredientes y verificar el plato; no se almacenan en el servidor; es **opcional**.
- **Texto que escribe el usuario (mensajes del chat):** se procesa de forma efímera para generar la respuesta; opcional.
- **Identificadores, contactos, ubicación, salud, finanzas, archivos:** no se recogen.
- **¿Los datos están cifrados en tránsito?** Sí (HTTPS).
- **¿El usuario puede pedir que se borren sus datos?** Sí: la app tiene **⚙️ Ajustes → Borrar todos mis datos**, y los datos viven en su dispositivo.

### Descripción larga lista para copiar

```
Nubi es tu compañera de cocina. Te dice qué cocinar con lo que ya tienes en casa.

• Despensa inteligente: escribe "1,5 kg papa" o "2 huevos" y Nubi calcula qué recetas te alcanzan.
• 101 recetas caseras peruanas e internacionales, con cantidades reales y pasos claros.
• Modo cocina paso a paso: un paso por pantalla, temporizador automático y ánimos de Nubi.
• Gana experiencia, sube de nivel y mantén tu racha de días cocinando.
• Tu diario: la foto de cada plato que cocinas, con tus estrellas y cómo te sentiste.
• Lista de compras automática con lo que te falta.
• Asistente con inteligencia artificial para adaptar recetas a tu tiempo, tu presupuesto y lo que tienes.

Sin cuentas ni contraseñas. Tus datos se guardan en tu propio teléfono.

Aviso: las recetas son orientativas. Revisa siempre la cocción de carnes y huevos y las etiquetas si tienes alergias.
```

---

## Paso 6 · Subir y esperar

1. En Play Console: **Crear aplicación** → nombre `Nubi`, español, gratuita.
2. Completa ficha, clasificación y seguridad de datos (paso 5).
3. **Pruebas → Prueba interna**: sube el `.aab` ahí primero y pruébalo tú en tu celular. No vayas directo a producción.
4. Cuando funcione, promuévelo a **Producción**.
5. Google revisa la app. La primera revisión suele tardar varios días y puede pedir correcciones.

### Por qué suelen rechazar apps como esta

- La web está caída o dormida cuando Google la revisa.
- La URL de privacidad no abre o no menciona el uso de la cámara.
- El formulario de seguridad de datos no coincide con lo que la app hace.
- La app es "solo una página web sin valor añadido". Nubi tiene modo cocina, niveles, despensa offline e instalación, así que cumple, pero conviene que las capturas lo muestren.

---

## Seguridad antes de abrirla al público

- Usa una clave de Gemini **nueva**, solo en las variables del hosting, nunca dentro del código.
- Cada visitante tiene un límite de 15 consultas por minuto y 120 por día. Puedes bajarlo con `RATE_PER_MIN` y `RATE_PER_DAY`.
- Aun así, todo el uso sale de tu cuota de Gemini. Si la app se vuelve popular, revisa el consumo en Google AI Studio y considera poner un tope de gasto.
- Los datos de cada persona se quedan en su teléfono, no en tu servidor.
