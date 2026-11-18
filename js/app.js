/**
 * ControlGastos — Orquestador Principal de la Aplicación
 */

import { CATEGORIAS, obtenerCategoriasPorTipo, obtenerCategoriaPorId } from './categorias.mjs';
import { obtenerMovimientos, guardarMovimientos } from './storage.mjs';
import { validarMovimiento, crearMovimiento, actualizarMovimiento, eliminarMovimiento } from './movimientos.mjs';
import { calcularResumenDashboard, obtenerUltimosMovimientos } from './dashboard.mjs';
import { filtrarMovimientos } from './filtros.mjs';

// Estado global de la aplicación en memoria
let movimientos = [];
let idMovimientoAEliminar = null;

// ==========================================================================
// Selectores del DOM
// ==========================================================================
const botonesNav = document.querySelectorAll('.boton-nav');
const panelDashboard = document.getElementById('panel-dashboard');
const panelMovimientos = document.getElementById('panel-movimientos');
const panelNuevo = document.getElementById('panel-nuevo');
const tituloVistaActual = document.getElementById('titulo-vista-actual');
const fechaHoyTexto = document.getElementById('fecha-hoy-texto');

const botonIrNuevo = document.getElementById('boton-ir-nuevo');
const botonVerTodos = document.getElementById('boton-ver-todos');
const botonCancelarFormulario = document.getElementById('boton-cancelar-formulario');

// KPIs y Dashboard
const kpiBalance = document.getElementById('kpi-balance');
const kpiIngresos = document.getElementById('kpi-ingresos');
const kpiGastos = document.getElementById('kpi-gastos');
const sidebarBalance = document.getElementById('sidebar-balance');
const listaDistribucionGastos = document.getElementById('lista-distribucion-gastos');
const listaUltimosMovimientos = document.getElementById('lista-ultimos-movimientos');

// Formulario de Alta
const formularioMovimiento = document.getElementById('formulario-movimiento');
const radiosTipo = document.querySelectorAll('input[name="tipo-movimiento"]');
const inputMonto = document.getElementById('monto');
const selectCategoria = document.getElementById('categoria');
const inputFecha = document.getElementById('fecha');
const inputDescripcion = document.getElementById('descripcion');
const mensajeFormulario = document.getElementById('mensaje-formulario');

// Filtros e Historial
const filtroBusqueda = document.getElementById('filtro-busqueda');
const filtroTipo = document.getElementById('filtro-tipo');
const filtroCategoria = document.getElementById('filtro-categoria');
const filtroOrden = document.getElementById('filtro-orden');
const botonLimpiarFiltros = document.getElementById('boton-limpiar-filtros');
const cuerpoTablaMovimientos = document.getElementById('cuerpo-tabla-movimientos');
const badgeContadorMovimientos = document.getElementById('badge-contador-movimientos');
const movimientosVacio = document.getElementById('movimientos-vacio');

// Modales nativos (<dialog>)
const modalEditar = document.getElementById('modal-editar');
const formularioEditar = document.getElementById('formulario-editar');
const editarId = document.getElementById('editar-id');
const editarTipo = document.getElementById('editar-tipo');
const editarMonto = document.getElementById('editar-monto');
const editarCategoria = document.getElementById('editar-categoria');
const editarFecha = document.getElementById('editar-fecha');
const editarDescripcion = document.getElementById('editar-descripcion');
const mensajeModalEditar = document.getElementById('mensaje-modal-editar');
const botonCancelarEditar = document.getElementById('boton-cancelar-editar');
const botonCerrarModalX = document.getElementById('boton-cerrar-modal-x');

const modalEliminar = document.getElementById('modal-eliminar');
const eliminarDetalleMovimiento = document.getElementById('eliminar-detalle-movimiento');
const botonConfirmarEliminar = document.getElementById('boton-confirmar-eliminar');
const botonCancelarEliminar = document.getElementById('boton-cancelar-eliminar');

// ==========================================================================
// Utilidades de Formato
// ==========================================================================
const formateadorMoneda = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  minimumFractionDigits: 2
});

function formatearMoneda(monto) {
  return formateadorMoneda.format(monto || 0);
}

