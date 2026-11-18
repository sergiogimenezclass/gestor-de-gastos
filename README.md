# ControlGastos — Gestor de Finanzas Personales

¡Hola! En este proyecto vas a construir **ControlGastos**, una aplicación web educativa para administrar ingresos y egresos personales. La aplicación permite registrar movimientos financieros clasificados por categorías, consultar el historial con filtros avanzados y monitorear el balance y la distribución del gasto en tiempo real desde un panel de control (Dashboard).

La interfaz es completamente responsiva (barra lateral en escritorio y barra inferior en celulares), utiliza persistencia en el navegador mediante `localStorage` y está construida con **JavaScript Vanilla** (sin frameworks ni librerías externas), priorizando accesibilidad, diseño minimalista de estilo *fintech* y buenas prácticas de desarrollo.

---

## Propósito del proyecto

La aplicación está preparada para que ejercites JavaScript moderno de forma progresiva. Vas a trabajar con:
- Manipulación semántica del DOM y formularios accesibles.
- Modularización con ES Modules (`.mjs`).
- Lógica de negocio pura (validación de transacciones, cálculo de balances, porcentajes y agregaciones).
- Operaciones CRUD completas (Crear, Leer, Editar y Eliminar movimientos).
- Persistencia local en el navegador (`localStorage`) con carga inicial de datos de prueba (*seed data*).

La actividad se realiza **una funcionalidad por vez**, con ayuda de un asistente de IA.

---

## El recorrido del usuario en la aplicación

1. **Monitoreo inicial:** al ingresar, el usuario consulta en el **Dashboard** su balance neto disponible, los ingresos y gastos acumulados del mes y la distribución de sus gastos por rubro (Alimentación, Transporte, Ocio, etc.).
2. **Registro de un movimiento:** desde la sección **Nuevo Movimiento**, elige si es un *Gasto* o un *Ingreso*, ingresa el importe, selecciona la categoría correspondiente, la fecha y una breve descripción.
3. **Persistencia y actualización reactiva:** al guardar, el movimiento se almacena en `localStorage` y todos los indicadores del Dashboard se recalculan automáticamente.
4. **Consulta y auditoría:** en el **Historial de Movimientos**, el usuario puede buscar transacciones por texto, filtrar por tipo o categoría, ordenar por fecha o monto, editar un error en un diálogo modal o eliminar un registro con confirmación previa.

---

## Las tres partes del proyecto

```text
┌─────────────────────────────────────────────────────────────────┐
│ HTML (index.html) ────► Pestañas/paneles, modales y formularios │
│ CSS  (css/styles.css) ─► Estética fintech, responsive y a11y    │
│ JS   (js/*.mjs) ───────► Lógica financiera, filtros y storage   │
└─────────────────────────────────────────────────────────────────┘
```

### HTML: estructura de la interfaz
`index.html` organiza la aplicación en tres vistas principales accesibles mediante controles de navegación (`role="tab"` / `role="tabpanel"`):
- `#panel-dashboard`: tarjetas de KPIs financieros, distribución porcentual y últimos movimientos.
- `#panel-movimientos`: barra de filtros, buscador en tiempo real, tabla/lista transaccional y estados vacíos.
- `#panel-nuevo`: formulario de alta con selector de tipo (*toggle* Gasto/Ingreso) y categorías dinámicas.
- Diálogos modales nativos (`<dialog>`) para la edición y confirmación de baja.

### CSS: apariencia
`css/styles.css` implementa una estética institucional y sobria:
- Fondo en gris pizarra claro (`#F8FAFC`), tarjetas en blanco puro con bordes de 1px (`#E2E8F0`) y tipografía con números tabulares (`font-variant-numeric: tabular-nums`).
- Paleta semántica: verde esmeralda para ingresos (`#059669`) y rojo carmesí para egresos (`#DC2626`).
- Sistema adaptativo: navegación lateral izquierda (*Sidebar*) en pantallas de escritorio y barra inferior fija (*Bottom Bar*) en móviles.

