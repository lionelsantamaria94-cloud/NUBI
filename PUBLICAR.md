# Publicar Nubi en internet, en Google y como APK

La app ya está preparada: título y descripción para Google, `robots.txt`, `sitemap.xml`, imagen para compartir, íconos, manifiesto instalable, botón «Instalar» y botón «Descargar APK» en ⚙️ Ajustes.
Tú solo tienes que crear las cuentas y subir los archivos. Son gratis, salvo la Play Store (opcional).

---

## Paso 1 · Subir el código a GitHub

1. Crea una cuenta en https://github.com y toca **New repository**. Ponle de nombre `nubi`.
2. Toca **uploading an existing file** y arrastra **todo el contenido** de tu carpeta `hoy`, incluidas las carpetas `assets`, `tests` y `descargas`.
3. **No subas el archivo `.env`.** Ahí está tu clave secreta. El `.gitignore` ya lo excluye si usas Git, pero si arrastras archivos a mano, sácalo tú.
4. Toca **Commit changes**.

## Paso 2 · Publicarla en Render (tu enlace público)

1. Entra a https://render.com con tu cuenta de GitHub.
2. Toca **New → Blueprint** y elige tu repositorio `nubi`. Render leerá el archivo `render.yaml` y lo configurará solo.
3. Cuando te lo pida, completa estas variables:
   - `GEMINI_API_KEY`: tu clave **nueva** de Google AI Studio.
   - `SITE_URL`: déjala vacía por ahora y complétala cuando sepas tu enlace, por ejemplo `https://nubi.onrender.com`.
4. Espera a que diga **Live**. Tu app estará en `https://nubi.onrender.com`, o en el nombre que Render te asigne.
5. Ve a **Environment**, completa `SITE_URL` con ese enlace y guarda. Render se reinicia solo.

> En el plan gratis, Render "duerme" la app tras unos minutos sin visitas. La primera visita después tarda unos 50 segundos en despertarla.

## Paso 3 · Que aparezca en Google

1. Entra a https://search.google.com/search-console y toca **Agregar propiedad → Prefijo de URL**. Escribe tu enlace de Render.
2. Elige el método **Etiqueta HTML**. Google te mostrará algo como `<meta name="google-site-verification" content="AbC123...">`.
3. Copia **solo el código** que va entre las comillas de `content` y pégalo en Render → Environment, en la variable `GOOGLE_SITE_VERIFICATION`. Guarda y espera a que se reinicie.
4. Vuelve a Search Console y toca **Verificar**.
5. En el menú **Sitemaps**, escribe `sitemap.xml` y toca **Enviar**.
6. En **Inspección de URLs**, pega tu enlace y toca **Solicitar indexación**.

**Cuánto tarda:** Google suele indexar un sitio nuevo en unos días, a veces 1 o 2 semanas.

**Expectativa honesta:** "Nubi" o "Nubia" solos son palabras que usan muchos otros sitios. Una web recién creada no saldrá primera solo con esa palabra. Lo que sí funcionará pronto es buscar **"Nubi qué cocino hoy"**, **"Nubi recetas peruanas"** o el nombre de tu enlace. Para subir posiciones:
- Comparte el enlace: redes sociales, la web del colegio, tu presentación del IB. Cada enlace desde otro sitio ayuda.
- Un dominio propio, como `nubicocina.com` (de pago, unos 10–15 USD al año), ayuda mucho. Se conecta en Render → Settings → Custom Domains. Luego cambia `SITE_URL` por ese dominio.

## Paso 4 · Crear el APK para Android (con PWABuilder, gratis)

1. Entra a https://www.pwabuilder.com y pega tu enlace de Render. Toca **Start**.
2. Toca **Package for stores → Android → Generate Package**. En las opciones:
   - **Package ID**: por ejemplo `com.nubi.cocina`. Escríbelo en minúsculas, sin espacios y no lo cambies nunca.
   - **App name**: `Nubi`.
3. Descargarás un `.zip` con estos archivos:
   - Un archivo **`.apk`**: es el que se instala directo en los celulares.
   - Un archivo **`.aab`**: solo sirve si algún día la subes a la Play Store.
   - **`assetlinks.json`**: hace que la app se abra sin la barra del navegador.
   - **`signing.keystore`** y **`signing-key-info.txt`**: tu llave de firma. **Guárdalos en un lugar seguro.** Sin ellos no podrás actualizar la app nunca más.
4. Copia `assetlinks.json` a la carpeta principal de tu app, junto a `server.js`.
5. Renombra el `.apk` a **`nubi.apk`** y ponlo dentro de la carpeta **`descargas`**.
6. Sube esos dos archivos a tu repositorio de GitHub. Render se actualizará solo.
7. Listo: en tu app, en **⚙️ Ajustes**, aparecerá el botón **⬇️ Descargar APK para Android**. Cualquiera puede descargarlo e instalarlo.

**Al instalar el APK**, Android pedirá permitir **"Instalar apps de origen desconocido"**. Es normal en apps que no vienen de la Play Store.

**Play Store (opcional):** subes el `.aab` en https://play.google.com/console. Requiere un pago único de 25 USD y ser mayor de edad; si eres menor, debe usar la cuenta de un padre o tutor. Google revisa la app antes de publicarla, lo que puede tardar varios días.

> **¿Por qué PWABuilder y no App Inventor?** El WebViewer de App Inventor no siempre deja abrir la cámara para elegir archivos, y el modo cocina necesita la cámara para la foto del plato. El APK de PWABuilder usa Chrome por dentro, así que la cámara, el sonido y la instalación funcionan igual que en el navegador.

---

## Seguridad antes de abrirla al público

- Usa una clave de Gemini **nueva**, solo en Render, nunca en el código.
- Cada visitante tiene un límite de 15 consultas de IA por minuto. Aun así, todo el uso sale de tu cuota de Gemini: si mucha gente la usa, revisa el consumo en Google AI Studio.
- Los datos de cada persona (despensa, nivel, fotos) se guardan en su propio teléfono o navegador, no en tu servidor.