function formatearFecha(fechaStr) {
  if (!fechaStr) return '';
  const [anio, mes, dia] = fechaStr.split('-');
  return `${dia}/${mes}/${anio}`;
}

function obtenerFechaHoyISO() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}

// ==========================================================================
// Paso 1: Navegación entre vistas
// ==========================================================================
function cambiarVista(nombrePanel) {
  const paneles = {
    dashboard: { el: panelDashboard, titulo: 'Dashboard Financiero' },
    movimientos: { el: panelMovimientos, titulo: 'Historial de Movimientos' },
    nuevo: { el: panelNuevo, titulo: 'Registrar Transacción' }
  };

  if (!paneles[nombrePanel]) return;

  // Actualizar visibilidad de paneles
  Object.keys(paneles).forEach((key) => {
    const info = paneles[key];
    if (key === nombrePanel) {
      info.el.removeAttribute('hidden');
    } else {
      info.el.setAttribute('hidden', '');
    }
  });

  // Actualizar estado de los botones de navegación
  botonesNav.forEach((btn) => {
    const coincide = btn.getAttribute('data-panel') === nombrePanel;
    btn.classList.toggle('activo', coincide);
    btn.setAttribute('aria-selected', coincide ? 'true' : 'false');
  });

  // Actualizar título del encabezado
  if (tituloVistaActual) {
    tituloVistaActual.textContent = paneles[nombrePanel].titulo;
  }

  // Si se navega a movimientos, refrescar filtros
  if (nombrePanel === 'movimientos') {
    aplicarFiltrosYRenderizar();
  }
}

// ==========================================================================
// Paso 2: Poblar selectores de categorías dinámicas
// ==========================================================================
function poblarSelectCategorias(selectElement, tipo, incluirOpcionVacia = true, textoVacio = 'Seleccioná una categoría') {
  selectElement.innerHTML = '';

  if (incluirOpcionVacia) {
    const optDefault = document.createElement('option');
    optDefault.value = '';
    optDefault.textContent = textoVacio;
    selectElement.appendChild(optDefault);
  }

  const lista = obtenerCategoriasPorTipo(tipo);
  lista.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = `${cat.icono} ${cat.nombre}`;
    selectElement.appendChild(opt);
  });
}

function inicializarCategoriasFiltro() {
  filtroCategoria.innerHTML = '<option value="todas">Todas las categorías</option>';
  CATEGORIAS.forEach((cat) => {
    const opt = document.createElement('option');
    opt.value = cat.id;
    opt.textContent = `${cat.icono} ${cat.nombre} (${cat.tipo})`;
    filtroCategoria.appendChild(opt);
  });
}