### JavaScript: comportamiento y módulos
- `js/app.js`: orquestador de eventos, navegación y manipulación del DOM.
- `js/categorias.mjs`: catálogo de categorías agrupadas por tipo con colores y etiquetas.
- `js/storage.mjs`: lectura, escritura y precarga de datos iniciales en `localStorage`.
- `js/movimientos.mjs`: operaciones CRUD y validación de datos financieros.
- `js/filtros.mjs`: búsqueda de texto, filtrado concurrente y ordenamiento.
- `js/dashboard.mjs`: cálculo de balances, totales mensuales y porcentajes por categoría.

---

## Estructura de archivos

```text
gestor-gastos/
├── css/
│   └── styles.css              # estilos globales, layout responsive y tema fintech
├── js/
│   ├── app.js                  # coordinación de eventos y DOM
│   ├── categorias.mjs          # catálogo y metadata de categorías
│   ├── dashboard.mjs           # cálculo de balances y distribución
│   ├── filtros.mjs             # búsqueda, filtros y ordenamiento
│   ├── movimientos.mjs         # operaciones CRUD y validaciones
│   └── storage.mjs             # persistencia en localStorage
├── index.html                  # estructura semántica de la aplicación
└── README.md                   # guía del proyecto y prompts de trabajo
```

No hace falta instalar dependencias ni usar frameworks.

---

## Cómo ejecutar y verificar el proyecto

1. Abrí la carpeta del proyecto en **Visual Studio Code**.
2. Instalá la extensión **Live Server** si todavía no la tenés.
3. Hacé clic derecho sobre `index.html` y seleccioná **Open with Live Server** (o presioná el botón **Go Live** en la barra inferior).
4. El navegador abrirá la aplicación en `http://127.0.0.1:5500/index.html`.

---

## Selectores principales de la interfaz

Para que tu código se integre sin inconvenientes con la estructura HTML provista, utilizá los siguientes identificadores y clases:

| Elemento / Rol | Selector ID / Clase | Propósito |
| :--- | :--- | :--- |
| **Botones de Navegación** | `.boton-nav` | Botones de pestañas (`[data-panel="dashboard"]`, etc.) |
| **Paneles Principales** | `#panel-dashboard`, `#panel-movimientos`, `#panel-nuevo` | Contenedores de cada vista |
| **KPIs del Dashboard** | `#kpi-balance`, `#kpi-ingresos`, `#kpi-gastos` | Elementos de texto con los importes clave |
| **Distribución de Gastos**| `#lista-distribucion-gastos` | Contenedor de barras porcentuales por categoría |
| **Últimos Movimientos** | `#lista-ultimos-movimientos` | Lista de transacciones recientes en el dashboard |
| **Formulario de Alta** | `#formulario-movimiento` | Formulario de registro |
| **Selector de Tipo** | `input[name="tipo-movimiento"]` | Radio/toggle con valores `"gasto"` o `"ingreso"` |
| **Campos de Alta** | `#monto`, `#categoria`, `#fecha`, `#descripcion` | Campos del formulario de registro |
| **Buscador y Filtros** | `#filtro-busqueda`, `#filtro-tipo`, `#filtro-categoria`, `#filtro-orden` | Controles de filtrado del historial |
| **Cuerpo de Movimientos**| `#cuerpo-tabla-movimientos` | Contenedor de la lista/tabla general |
| **Estado Vacío** | `#movimientos-vacio` | Mensaje visible cuando no hay resultados |
| **Modal de Edición** | `#modal-editar` | Elemento `<dialog>` para modificar un registro |
| **Modal de Eliminación** | `#modal-eliminar` | Elemento `<dialog>` de confirmación de baja |

---

## Guía didáctica: prompts paso a paso

Realizá la implementación en orden estricto. **Copiá y pegá un solo prompt por vez** en tu asistente de IA y verificá que funcione antes de avanzar.

### Paso 1: navegación entre vistas y soporte responsive
> En `js/app.js`, implementá la lógica de navegación entre las tres vistas principales (`#panel-dashboard`, `#panel-movimientos` y `#panel-nuevo`). Escuchá el evento `click` en los botones `.boton-nav` (tanto del sidebar de escritorio como de la barra inferior móvil). Al hacer clic, remové la clase `.activo` y seteá `aria-selected="false"` en todos los botones, asignalos en el seleccionado, ocultá los paneles no activos agregando el atributo `hidden` y mostrá el panel correspondiente quitando dicho atributo. Asegurate de que los enlaces directos (como `#boton-ver-todos` o `#boton-ir-nuevo`) también cambien a su pestaña respectiva.

