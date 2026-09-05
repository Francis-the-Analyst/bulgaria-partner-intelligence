# Prompt — Identificación de puntos de venta retail y proyectos en Bulgaria

## GESTIÓN DE SESIÓN Y CHECKPOINTS (leer antes de empezar)

Si durante la ejecución de esta tarea alcanzas el 95% de los tokens disponibles en la sesión actual, detente inmediatamente (no intentes terminar el bloque en curso a toda prisa) y guarda un archivo `checkpoint.md` en esta misma carpeta con:
- Todos los resultados ya recopilados hasta ese momento, en tabla completa, con todos los campos extraídos por punto de venta/actor.
- Qué ciudades, tipologías y bloques (canal retail, canal proyectos por volumen o canal proyectos turísticos) ya se han completado y cuáles quedan pendientes.
- El análisis ya elaborado hasta ese punto, si se ha empezado (segmentación, tabla de exposición física, mapa de posicionamiento, candidatos prioritarios).
- Un resumen claro de "próximos pasos" que indique exactamente por dónde continuar.

Al reanudar la tarea en una sesión posterior, léase primero `checkpoint.md` y úsese como punto de partida: no repetir búsquedas ni scrapes ya hechos, no perder el trabajo avanzado, y continuar completando únicamente lo pendiente hasta finalizar el informe completo (incluida la entrega final triplicada en inglés, búlgaro y ruso).

HERRAMIENTAS: La investigación se realiza con Firecrawl (`firecrawl search` / `firecrawl_search` para localizar puntos de venta/actores en cada ciudad, tipología e idioma de búsqueda — web, Instagram, Facebook, LinkedIn, directorios y prensa búlgara — y `firecrawl scrape` / `firecrawl_scrape` para extraer el contenido completo en markdown de cada web/perfil/artículo encontrado antes de rellenar la ficha de datos). No completes ninguna ficha solo con el snippet del buscador si el scrape consigue extraer la página; usa el snippet únicamente como último recurso cuando el scrape falle (muro de login, contenido bloqueado, etc.). Vigila el presupuesto de créditos de la cuenta (`firecrawl credit-usage`) antes de tandas grandes y evita re-scrapear URLs ya cubiertas.

---

## Prompt de ejecución

