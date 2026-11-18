/**
 * Módulo de cálculos y estadísticas financieras para el Dashboard.
 */

/**
 * Calcula métricas financieras consolidadas para un período dado.
 * Si no se especifica anioMes, se toman todos los movimientos provistos.
 *
 * @param {Array} movimientos
 * @param {string} [anioMes] Formato 'AAAA-MM' (opcional)
 * @returns {{
 *   totalIngresos: number,
 *   totalGastos: number,
 *   balance: number,
 *   distribucionGastos: Array<{ categoria: string, monto: number, porcentaje: number }>
 * }}
 */
export function calcularResumenDashboard(movimientos = [], anioMes = '') {
  // Filtrar por período si se especifica (AAAA-MM)
  const movimientosFiltrados = anioMes
    ? movimientos.filter((m) => (m.fecha || '').startsWith(anioMes))
    : movimientos;

  let totalIngresos = 0;
  let totalGastos = 0;
  const gastosPorCategoria = {};

  for (const mov of movimientosFiltrados) {
    const monto = Number(mov.monto) || 0;

    if (mov.tipo === 'ingreso') {
      totalIngresos += monto;
    } else if (mov.tipo === 'gasto') {
      totalGastos += monto;
      const cat = mov.categoria || 'otros_gastos';
      gastosPorCategoria[cat] = (gastosPorCategoria[cat] || 0) + monto;
    }
  }

  // Redondeo a 2 decimales para evitar problemas de coma flotante
  totalIngresos = Math.round(totalIngresos * 100) / 100;
  totalGastos = Math.round(totalGastos * 100) / 100;
  const balance = Math.round((totalIngresos - totalGastos) * 100) / 100;

  // Calcular distribución y porcentaje sobre el total de gastos
  const distribucionGastos = Object.entries(gastosPorCategoria)
    .map(([categoria, monto]) => {
      const montoRedondeado = Math.round(monto * 100) / 100;
      const porcentaje =
        totalGastos > 0
          ? Math.round((montoRedondeado / totalGastos) * 1000) / 10
          : 0;

      return {
        categoria,
        monto: montoRedondeado,
        porcentaje
      };
    })
    .sort((a, b) => b.monto - a.monto);

  return {
    totalIngresos,
    totalGastos,
    balance,
    distribucionGastos
  };
}

/**
 * Obtiene las N transacciones más recientes ordenadas cronológicamente.
 * @param {Array} movimientos
 * @param {number} limite
 * @returns {Array}
 */
export function obtenerUltimosMovimientos(movimientos = [], limite = 5) {
  return [...movimientos]
    .sort((a, b) => {
      const fechaDiff = new Date(b.fecha) - new Date(a.fecha);
      if (fechaDiff !== 0) return fechaDiff;
      return (b.id || '').localeCompare(a.id || '');
    })
    .slice(0, limite);
}
