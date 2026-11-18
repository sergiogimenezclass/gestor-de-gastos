/**
 * Módulo de búsqueda, filtrado concurrente y ordenamiento de movimientos.
 */

/**
 * Normaliza un texto removiendo acentos y convirtiendo a minúsculas.
 * @param {string} str
 * @returns {string}
 */
export function normalizarTexto(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Filtra y ordena una lista de movimientos según criterios concurrentes.
 *
 * @param {Array} movimientos
 * @param {Object} opciones
 * @param {string} [opciones.busqueda] Texto a buscar en la descripción
 * @param {string} [opciones.tipo] 'todos' | 'ingreso' | 'gasto'
 * @param {string} [opciones.categoria] ID de la categoría o 'todas'
 * @param {string} [opciones.orden] 'fecha-desc' | 'fecha-asc' | 'monto-desc' | 'monto-asc'
 * @returns {Array} Lista filtrada y ordenada
 */
export function filtrarMovimientos(movimientos = [], opciones = {}) {
  const {
    busqueda = '',
    tipo = 'todos',
    categoria = 'todas',
    orden = 'fecha-desc'
  } = opciones;

  const busquedaNorm = normalizarTexto(busqueda);

  // 1. Filtrado concurrente
  const resultado = movimientos.filter((mov) => {
    // Filtro por tipo
    if (tipo && tipo !== 'todos' && mov.tipo !== tipo) {
      return false;
    }

    // Filtro por categoría
    if (categoria && categoria !== 'todas' && mov.categoria !== categoria) {
      return false;
    }

    // Filtro por búsqueda de texto en descripción
    if (busquedaNorm) {
      const descNorm = normalizarTexto(mov.descripcion);
      if (!descNorm.includes(busquedaNorm)) {
        return false;
      }
    }

    return true;
  });

  // 2. Ordenamiento
  resultado.sort((a, b) => {
    switch (orden) {
      case 'fecha-asc':
        return new Date(a.fecha) - new Date(b.fecha);

      case 'monto-desc':
        return Number(b.monto) - Number(a.monto);

      case 'monto-asc':
        return Number(a.monto) - Number(b.monto);

      case 'fecha-desc':
      default:
        return new Date(b.fecha) - new Date(a.fecha);
    }
  });

  return resultado;
}