### Paso 2: catálogo de categorías dinámicas
> En `js/categorias.mjs`, exportá la constante `CATEGORIAS` que contenga las categorías clasificadas por tipo (`ingreso` y `gasto`) con `id`, `nombre`, `icono` y `color`. Exportá la función `obtenerCategoriasPorTipo(tipo)` que devuelva la lista filtrada. En `js/app.js`, conectá el cambio del selector de tipo (`input[name="tipo-movimiento"]`) para que al alternar entre *Gasto* e *Ingreso* se vacíe y repueble el selector `#categoria` con las opciones correspondientes.

### Paso 3: capa de almacenamiento y datos iniciales
> En `js/storage.mjs`, implementá las funciones `guardarMovimientos(movimientos)` y `obtenerMovimientos()`. La función `obtenerMovimientos()` debe leer la clave `"control_gastos_movimientos"` de `localStorage`. Si la clave no existe o está vacía, debe inicializarla con un array de movimientos de muestra precargados (con ingresos y gastos del mes actual) y retornarlos. Asegurate de manejar excepciones de parsing JSON retornando un array vacío si los datos son inválidos.

### Paso 4: validaciones del movimiento
> En `js/movimientos.mjs`, implementá la función pura `validarMovimiento(datos)` que reciba un objeto con `{ tipo, monto, categoria, fecha, descripcion }`. Debe validar que: `tipo` sea `"ingreso"` o `"gasto"`; `monto` sea un número mayor estricto a 0; `categoria` no esté vacía; `fecha` tenga formato válido `AAAA-MM-DD` y no sea posterior al día de hoy; y `descripcion` tenga entre 3 y 60 caracteres. Debe devolver `{ esValido: boolean, errores: string[] }`.

### Paso 5: lógica CRUD de movimientos
> En `js/movimientos.mjs`, implementá las siguientes funciones puras:
> - `crearMovimiento(movimientos, nuevoDato)`: valida con `validarMovimiento`, genera un `id` único (ej. `MOV-` con timestamp), agrega la fecha de creación y retorna un nuevo array con el elemento añadido al inicio.
> - `actualizarMovimiento(movimientos, id, datosActualizados)`: retorna un nuevo array con el elemento modificado si existe.
> - `eliminarMovimiento(movimientos, id)`: retorna un nuevo array sin el elemento indicado.

### Paso 6: conectar el formulario de registro con la UI
> En `js/app.js`, escuchá el evento `submit` de `#formulario-movimiento`. Prevení el comportamiento por defecto, extraé los valores ingresados y validalos con `validarMovimiento`. Si hay errores, mostralos en una lista dentro de `#mensaje-formulario` con clase `.error`. Si es válido, agregá el movimiento con `crearMovimiento`, persistilo con `guardarMovimientos`, reseteá el formulario, mostrá un mensaje de éxito temporal, navegá al Dashboard y actualizá los datos en pantalla.

### Paso 7: cálculos y métricas del Dashboard
> En `js/dashboard.mjs`, implementá la función `calcularResumenDashboard(movimientos, anioMes)` que reciba el array de movimientos y opcionalmente un período (`AAAA-MM`). Debe calcular:
> - `totalIngresos`: suma de montos con tipo `"ingreso"` del período.
> - `totalGastos`: suma de montos con tipo `"gasto"` del período.
> - `balance`: diferencia `totalIngresos - totalGastos`.
> - `distribucionGastos`: array con cada categoría de gasto, su monto acumulado y su porcentaje sobre el total de gastos.

### Paso 8: renderizado del Dashboard y distribución de gastos
> En `js/app.js`, creá la función `renderizarDashboard(movimientos)`. Formateá y actualizá los valores de `#kpi-balance`, `#kpi-ingresos` y `#kpi-gastos` (aplicando clase verde si el balance es positivo y roja si es negativo). En `#lista-distribucion-gastos`, renderizá para cada categoría su nombre, monto e insertá una barra horizontal de progreso con ancho porcentual proporcional. En `#lista-ultimos-movimientos`, renderizá las últimas 5 transacciones con su icono, fecha, detalle e importe con signo.