```
CONTEXTO: Soy Export Sales Manager de Cosentino (superficies premium: Silestone, Dekton, Sensa). Buscamos entrar en el canal retail y proyectos en Bulgaria, colocando muestras y materiales en exposición en puntos de venta medium-to-high end, con una estrategia de precios agresiva de entrada. Cubrimos las 4 ciudades más relevantes del país: Sofía (~1.28M hab., capital y mercado prioritario), Plovdiv (~340K), Varna (~335K) y Burgas (~200K).

Bulgaria no tiene un único macroproyecto urbano de referencia (como sí ocurre en otros mercados), sino un volumen alto de proyectos de construcción residencial, comercial, hotelera y de oficinas repartidos por el país, junto con un segmento muy característico de grandes desarrollos turísticos residenciales en la costa del Mar Negro y en las estaciones de esquí de montaña, con fuerte peso histórico de compradores e inversores rusos y de otros países de Europa del Este. Por ello, el canal proyectos se define aquí con DOS bloques complementarios:

1. CANAL PROYECTOS POR VOLUMEN: cualquier promoción, edificio u obra en Sofía, Plovdiv, Varna o Burgas cuya superficie total aplicable a las categorías de producto de Cosentino (encimeras, fachadas, suelos, revestimientos — sumando todas las aplicaciones combinadas) supere los 2.000 m². Por debajo de ese umbral, el actor/obra se trata dentro del canal retail / diseño de interiores.
2. CANAL PROYECTOS TURÍSTICO: grandes desarrollos residenciales/hoteleros en zonas turísticas de costa y montaña — Sunny Beach (Slánchev Bryag), Golden Sands (Zlatni Pyasatsi), Sozópol, Nesebar, Bansko, Pamporovo, Borovets y complejos equivalentes — con independencia de si superan o no el umbral de 2.000 m², dado su volumen agregado de unidades y su perfil de comprador international/premium.

BÚSQUEDA — CANAL RETAIL (Sofía, Plovdiv, Varna, Burgas):
Busca, para cada una de estas 4 ciudades, los siguientes tipos de punto de venta / actor, ampliando el alcance más allá de cocinas y baños:
- Estudios de cocina (kitchen studios)
- Estudios de cocina & baño combinados (kitchen & bath)
- Estudios/bureaus de diseño de interiores (interior design studios)
- Estudios de arquitectura (architecture studios / bureaus)
- Constructoras / contratistas generales (construction companies / general contractors)
- Promotoras inmobiliarias / developers (real estate developers)
- Showrooms de materiales premium (piedra, cuarzo, porcelánico, mármol)

Enfócate en el segmento medium-to-high end (no ferreterías genéricas ni distribuidores de gama baja).

BÚSQUEDA — CANAL PROYECTOS POR VOLUMEN (>2.000 m², Sofía, Plovdiv, Varna, Burgas):
Identifica actores vinculados a proyectos de gran volumen (residencial de gama alta/business class, comercial, oficinas, hotelero, retail a gran escala) en estas 4 ciudades:
- Promotoras (developers) con proyectos activos de gran volumen
- Contratistas generales / constructoras ejecutando obra de ese volumen
- Estudios de arquitectura e ingeniería que firman proyectos de esa escala
- Especificadores técnicos / consultoras de prescripción de materiales en proyecto
- Instaladores de fachadas (especialmente fachada ventilada) con capacidad para proyectos de gran superficie
- Instaladores de suelo/pavimento a nivel de obra (no solo particulares)
- Bureaus de diseño de interiores contratados para show-flats / pisos piloto / apartamentos modelo de promociones residenciales de gama alta

Si el actor o proyecto tiene un nombre identificable, indícalo; si no lo tiene, señala igualmente el proyecto como "proyecto de gran volumen sin nombre comercial identificado" y estima el volumen si hay datos disponibles (nº de unidades, m² construidos, fases).

BÚSQUEDA — CANAL PROYECTOS TURÍSTICO (costa del Mar Negro y montaña):
Identifica específicamente actores vinculados a grandes desarrollos turísticos residenciales/hoteleros en Sunny Beach, Golden Sands, Sozópol, Nesebar, Bansko, Pamporovo, Borovets y complejos equivalentes:
- Promotoras (developers) con proyectos activos o anunciados de complejos residenciales/hoteleros
- Contratistas generales / constructoras ejecutando obra en la zona
- Estudios de arquitectura firmando proyectos de estos complejos
- Bureaus de diseño de interiores contratados para show-flats / apartamentos modelo o para hoteles/spa de estos desarrollos
- Agencias inmobiliarias especializadas en reventa/alquiler de estos complejos, si aportan información relevante sobre volumen, fases o promotor

Para cada desarrollo turístico identificado, recoge también: nombre del proyecto/complejo, promotor, ubicación exacta, estado (en construcción / anunciado / en venta / entregado), escala (nº de unidades, hectáreas, fases) y fecha estimada de entrega o ejecución en los próximos años, con la fuente de esa información.

Ambos bloques de proyectos (por volumen y turístico) deben tratarse como segmentos propios en el análisis (canal proyectos), no mezclados con el retail tradicional, pero sí diferenciados entre sí con una etiqueta de sub-canal ("Proyectos — Volumen" / "Proyectos — Turístico").

FUENTES: Busca tanto en páginas web como en redes sociales. A diferencia de Rusia, en Bulgaria Instagram y Facebook funcionan con normalidad y son ampliamente usados por estudios boutique de diseño/cocinas — priorízalos junto con la web propia. Usa también LinkedIn para estudios de arquitectura, contratistas y developers de mayor tamaño. Para el canal proyectos (volumen y turístico), complementa con portales búlgaros de real estate y prensa económica/construcción (imoti.net, imot.bg, Investor.bg, novinite.com, y equivalentes) y con Google Maps como directorio local de negocios (dirección, teléfono, horario, reseñas). Si un perfil no se puede scrapear por completo (muro de login), extrae la información disponible en el snippet de búsqueda y en la bio/descripción pública.

IMPORTANTE - IDIOMAS: Realiza búsquedas en búlgaro, ruso e inglés:
- Búlgaro (idioma local y de negocios en el país): "дизайн на интериора София", "кухни по поръчка Пловдив", "студио за дизайн Варна", "архитектурно бюро Бургас", "строителна компания София", "инвеститор жилищен комплекс", "луксозен апартамент Слънчев бряг", "ваканционен комплекс Банско"
- Ruso (muy relevante por el peso de compradores/inversores rusos en la costa y en el segmento premium): "дизайн интерьера София", "кухни на заказ Пловдив", "архитектурное бюро Варна", "застройщик Болгария", "элитная недвижимость Солнечный берег", "апартаменты Золотые пески"
- Inglés: "interior design studio Sofia", "kitchen showroom Plovdiv", "architecture bureau Varna", "premium residential developer Bulgaria", "facade contractor Bulgaria", "Sunny Beach residential development", "Bansko ski resort development"
No descartes ningún resultado por el idioma de la web o del perfil.

VOLUMEN DE RESULTADOS:
- Mínimo 15-20 resultados distintos por ciudad en el canal retail (60-80 en total entre las 4 ciudades), distribuidos entre las 7 tipologías retail.
- Bloque adicional de 12-18 actores del canal proyectos por volumen (>2.000 m²) entre las 4 ciudades, distribuidos entre developers, contratistas, arquitectos, especificadores técnicos, instaladores de fachada e instaladores de suelo.
- Bloque adicional de 10-15 actores y/o desarrollos del canal proyectos turístico (costa y montaña).
Como referencia de calidad mínima, no de límite: si encuentras más resultados verificables, inclúyelos todos.

Para cada resultado, extrae con firecrawl scrape el contenido completo (web y/o publicaciones/bio de red social en formato markdown), y además:
- Nombre del negocio
- Ciudad / zona (para el bloque turístico, indicar el complejo o localidad turística)
- Tipología: clasifícalo obligatoriamente en una de estas categorías — Kitchen / Kitchen & Bath / Interior Designer / Architecture Studio / Contractor / Developer / Premium Materials Showroom / Especificador Técnico / Instalador de Fachadas / Instalador de Suelo / Híbrido (especifica qué combina si es híbrido)
- Canal: Retail / Proyectos — Volumen / Proyectos — Turístico (indicando el nombre del desarrollo cuando exista, o "sin nombre comercial identificado")
- Exposición física: indica si tiene showroom, sala de exposición o piso/apartamento modelo visible donde se podrían colocar muestras de material (Sí / No / No determinable), citando la evidencia (fotos del local, dirección física, mención explícita de "showroom" o "sample apartment / show-flat")
- Email y/o teléfono de contacto si están visibles
- Dirección
- Canal principal de publicación (web propia / Instagram / Facebook / LinkedIn / varios)
- Idioma en que está publicado el contenido

ANÁLISIS:
1. Agrupa los puntos de venta/actores en segmentos según su propuesta de valor real (no según el nombre): rango de precio aproximado, tipo de cliente al que se dirigen, marcas/materiales con los que ya trabajan (si se detectan competidores como cuarzo turco/chino, granito y mármol local búlgaro —p. ej. mármol de Vratsa—, porcelánico turco/chino, mármol importado de Italia/Grecia para propiedades de lujo en costa, etc.), y los 2-3 mensajes principales que repiten en su web o redes.
2. Cruza la tipología (Kitchen / Kitchen & Bath / Interior Designer / Architecture Studio / Contractor / Developer / Premium Materials Showroom / Especificador Técnico / Instalador de Fachadas / Instalador de Suelo / Híbrido) con la variable de exposición física (Sí/No) en una tabla resumen, desglosada también por ciudad, para ver cuántos actores por tipología y ciudad tienen espacio real donde exhibir material.
3. Crea un mapa de posicionamiento de todos los actores según precio (bajo-medio-alto) y amplitud de servicio (solo diseño vs. diseño+instalación+suministro de materiales vs. diseño+construcción+promoción).
4. Dentro de los bloques de canal proyectos (volumen y turístico), analiza aparte: qué developers tienen mayor volumen de unidades/m² en construcción o venta, qué estudios de arquitectura concentran más proyectos de gran escala, y qué contratistas, especificadores técnicos e instaladores de fachada/suelo aparecen repetidamente — esto marca a los actores con mayor capacidad de prescripción de material a gran escala. Compara también el perfil de comprador y el nivel de acabado entre el bloque por volumen (Sofía/Plovdiv/Varna/Burgas) y el bloque turístico (costa/montaña).
5. Basándote en el mapa y en la tabla de exposición física, identifica los 10-12 candidatos prioritarios totales (retail + proyectos por volumen + proyectos turístico) para que Cosentino coloque muestras o firme acuerdos de prescripción, priorizando los que sí tienen exposición física confirmada y encajan en el nicho medium-to-high end, y asegurando representación de Sofía y al menos una ciudad/zona secundaria (incluida la costa o la montaña).
6. Para esos candidatos prioritarios, sugiere el ángulo de entrada con precios agresivos más adecuado, diferenciado por tipología:
   - Kitchen / Kitchen & Bath: exposición gratuita a cambio de exclusividad de marca en encimeras, descuento por volumen inicial
   - Interior Designer: comisión por venta referida, muestrario de bolsillo + acceso a catálogo digital para render/especificación
   - Architecture Studio: acuerdo de especificación técnica preferente en proyectos, soporte técnico y muestras para propuestas a cliente final
   - Contractor: precios de volumen para obra, condiciones de pago a proyecto
   - Developer: acuerdo marco de suministro para pisos piloto / show-flats, con opción de escalar a suministro de fase completa si el material tiene buena acogida comercial
   - Especificador Técnico: inclusión preferente en pliegos/especificaciones de proyecto, formación técnica y soporte de prescripción
   - Instalador de Fachadas: acuerdo de partner instalador certificado para Dekton en fachada ventilada, precios de volumen por proyecto
   - Instalador de Suelo: precios de volumen para proyectos de pavimento a gran escala, muestras técnicas y soporte de instalación en obra

ENTREGA:
Devuelve el informe completo por triplicado en tres idiomas: inglés, búlgaro y ruso, con la misma estructura y contenido en los tres.

Además del informe narrativo, estructura todos los datos recopilados (ficha completa de cada punto de venta/actor, con todos los campos extraídos, más los resultados de los 6 puntos del ANÁLISIS, más el listado de desarrollos turísticos en sí) en un dataset limpio y normalizado (CSV o JSON, una fila/registro por punto de venta/actor — y una tabla aparte, una fila por proyecto/desarrollo turístico — con columnas consistentes: ciudad/zona, tipología, canal, sub-canal, exposición física, precio, amplitud de servicio, contacto, dirección, fuente, idioma, segmento, prioridad, ángulo de entrada, etc.). Este dataset debe quedar preparado como fuente de datos para construir después un dashboard interactivo tipo web, en inglés, búlgaro y ruso, donde se pueda filtrar y cruzar por ciudad/zona, tipología, canal (retail/proyectos por volumen/proyectos turístico), exposición física, rango de precio y prioridad, y consultar la ficha completa de cada punto de venta/actor o desarrollo.
```

