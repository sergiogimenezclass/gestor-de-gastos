/**
 * Catálogo de categorías disponibles para ingresos y gastos.
 */
export const CATEGORIAS = [
  // Categorías de Gastos
  {
    id: 'alimentacion',
    nombre: 'Alimentación',
    tipo: 'gasto',
    icono: '🛒',
    color: '#F59E0B'
  },
  {
    id: 'transporte',
    nombre: 'Transporte',
    tipo: 'gasto',
    icono: '🚌',
    color: '#3B82F6'
  },
  {
    id: 'vivienda',
    nombre: 'Vivienda y Alquiler',
    tipo: 'gasto',
    icono: '🏠',
    color: '#8B5CF6'
  },
  {
    id: 'servicios',
    nombre: 'Servicios e Impuestos',
    tipo: 'gasto',
    icono: '💡',
    color: '#06B6D4'
  },
  {
    id: 'salud',
    nombre: 'Salud y Farmacia',
    tipo: 'gasto',
    icono: '💊',
    color: '#EC4899'
  },
  {
    id: 'ocio',
    nombre: 'Ocio y Entretenimiento',
    tipo: 'gasto',
    icono: '🎬',
    color: '#10B981'
  },
  {
    id: 'educacion',
    nombre: 'Educación y Cursos',
    tipo: 'gasto',
    icono: '📚',
    color: '#6366F1'
  },
  {
    id: 'otros_gastos',
    nombre: 'Otros Gastos',
    tipo: 'gasto',
    icono: '📦',
    color: '#64748B'
  },

  // Categorías de Ingresos
  {
    id: 'sueldo',
    nombre: 'Sueldo / Salario',
    tipo: 'ingreso',
    icono: '💼',
    color: '#059669'
  },
  {
    id: 'honorarios',
    nombre: 'Honorarios / Freelance',
    tipo: 'ingreso',
    icono: '💻',
    color: '#10B981'
  },
  {
    id: 'ventas',
    nombre: 'Ventas de productos',
    tipo: 'ingreso',
    icono: '🛍️',
    color: '#34D399'
  },
  {
    id: 'inversiones',
    nombre: 'Rendimientos / Inversiones',
    tipo: 'ingreso',
    icono: '📈',
    color: '#14B8A6'
  },
  {
    id: 'otros_ingresos',
    nombre: 'Otros Ingresos',
    tipo: 'ingreso',
    icono: '🎁',
    color: '#0D9488'
  }
];

/**
 * Devuelve las categorías que coinciden con el tipo solicitado.
 * @param {'ingreso' | 'gasto'} tipo
 * @returns {Array}
 */
export function obtenerCategoriasPorTipo(tipo) {
  if (!tipo) return [...CATEGORIAS];
  return CATEGORIAS.filter((categoria) => categoria.tipo === tipo);
}

/**
 * Busca una categoría por su ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function obtenerCategoriaPorId(id) {
  return CATEGORIAS.find((categoria) => categoria.id === id) || null;
}
