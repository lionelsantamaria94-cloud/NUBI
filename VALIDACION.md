# Validación de la versión 3

Fecha: 16 de octubre de 2026.

## Comprobado

- **9 pruebas automáticas de lógica y servidor aprobadas** (`npm test`), usando Node.js 24.
- Arranque y navegación en Chromium sin errores de JavaScript capturados.
- Revisión visual del inicio en escritorio (1366 × 1000), móvil (390 × 844) y ventana de chat. Sin desbordamiento horizontal de la página a 390 px.
- Entrada de `1,5 kg papa`, `200 gramos arroz` y `1 litro leche`; unidades, alias y cantidades desconocidas.
- Catálogo de 101 recetas con identificadores únicos; 91 nuevas con cantidades y al menos tres pasos.
- Paginación de 24 a 48 tarjetas, búsqueda por nombre y apertura de receta.
- Generación repetida de compras para un plan con dos recetas, sin duplicar la lista generada.
- Suma de necesidades del plan antes de descontar la despensa; cantidades de unidades incompatibles no se consideran suficientes.
- Formulario de revisión de foto: exige cantidades y confirmación; acepta una corrección manual y guarda las existencias. En esta prueba se simuló la respuesta de reconocimiento.
- Chat contextual sobre una receta y manejo explícito de IA no configurada, con orientación local identificada como tal.
- Persistencia tras recarga, cambio de tema y conservación de datos anteriores mediante una prueba DOM con despensa, favoritos y notas precargados.
- Pruebas de servidor con respuestas simuladas: filtros de objetos no comestibles, confianza baja y veto en la segunda revisión; límites de entradas, acceso a archivos públicos y bloqueo de archivos privados.

## Aún requiere verificación externa

- Calidad real de Gemini, validez de la clave, modelo habilitado, cuotas y latencia. No hubo una clave configurada en el entorno de trabajo.
- La foto concreta del mouse que fue confundido con una papa. No se adjuntó esa foto. Los filtros y la doble revisión reducen el riesgo; no garantizan cero errores.
- Cámara, permisos y selector de archivos del proyecto real de App Inventor/Android. No se dispone de su archivo .aia ni de un dispositivo Android aquí.
- Publicación en Render, instalación como PWA en los dispositivos finales y funcionamiento tras cambios futuros del proveedor de IA.
- Preparación culinaria de las 101 recetas y validación nutricional. Las imágenes son ilustrativas por categoría, no fotografías exactas de cada receta.

## Qué se entrega

Código fuente y recursos completos, pruebas deterministas, configuración de ejemplo, instrucciones para Node/Render/App Inventor y lanzador Windows. No se publicó un servicio externo, no se generó un APK y no se incluyeron claves privadas.
