# Visual Audit V0.1.1

Auditoria visual para la fase **V0.1.1 - Visual Upgrade / UI Polish**.

Alcance revisado:

- Home
- Header y buscador
- Navegacion deportiva
- Bottom navigation mobile
- MatchCard
- Live
- Ranking
- Profile
- Explore
- Match details
- Estados visuales y consistencia general

Esta auditoria no propone reconstruir la aplicacion ni cambiar arquitectura, servicios, mocks, contratos o logica de negocio.

## Resumen ejecutivo

El prototipo funciona y tiene una arquitectura visual consistente, pero todavia se percibe como un MVP/dashboard: fondo claro plano, muchas cards blancas equivalentes, iconografia funcional, iniciales en lugar de identidad deportiva y pocas capas de profundidad visual.

La experiencia comunica producto util, pero aun no comunica suficiente:

- deporte
- competicion
- energia en vivo
- comunidad
- gamificacion
- progreso
- prestigio de ranking

El mayor impacto vendra de mejorar jerarquia visual, densidad deportiva, identidad de equipos/competiciones y composicion desktop sin tocar la logica existente.

## Hallazgos

| Prioridad | Severidad | Componente / area | Problema encontrado | Propuesta de mejora |
| --- | --- | --- | --- | --- |
| P0 | Alta | Home / Hero principal | El hero es una card blanca con texto y score. No funciona como primer impacto deportivo premium. | Convertirlo en un hero editorial-deportivo con fondo visual, marcador protagonista, equipos enfrentados, estado live, CTA y modulo de comunidad. |
| P0 | Alta | Identidad visual general | El sistema usa principalmente blanco, bordes y morado. Se siente limpio pero generico. | Introducir capas visuales: superficies elevadas, bandas deportivas, acentos live/gold, sombras direccionales y fondos sutiles con textura/patron deportivo. |
| P0 | Alta | MatchCard | Las tarjetas son funcionales pero dependen de iniciales, texto y badges. Falta identidad de equipo y lectura deportiva inmediata. | Reforzar logos/escudos simulados, jerarquia de marcador, competicion, minuto, estado live y prediccion comunitaria como barra o chip visual. |
| P0 | Alta | Live desktop | Las secciones de deporte/competicion generan contenedores enormes con mucho espacio vacio cuando hay pocos partidos. | Usar layout de live center: columna principal con feed compacto, rail lateral con actividad/eventos, grupos mas densos y contenedores sin grandes areas vacias. |
| P0 | Alta | Explore | Se percibe como directorio o buscador administrativo. Resultados, deportes y competiciones tienen cards muy similares. | Convertir Explore en discovery deportivo con tendencias destacadas, categorias visuales por deporte, eventos cercanos con mapa/ciudad y cards diferenciadas por entidad. |
| P1 | Media-alta | Header | Header correcto pero demasiado neutro. Logo pequeno y sin presencia de marca deportiva. | Aumentar caracter de marca: lockup mas fuerte, posible indicador de temporada/live, search con mejor affordance y desktop nav con mayor presencia. |
| P1 | Media-alta | Buscador | El search es utilitario; no sugiere descubrimiento ni contenido deportivo. | Usar placeholder contextual, iconografia mas clara, estado focused premium y posible quick action visual sin cambiar logica. |
| P1 | Media-alta | Navegacion deportiva | Los filtros de deportes son chips genericos. No hay iconos, estados activos fuertes ni diferenciacion deportiva. | Anadir iconos por deporte, estado activo persistente, scroll affordance mobile y estilo mas cercano a una barra deportiva. |
| P1 | Media-alta | Ranking | El podio funciona, pero no se siente aspiracional. Las cards son cajas con metricas, sin celebracion ni estatus. | Dar tratamiento premium al top 3: pedestal visual, corona/trofeo, fondo dorado controlado, glow suave, rachas y precision mas visibles. |
| P1 | Media-alta | Profile | Perfil es claro, pero parece ficha de usuario de dashboard. Logros y stats no transmiten progresion ni gamificacion. | Crear cabecera de perfil mas rica: banner, nivel/rango, progreso, insignias destacadas y logros con rareza visual. |
| P1 | Media | Predicciones populares | La seccion parece una lista simple; los puntos y comunidad no tienen suficiente peso visual. | Convertir cada item en mini prediction card con opcion seleccionada, puntos potenciales, comunidad como barra y microestado. |
| P1 | Media | Competiciones destacadas | Usa iniciales y lista compacta; falta sensacion de liga, torneo o evento. | Usar emblemas simulados, color por deporte, contador live mas expresivo y cards con formato de competicion. |
| P1 | Media | Match details | La cabecera del partido es funcional, pero muy plana para ser una pagina central. | Convertir cabecera en scoreboard: equipos grandes, marcador central, timeline compacto, estado live y fondo contextual por competicion/deporte. |
| P1 | Media | Eventos / placeholders | La ruta de eventos usa placeholder; se percibe incompleta. | En fase visual, reemplazar placeholders visibles por preview cards o empty state editorial mas rico sin crear funcionalidad nueva. |
| P1 | Media | Bottom navigation mobile | Funciona, pero ocupa el centro visual sobre cards y usa estilo basico. | Elevarla como tab bar premium: fondo blur mas definido, indicador activo, mejor separacion de labels e iconos. |
| P1 | Media | Desktop layout | Algunas paginas aprovechan el ancho, pero otras dejan areas vacias o repiten grid sin composicion. | Introducir layouts por tipo de pagina: home editorial, live center, ranking leaderboard, profile hub, explore discovery. |
| P1 | Media | Jerarquia tipografica | Titulos son fuertes, pero se repite el mismo peso en secciones y cards. | Definir escala de jerarquia por contexto: hero, seccion, card title, metadata, live score, stat number. |
| P1 | Media | Sombras y profundidad | Shadows existen pero muchas superficies tienen profundidad similar. | Crear niveles: base, raised card, featured card, sticky nav, modal. Usar sombras con mas intencion y menos uniformidad. |
| P2 | Baja-media | Bordes | Bordes uniformes en casi todas las cards; el producto se siente cuadriculado. | Variar tratamiento segun importancia: featured cards con borde/acento, listas con separadores, compact cards con menos borde. |
| P2 | Baja-media | Iconografia | Lucide funciona, pero se usa de forma muy funcional y poco deportiva. | Mantener lucide, pero sumar contenedores, tonos por categoria y consistencia semantica: live, ranking, comunidad, puntos, logro. |
| P2 | Baja-media | Spacing | El spacing es ordenado, pero algunas cards tienen demasiado aire interno y otras grids quedan muy repetitivas. | Ajustar densidad por breakpoint: mobile compacto, desktop con composicion y no solo cards mas anchas. |
| P2 | Baja | Colores semanticos | Live y gold existen, pero el morado domina casi todo. | Usar live/gold/success/info con mas proposito para score, ranking, comunidad y progreso. |
| P2 | Baja | Estados empty/loading | Estados correctos, pero visualmente genericos. | Hacer estados tematicos: deporte, comunidad, calendario, live, ranking. |
| P2 | Baja | Avatares e iniciales | Iniciales ayudan al prototipo, pero aparecen donde deberia haber identidad visual. | Crear sistema visual de escudos/avatares generativos con gradientes discretos, patrones o iconos por deporte. |