### Paso 9: renderizado del historial completo de movimientos
> En `js/app.js`, implementá la función `renderizarHistorial(movimientos)`. Por cada movimiento creá una fila/tarjeta en `#cuerpo-tabla-movimientos` que contenga: badge de tipo, categoría con su color asociado, descripción, fecha en formato legible (`DD/MM/AAAA`), importe formateado (`+$X.XX` o `-$X.XX`) y botones de acción ("Editar" y "Eliminar") con atributos `data-id`. Si el array está vacío, ocultá la tabla y mostrá `#movimientos-vacio`.

### Paso 10: búsqueda, filtros concurrentes y ordenamiento
> En `js/filtros.mjs`, implementá `filtrarMovimientos(movimientos, { busqueda, tipo, categoria, orden })` que filtre concurrentemente por texto en la descripción (sin distinguir mayúsculas ni acentos), por tipo y por categoría; y que aplique ordenamiento (`fecha-desc`, `fecha-asc`, `monto-desc`, `monto-asc`). En `js/app.js`, conectá los eventos `input` y `change` de `#filtro-busqueda`, `#filtro-tipo`, `#filtro-categoria` y `#filtro-orden` para actualizar la tabla del historial en tiempo real.

### Paso 11: edición de movimientos con modal nativo
> En `js/app.js`, interceptá el clic en los botones "Editar" de las filas del historial. Obtené el ID del movimiento, buscá sus datos y precargalos en el formulario dentro del diálogo nativo `<dialog id="modal-editar">`. Abrí el modal con `.showModal()`. Al enviar el formulario de edición, validá los datos, ejecutá `actualizarMovimiento`, guardá en `localStorage`, cerrá el modal con `.close()`, refrescá la tabla y actualizá el Dashboard.

### Paso 12: eliminación con modal de confirmación
> En `js/app.js`, al hacer clic en un botón "Eliminar", abrí el diálogo `<dialog id="modal-eliminar">` mostrando la descripción y el monto del movimiento a dar de baja. Al pulsar `#boton-confirmar-eliminar`, ejecutá `eliminarMovimiento`, persistí los cambios en `localStorage`, cerrá el modal y refrescá tanto el historial como el Dashboard.

---

## Desafíos opcionales para seguir practicando

### Desafíos cortos
- **Extra 1: Formato de moneda localizado:** Usá `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })` para que todos los importes se muestren formateados de manera estándar y profesional.
- **Extra 2: Atajo rápido con tecla Escape:** Asegurate de que al presionar la tecla `Esc` no solo se cierren los modales nativos sino que se limpie cualquier estado pendiente o formulario abierto.
- **Extra 3: Botón de reseteo de datos:** Agregá un botón en la barra de configuración para restablecer la aplicación a los datos de muestra iniciales si el usuario borró todo.

### Desafíos intermedios
- **Extra 4: Presupuesto mensual con barra de alerta:** Permití definir un límite de gasto mensual en pesos. Si el total de gastos supera el 80%, mostrá una advertencia en amarillo; si supera el 100%, marcá el indicador en rojo.
- **Extra 5: Exportación a archivo CSV:** Agregá un botón en el Historial para descargar las transacciones filtradas en un archivo `movimientos.csv` para abrir en Microsoft Excel o Google Sheets.
- **Extra 6: Filtro por rango de fechas personalizado:** Reemplazá el filtro simple de mes por dos selectores (`desde` y `hasta`) para consultar transacciones entre días específicos.

### Desafíos avanzados
- **Extra 7: Modo oscuro persistente:** Implementá un botón para alternar entre tema claro y tema oscuro mediante variables CSS, detectando la preferencia del sistema (`prefers-color-scheme`) y guardando la elección del usuario en `localStorage`.
- **Extra 8: Gráfico de dona en SVG nativo:** Diseñá un componente visual en SVG puro con `stroke-dasharray` y `stroke-dashoffset` para dibujar el gráfico circular de distribución de gastos sin librerías externas.

---

## Recomendaciones para trabajar con IA

1. **Un solo paso por consulta:** no intentes generar toda la aplicación junta; asegurate de entender cada paso antes de pedir el siguiente.
2. **Revisá los archivos modificados:** pedile a la IA que detalle qué líneas o funciones alteró para seguir la evolución del proyecto.
3. **Validá la experiencia de usuario:** probá el flujo completo en el navegador usando Live Server tanto en resolución de escritorio como en la vista móvil de las DevTools.