---

## Cambios clave respecto al prompt de Rusia

- 2 ciudades (fase 1 de Rusia) → 4 ciudades búlgaras sin fases (Sofía, Plovdiv, Varna, Burgas), investigadas todas en la misma entrega.
- El canal proyectos se desdobla en DOS sub-bloques en vez de uno: "Proyectos — Volumen" (>2.000 m², igual criterio que Rusia, aplicado a las 4 ciudades) y "Proyectos — Turístico" (desarrollos residenciales/hoteleros de costa del Mar Negro y estaciones de montaña), dado el peso específico del real estate turístico en Bulgaria, con independencia de si supera el umbral de volumen.
- Tipologías: se mantienen las 10 de Rusia (se añade explícitamente "Premium Materials Showroom" a la lista de clasificación obligatoria, que en el prompt de Rusia era un objetivo de búsqueda pero no figuraba en la lista de clasificación).
- Fuentes adaptadas a Bulgaria: Instagram y Facebook funcionan con normalidad (no están restringidos como en Rusia) y se priorizan junto a la web propia; se añade LinkedIn como fuente para arquitectura/contratistas/developers; se sustituyen VK/Yandex por portales búlgaros de real estate y prensa (imoti.net, imot.bg, Investor.bg, novinite.com) y Google Maps como directorio local.
- Tercer idioma de búsqueda: búlgaro (idioma local) sustituye/añade al par ruso+inglés de Rusia — se buscan los tres idiomas (búlgaro, ruso, inglés), manteniendo el ruso por el peso histórico de compradores/inversores rusos en la costa búlgara.
- Volumen de resultados: 4 ciudades (60-80 retail) + 12-18 actores de proyectos por volumen + 10-15 actores/desarrollos de proyectos turístico (bloque nuevo, no presente en Rusia).
- Entrega: el informe pasa de duplicado (inglés/ruso) a TRIPLICADO (inglés/búlgaro/ruso), y el dashboard final debe soportar selector de 3 idiomas (EN/BG/RU) en vez de 2.