## Observaciones por area

### Header

El header es estable, accesible y funcional. Visualmente, el logo y el buscador se sienten como una barra SaaS. Falta energia deportiva y estado de plataforma: live, temporada, comunidad o competicion activa.

Prioridad: **P1**

### Buscador

El buscador esta bien ubicado, pero luce basico. En desktop ocupa mucho ancho sin ofrecer sensacion de descubrimiento. En mobile compite con logo y acciones, pero no comunica busqueda global premium.

Prioridad: **P1**

### Navegacion deportiva

Los chips funcionan, pero no diferencian deportes ni muestran activo visual claro en capturas generales. El patron es correcto para filtros, pero todavia poco memorable.

Prioridad: **P1**

### Hero principal

Es el componente con mayor oportunidad. Hoy es una card blanca con score lateral. Deberia ser el ancla visual de la home: partido destacado, energia competitiva, live, comunidad y CTA.

Prioridad: **P0**

### MatchCard

La MatchCard es compacta y reutilizable, pero visualmente todos los partidos se sienten parecidos. Los scores live destacan, aunque el resto de jerarquia depende demasiado de texto. Las iniciales reducen la percepcion premium.

Prioridad: **P0**

### Partidos destacados

El grid es claro, pero se percibe como una lista de widgets. Falta diferenciacion entre destacado, proximo, live y finalizado. Los cards no cuentan una historia competitiva.

