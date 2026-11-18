/**
 * Módulo de almacenamiento y persistencia con localStorage.
 */

export const STORAGE_KEY = 'control_gastos_movimientos';

/**
 * Genera fecha actual o días cercanos en formato YYYY-MM-DD.
 */
function generarFechaMesActual(dia) {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const d = String(dia).padStart(2, '0');
  return `${anio}-${mes}-${d}`;
}

/**
 * Conjunto de movimientos de muestra precargados.
 */
export const MOVIMIENTOS_INICIALES = [
  {
    id: 'MOV-1001',
    tipo: 'ingreso',
    monto: 380000,
    categoria: 'sueldo',
    fecha: generarFechaMesActual(1),
    descripcion: 'Cobro de sueldo mensual',
    creadoEn: new Date().toISOString()
  },
  {
    id: 'MOV-1002',
    tipo: 'gasto',
    monto: 95000,
    categoria: 'vivienda',
    fecha: generarFechaMesActual(5),
    descripcion: 'Alquiler y expensas',
    creadoEn: new Date().toISOString()
  },
  {
    id: 'MOV-1003',
    tipo: 'gasto',
    monto: 42500,
    categoria: 'alimentacion',
    fecha: generarFechaMesActual(8),
    descripcion: 'Compras en supermercado',
    creadoEn: new Date().toISOString()
  },
  {
    id: 'MOV-1004',
    tipo: 'gasto',
    monto: 16800,
    categoria: 'servicios',
    fecha: generarFechaMesActual(10),
    descripcion: 'Facturas de luz e internet',
    creadoEn: new Date().toISOString()
  },
  {
    id: 'MOV-1005',
    tipo: 'ingreso',
    monto: 65000,
    categoria: 'honorarios',
    fecha: generarFechaMesActual(12),
    descripcion: 'Proyecto freelance de diseño',
    creadoEn: new Date().toISOString()
  },
  {
    id: 'MOV-1006',
    tipo: 'gasto',
    monto: 14200,
    categoria: 'transporte',
    fecha: generarFechaMesActual(14),
    descripcion: 'Carga de combustible y tarjeta SUBE',
    creadoEn: new Date().toISOString()
  },
  {
    id: 'MOV-1007',
    tipo: 'gasto',
    monto: 18500,
    categoria: 'ocio',
    fecha: generarFechaMesActual(16),
    descripcion: 'Cena con amigos y cine',
    creadoEn: new Date().toISOString()
  }
];

/**
 * Guarda el array de movimientos en localStorage.
 * @param {Array} movimientos
 */
export function guardarMovimientos(movimientos) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(movimientos));
    }
  } catch (error) {
    console.error('Error al guardar movimientos en localStorage:', error);
  }
}

/**
 * Obtiene los movimientos guardados en localStorage.
 * Si no existen, inicializa con los datos de muestra y los retorna.
 * @returns {Array}
 */
export function obtenerMovimientos() {
  try {
    if (typeof localStorage === 'undefined') {
      return [...MOVIMIENTOS_INICIALES];
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      guardarMovimientos(MOVIMIENTOS_INICIALES);
      return [...MOVIMIENTOS_INICIALES];
    }

    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.error('Error al recuperar movimientos de localStorage:', error);
    return [];
  }
}

/**
 * Restablece los datos de localStorage a los valores de muestra iniciales.
 * @returns {Array}
 */
export function restablecerMovimientos() {
  guardarMovimientos(MOVIMIENTOS_INICIALES);
  return [...MOVIMIENTOS_INICIALES];
}