---

## Prompt — Dashboard interactivo y despliegue en GitHub

Nota de contexto: a diferencia de Bakú (donde se construyó un dashboard nuevo en React), en Uzbekistán y Rusia el dashboard final se resolvió reutilizando y adaptando la misma base de código (`app-core.js`, `base.css`, `proposal_A.css/html`) originada en Uzbekistán 2.0, sin build step, publicable como HTML estático. Para Bulgaria se sigue el mismo criterio: reutilizar esa base de código, extendiendo su capa de idiomas de 2 (EN/RU) a 3 (EN/BG/RU). Esta fase de construcción del dashboard, al partir ya de datos reales y de una base de código existente, se aborda con un diseño y plan de implementación propios (spec en `docs/superpowers/specs/`, plan en `docs/superpowers/plans/`) una vez la investigación de este prompt esté completa, en vez de un prompt de ejecución libre — así se documenta el trabajo igual que en Rusia (`docs/superpowers/specs/2026-09-05-russia-partner-intelligence-design.md`).

Requisitos que debe cumplir esa fase, fijados desde ya:
- Selector de idioma visible en todo momento con las 3 opciones: English / Български / Русский.
- Reutilizar el mapa de posicionamiento, filtros cruzados (ciudad/zona, tipología, canal y sub-canal, exposición física, rango de precio, prioridad), tabla, drawer de ficha completa, shortlist de prioritarios y pestaña de desarrollos/proyectos (incluyendo aquí tanto los de volumen como los turísticos, distinguibles por sub-canal).
- Archivo(s) estático(s) sin build step obligatorio para poder servirse directamente desde GitHub Pages.
- Repositorio Git ya identificado y verificado (existe en GitHub, vacío, con acceso SSH operativo desde esta máquina): `git@github.com:Francis-the-Analyst/bulgaria-partner-intelligence.git`. Al terminar la construcción del dashboard: `git init` en esta carpeta (o en la subcarpeta de la app, según decida el plan de implementación), commit y `git push` a ese remoto como entrega final.