// ==========================================================================
// Paso 8: Renderizado del Dashboard
// ==========================================================================
function renderizarDashboard() {
  const resumen = calcularResumenDashboard(movimientos);

  // Balance
  kpiBalance.textContent = formatearMoneda(resumen.balance);
  kpiBalance.className = 'kpi-valor ' + (resumen.balance >= 0 ? 'valor-ingreso' : 'valor-gasto');

  if (sidebarBalance) {
    sidebarBalance.textContent = formatearMoneda(resumen.balance);
    sidebarBalance.className = 'widget-monto ' + (resumen.balance >= 0 ? 'valor-ingreso' : 'valor-gasto');
  }

  // Ingresos y Gastos
  kpiIngresos.textContent = formatearMoneda(resumen.totalIngresos);
  kpiGastos.textContent = formatearMoneda(resumen.totalGastos);

  // Distribución de Gastos (Barras)
  listaDistribucionGastos.innerHTML = '';
  if (resumen.distribucionGastos.length === 0) {
    listaDistribucionGastos.innerHTML = '<p class="texto-fecha">No hay gastos registrados en el período.</p>';
  } else {
    resumen.distribucionGastos.forEach((item) => {
      const catInfo = obtenerCategoriaPorId(item.categoria) || {
        nombre: item.categoria,
        icono: '📦',
        color: '#64748B'
      };

      const itemDiv = document.createElement('div');
      itemDiv.className = 'item-distribucion';
      itemDiv.innerHTML = `
        <div class="distribucion-info">
          <span class="distribucion-etiqueta">
            <span aria-hidden="true">${catInfo.icono}</span> ${catInfo.nombre}
          </span>
          <span class="distribucion-valores">
            ${formatearMoneda(item.monto)} (${item.porcentaje}%)
          </span>
        </div>
        <div class="barra-fondo">
          <div class="barra-relleno" style="width: ${item.porcentaje}%; background-color: ${catInfo.color};"></div>
        </div>
      `;
      listaDistribucionGastos.appendChild(itemDiv);
    });
  }

  // Últimos Movimientos
  const ultimos = obtenerUltimosMovimientos(movimientos, 5);
  listaUltimosMovimientos.innerHTML = '';
  if (ultimos.length === 0) {
    listaUltimosMovimientos.innerHTML = '<li class="texto-fecha">No hay movimientos recientes.</li>';
  } else {
    ultimos.forEach((mov) => {
      const catInfo = obtenerCategoriaPorId(mov.categoria) || { icono: '📌', nombre: mov.categoria };
      const esIngreso = mov.tipo === 'ingreso';

      const li = document.createElement('li');
      li.className = 'item-reciente';
      li.innerHTML = `
        <div class="reciente-izq">
          <div class="reciente-icono ${esIngreso ? 'reciente-icono-ingreso' : 'reciente-icono-gasto'}" aria-hidden="true">
            ${catInfo.icono}
          </div>
          <div class="reciente-texto">
            <span class="reciente-desc">${mov.descripcion}</span>
            <span class="reciente-fecha">${formatearFecha(mov.fecha)} · ${catInfo.nombre}</span>
          </div>
        </div>
        <div class="reciente-monto ${esIngreso ? 'valor-ingreso' : 'valor-gasto'}">
          ${esIngreso ? '+' : '-'}${formatearMoneda(mov.monto)}
        </div>
      `;
      listaUltimosMovimientos.appendChild(li);
    });
  }
}

// ==========================================================================
// Paso 9 y 10: Renderizado del Historial y Filtros
// ==========================================================================
function aplicarFiltrosYRenderizar() {
  const opciones = {
    busqueda: filtroBusqueda.value,
    tipo: filtroTipo.value,
    categoria: filtroCategoria.value,
    orden: filtroOrden.value
  };

  const resultado = filtrarMovimientos(movimientos, opciones);
  renderizarTablaMovimientos(resultado);
}

