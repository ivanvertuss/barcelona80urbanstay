# Plan de unificación Urban Stay Guide — Barcelona 80 Urban Stay

Rama de trabajo: `feature/urban-stay-guide-unified`. No modificar `main` ni el dominio publicado hasta validar.

## Principio
Conservar diseño, imágenes, contenidos propios, navegación y experiencia de Barcelona 80 Urban Stay. Incorporar módulos compartidos de Urban Stay Guide sin duplicar lógica ni sustituir el contenido editorial existente.

## Módulos comunes
1. Selector de idiomas ES / EN / FR / PT / DE, incluyendo textos editoriales y estados dinámicos.
2. Agenda para Vigo: fuentes oficiales, Ticketmaster y eventos autorizados del propietario; fechas y enlaces verificados.
3. Colaboradores del alojamiento y acuerdos Urban Stay aplicables por ciudad/región/país.
4. Promociones activas y vigentes, expresamente aprobadas para mostrar a huéspedes.
5. Experiencia móvil, accesibilidad, instalación PWA y actualización segura.

## Seguridad
No utilizar `service_role` ni consultar tablas privadas desde el navegador. El endpoint público debe exigir autorización editorial explícita por elemento, además de publicación aprobada de la propiedad. No mostrar datos de otras propiedades. La Edge Function actual `guest-guide-public` es una preparación para El Almendro, **no** debe reutilizarse como endpoint público sin revisión.

## Validación antes de publicar
- Comparación visual con la página actual.
- Cambio de idioma en escritorio y móvil.
- Aislamiento por propiedad y ámbito geográfico.
- Fechas y estado de agenda/ofertas; retirada de publicaciones.
- Comprobación de PWA y navegación sin errores.
- Publicación solo tras revisión de la vista de prueba.