Prioridad: **P1**

### En vivo

Mobile funciona por densidad. Desktop tiene demasiado vacio en los grupos. La pagina live deberia sentirse como centro de seguimiento en tiempo real, no como grupos grandes con pocas cards.

Prioridad: **P0**

### Predicciones populares

La seccion comunica datos, pero los puntos y porcentajes no se sienten gamificados. Falta una visualizacion rapida de comunidad y recompensa.

Prioridad: **P1**

### Competiciones destacadas

Los items son listas con iniciales. Falta identidad de competicion, emblema, deporte, pais y live state mas visual.

Prioridad: **P1**

### Ranking

Ranking es funcional y legible. El podio necesita mas celebracion, profundidad y prestigio. La tabla es clara, pero aun parece tabla administrativa.

Prioridad: **P1**

### Perfil

Perfil tiene buena informacion, pero el header parece una ficha basica. Los logros son uniformes y no hay sentido fuerte de rareza, nivel o progreso.

Prioridad: **P1**

### Eventos

La presencia de placeholder transmite modulo incompleto. Para esta fase no hace falta construir eventos, pero si conviene mejorar la presentacion visual del placeholder o convertirlo en preview editorial.

Prioridad: **P1**

### Navegacion movil

La bottom navigation es util y persistente. Visualmente podria sentirse mas nativa/premium con indicador activo mas claro, mejor elevacion y espaciado refinado.

Prioridad: **P1**

### Responsive

Mobile es usable y denso. Desktop muestra el problema opuesto: mucho contenido en grids, pero poca composicion. Live y Explore son los casos mas evidentes.

Prioridad: **P0/P1 segun pagina**

### Densidad de informacion

La densidad existe, especialmente en home mobile, pero se logra apilando cards similares. Falta densidad con jerarquia: informacion agrupada por importancia, no solo repetida.

Prioridad: **P1**

### Consistencia de componentes

La consistencia es buena a nivel tecnico, pero demasiado uniforme a nivel visual. El mismo patron de card/badge aparece en home, ranking, profile, explore y match details.

Prioridad: **P1**

## 10 cambios visuales de mayor impacto

1. **Redisenar el Hero principal de Home** como scoreboard deportivo premium con fondo visual, equipos, score/estado, comunidad y CTA.
2. **Elevar MatchCard** con escudos/identidad generativa, jerarquia de marcador, barra de comunidad y estados live/finalizado/programado mas diferenciados.
3. **Crear un layout Live Center para desktop** que elimine grandes vacios y agregue feed compacto, actividad y agrupacion mas rica.
4. **Dar identidad deportiva a la navegacion de deportes** con iconos, estado activo fuerte y mejor affordance horizontal en mobile.
5. **Redisenar Ranking top 3** como podio aspiracional con tratamiento gold, trofeo, rachas, precision y destaque del usuario actual.
6. **Convertir Profile en hub gamificado** con banner, nivel/rango, progreso y logros con rareza visual.
7. **Mejorar Explore como discovery** diferenciando partidos, equipos, jugadores, competiciones y eventos con cards propias.
8. **Reforzar competiciones destacadas** con emblemas simulados, colores por deporte y badges live mas expresivos.
9. **Refinar profundidad visual global**: fondos sutiles, sombras por nivel, cards featured y separadores menos uniformes.
10. **Pulir bottom navigation mobile** con indicador activo, elevacion premium y mejor integracion con safe area.

## Recomendacion de secuencia para V0.1.1

1. Home visual system: hero, MatchCard, secciones principales.
2. Navegacion: header, sports navigation, bottom nav.
3. Live desktop y mobile polish.
4. Ranking y profile gamification.
5. Explore y placeholders.
6. Ajustes globales de sombras, spacing, bordes, iconografia y densidad.

Esta secuencia maximiza impacto visible sin tocar la arquitectura ni la logica existente.