function renderizarTablaMovimientos(lista) {
  cuerpoTablaMovimientos.innerHTML = '';
  badgeContadorMovimientos.textContent = `${lista.length} movimiento${lista.length === 1 ? '' : 's'}`;

  if (lista.length === 0) {
    movimientosVacio.removeAttribute('hidden');
    return;
  }

  movimientosVacio.setAttribute('hidden', '');

  lista.forEach((mov) => {
    const catInfo = obtenerCategoriaPorId(mov.categoria) || {
      nombre: mov.categoria,
      icono: '📌',
      color: '#64748B'
    };
    const esIngreso = mov.tipo === 'ingreso';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <span class="badge-tipo ${esIngreso ? 'badge-tipo-ingreso' : 'badge-tipo-gasto'}">
          ${esIngreso ? 'Ingreso' : 'Gasto'}
        </span>
      </td>
      <td><strong>${mov.descripcion}</strong></td>
      <td>
        <span class="badge-categoria">
          <span aria-hidden="true">${catInfo.icono}</span> ${catInfo.nombre}
        </span>
      </td>
      <td>${formatearFecha(mov.fecha)}</td>
      <td class="texto-derecha monto-celda ${esIngreso ? 'valor-ingreso' : 'valor-gasto'}">
        <strong>${esIngreso ? '+' : '-'}${formatearMoneda(mov.monto)}</strong>
      </td>
      <td class="texto-centro">
        <div class="acciones-celda">
          <button type="button" class="boton-icono boton-editar" data-id="${mov.id}" title="Editar movimiento">
            ✏️
          </button>
          <button type="button" class="boton-icono boton-eliminar" data-id="${mov.id}" title="Eliminar movimiento">
            🗑️
          </button>
        </div>
      </td>
    `;
    cuerpoTablaMovimientos.appendChild(tr);
  });
}

// ==========================================================================
// Paso 6: Manejo del Formulario de Alta
// ==========================================================================
function manejarSubmitAlta(e) {
  e.preventDefault();
  mensajeFormulario.setAttribute('hidden', '');
  mensajeFormulario.innerHTML = '';

  const tipoSeleccionado = document.querySelector('input[name="tipo-movimiento"]:checked')?.value || 'gasto';
  const datos = {
    tipo: tipoSeleccionado,
    monto: inputMonto.value,
    categoria: selectCategoria.value,
    fecha: inputFecha.value,
    descripcion: inputDescripcion.value
  };

  const validacion = validarMovimiento(datos);
  if (!validacion.esValido) {
    mensajeFormulario.className = 'mensaje-alerta error';
    mensajeFormulario.innerHTML = validacion.errores.map((err) => `<p>• ${err}</p>`).join('');
    mensajeFormulario.removeAttribute('hidden');
    return;
  }

  try {
    movimientos = crearMovimiento(movimientos, datos);
    guardarMovimientos(movimientos);

    // Limpiar formulario
    formularioMovimiento.reset();
    inputFecha.value = obtenerFechaHoyISO();
    poblarSelectCategorias(selectCategoria, 'gasto');

    mensajeFormulario.className = 'mensaje-alerta exito';
    mensajeFormulario.textContent = '¡Movimiento guardado con éxito!';
    mensajeFormulario.removeAttribute('hidden');

    setTimeout(() => {
      mensajeFormulario.setAttribute('hidden', '');
      cambiarVista('dashboard');
      renderizarDashboard();
    }, 700);
  } catch (error) {
    mensajeFormulario.className = 'mensaje-alerta error';
    mensajeFormulario.textContent = error.message;
    mensajeFormulario.removeAttribute('hidden');
  }
}

// ==========================================================================
// Paso 11: Edición con Modal <dialog>
// ==========================================================================
function abrirModalEdicion(id) {
  const mov = movimientos.find((m) => m.id === id);
  if (!mov) return;

  mensajeModalEditar.setAttribute('hidden', '');
  editarId.value = mov.id;
  editarTipo.value = mov.tipo;
  poblarSelectCategorias(editarCategoria, mov.tipo, false);
  editarCategoria.value = mov.categoria;
  editarMonto.value = mov.monto;
  editarFecha.value = mov.fecha;
  editarDescripcion.value = mov.descripcion;

  modalEditar.showModal();
}

function manejarSubmitEdicion(e) {
  e.preventDefault();
  mensajeModalEditar.setAttribute('hidden', '');

  const id = editarId.value;
  const datosActualizados = {
    tipo: editarTipo.value,
    monto: editarMonto.value,
    categoria: editarCategoria.value,
    fecha: editarFecha.value,
    descripcion: editarDescripcion.value
  };

  const validacion = validarMovimiento(datosActualizados);
  if (!validacion.esValido) {
    mensajeModalEditar.className = 'mensaje-alerta error';
    mensajeModalEditar.innerHTML = validacion.errores.map((err) => `<p>• ${err}</p>`).join('');
    mensajeModalEditar.removeAttribute('hidden');
    return;
  }

  try {
    movimientos = actualizarMovimiento(movimientos, id, datosActualizados);
    guardarMovimientos(movimientos);
    modalEditar.close();
    renderizarDashboard();
    aplicarFiltrosYRenderizar();
  } catch (error) {
    mensajeModalEditar.className = 'mensaje-alerta error';
    mensajeModalEditar.textContent = error.message;
    mensajeModalEditar.removeAttribute('hidden');
  }
}

// ==========================================================================
// Paso 12: Eliminación con Modal <dialog>
// ==========================================================================
function abrirModalEliminar(id) {
  const mov = movimientos.find((m) => m.id === id);
  if (!mov) return;

  idMovimientoAEliminar = id;
  const esIngreso = mov.tipo === 'ingreso';
  eliminarDetalleMovimiento.innerHTML = `
    <strong>${mov.descripcion}</strong><br>
    Fecha: ${formatearFecha(mov.fecha)} | Importe: ${esIngreso ? '+' : '-'}${formatearMoneda(mov.monto)}
  `;

  modalEliminar.showModal();
}

function confirmarEliminar() {
  if (!idMovimientoAEliminar) return;

  movimientos = eliminarMovimiento(movimientos, idMovimientoAEliminar);
  guardarMovimientos(movimientos);
  idMovimientoAEliminar = null;

  modalEliminar.close();
  renderizarDashboard();
  aplicarFiltrosYRenderizar();
}

// ==========================================================================
// Event Listeners y Arranque
// ==========================================================================
function inicializarEventos() {
  // Navegación
  botonesNav.forEach((btn) => {
    btn.addEventListener('click', () => {
      const panel = btn.getAttribute('data-panel');
      cambiarVista(panel);
    });
  });

  if (botonIrNuevo) botonIrNuevo.addEventListener('click', () => cambiarVista('nuevo'));
  if (botonVerTodos) botonVerTodos.addEventListener('click', () => cambiarVista('movimientos'));
  if (botonCancelarFormulario) botonCancelarFormulario.addEventListener('click', () => cambiarVista('dashboard'));

  // Cambio de tipo en formulario de alta (Gasto / Ingreso)
  radiosTipo.forEach((radio) => {
    radio.addEventListener('change', (e) => {
      poblarSelectCategorias(selectCategoria, e.target.value);
    });
  });

  // Cambio de tipo en formulario de edición
  editarTipo.addEventListener('change', (e) => {
    poblarSelectCategorias(editarCategoria, e.target.value, false);
  });

  // Envío del formulario de alta
  formularioMovimiento.addEventListener('submit', manejarSubmitAlta);

  // Envío del formulario de edición
  formularioEditar.addEventListener('submit', manejarSubmitEdicion);
  if (botonCancelarEditar) botonCancelarEditar.addEventListener('click', () => modalEditar.close());
  if (botonCerrarModalX) botonCerrarModalX.addEventListener('click', () => modalEditar.close());

  // Confirmación de eliminación
  botonConfirmarEliminar.addEventListener('click', confirmarEliminar);
  if (botonCancelarEliminar) botonCancelarEliminar.addEventListener('click', () => modalEliminar.close());

  // Delegación de eventos para botones de tabla (Editar y Eliminar)
  cuerpoTablaMovimientos.addEventListener('click', (e) => {
    const btnEditar = e.target.closest('.boton-editar');
    if (btnEditar) {
      const id = btnEditar.getAttribute('data-id');
      abrirModalEdicion(id);
      return;
    }

    const btnEliminar = e.target.closest('.boton-eliminar');
    if (btnEliminar) {
      const id = btnEliminar.getAttribute('data-id');
      abrirModalEliminar(id);
      return;
    }
  });

  // Filtros de búsqueda
  filtroBusqueda.addEventListener('input', aplicarFiltrosYRenderizar);
  filtroTipo.addEventListener('change', aplicarFiltrosYRenderizar);
  filtroCategoria.addEventListener('change', aplicarFiltrosYRenderizar);
  filtroOrden.addEventListener('change', aplicarFiltrosYRenderizar);

  botonLimpiarFiltros.addEventListener('click', () => {
    filtroBusqueda.value = '';
    filtroTipo.value = 'todos';
    filtroCategoria.value = 'todas';
    filtroOrden.value = 'fecha-desc';
    aplicarFiltrosYRenderizar();
  });
}

// Inicialización de la aplicación
function iniciarApp() {
  // Establecer fecha de hoy en el encabezado
  if (fechaHoyTexto) {
    const opcionesFecha = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    fechaHoyTexto.textContent = new Date().toLocaleDateString('es-AR', opcionesFecha);
  }

  // Precargar fecha actual en el campo de fecha de alta
  if (inputFecha) {
    inputFecha.value = obtenerFechaHoyISO();
  }

  // Cargar datos desde localStorage (o iniciales)
  movimientos = obtenerMovimientos();

  // Inicializar selectores de categorías
  poblarSelectCategorias(selectCategoria, 'gasto');
  inicializarCategoriasFiltro();

  // Conectar eventos del DOM
  inicializarEventos();

  // Renderizar vistas iniciales
  renderizarDashboard();
  aplicarFiltrosYRenderizar();
}

// Iniciar al cargar el DOM
document.addEventListener('DOMContentLoaded', iniciarApp);
