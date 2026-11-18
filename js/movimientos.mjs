/**
 * Módulo de validación y lógica CRUD pura de movimientos.
 */

/**
 * Valida los datos de un movimiento antes de crearlo o actualizarlo.
 * @param {Object} datos
 * @returns {{ esValido: boolean, errores: string[] }}
 */
export function validarMovimiento(datos = {}) {
  const errores = [];
  const { tipo, monto, categoria, fecha, descripcion } = datos;

  // 1. Tipo
  if (tipo !== 'ingreso' && tipo !== 'gasto') {
    errores.push('El tipo de movimiento debe ser "ingreso" o "gasto".');
  }

  // 2. Monto
  const montoNumerico = Number(monto);
  if (isNaN(montoNumerico) || montoNumerico <= 0) {
    errores.push('El importe debe ser un número mayor a 0.');
  }

  // 3. Categoría
  if (!categoria || typeof categoria !== 'string' || categoria.trim() === '') {
    errores.push('Debes seleccionar una categoría.');
  }

  // 4. Fecha
  const formatoFechaRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!fecha || !formatoFechaRegex.test(fecha)) {
    errores.push('La fecha debe tener un formato válido (AAAA-MM-DD).');
  } else {
    // Validar que no sea fecha futura
    const fechaIngresada = new Date(`${fecha}T00:00:00`);
    const hoy = new Date();
    hoy.setHours(23, 59, 59, 999);

    if (isNaN(fechaIngresada.getTime())) {
      errores.push('La fecha ingresada no es válida.');
    } else if (fechaIngresada > hoy) {
      errores.push('La fecha no puede ser posterior a hoy.');
    }
  }

  // 5. Descripción
  const descLimpia = (descripcion || '').trim();
  if (descLimpia.length < 3 || descLimpia.length > 60) {
    errores.push('La descripción debe tener entre 3 y 60 caracteres.');
  }

  return {
    esValido: errores.length === 0,
    errores
  };
}

/**
 * Genera un identificador único correlativo con timestamp.
 * @returns {string}
 */
export function generarIdMovimiento() {
  return `MOV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/**
 * Agrega un nuevo movimiento al inicio de la lista.
 * Lanza un error si los datos no son válidos.
 * @param {Array} movimientos
 * @param {Object} nuevoDato
 * @returns {Array} Nuevo array con el movimiento insertado al inicio
 */
export function crearMovimiento(movimientos = [], nuevoDato = {}) {
  const validacion = validarMovimiento(nuevoDato);
  if (!validacion.esValido) {
    throw new Error(validacion.errores.join(' '));
  }

  const nuevoMovimiento = {
    id: nuevoDato.id || generarIdMovimiento(),
    tipo: nuevoDato.tipo,
    monto: Number(nuevoDato.monto),
    categoria: nuevoDato.categoria.trim(),
    fecha: nuevoDato.fecha,
    descripcion: nuevoDato.descripcion.trim(),
    creadoEn: nuevoDato.creadoEn || new Date().toISOString()
  };

  return [nuevoMovimiento, ...movimientos];
}

/**
 * Actualiza los campos de un movimiento existente por su ID.
 * @param {Array} movimientos
 * @param {string} id
 * @param {Object} datosActualizados
 * @returns {Array} Nuevo array con el elemento modificado
 */
export function actualizarMovimiento(movimientos = [], id, datosActualizados = {}) {
  const indice = movimientos.findIndex((m) => m.id === id);
  if (indice === -1) {
    return [...movimientos];
  }

  const datosCompletos = {
    ...movimientos[indice],
    ...datosActualizados,
    id // El ID original no se altera
  };

  const validacion = validarMovimiento(datosCompletos);
  if (!validacion.esValido) {
    throw new Error(validacion.errores.join(' '));
  }

  const copia = [...movimientos];
  copia[indice] = {
    ...datosCompletos,
    monto: Number(datosCompletos.monto),
    descripcion: datosCompletos.descripcion.trim(),
    categoria: datosCompletos.categoria.trim()
  };

  return copia;
}

/**
 * Elimina un movimiento según su ID.
 * @param {Array} movimientos
 * @param {string} id
 * @returns {Array} Nuevo array sin el movimiento indicado
 */
export function eliminarMovimiento(movimientos = [], id) {
  return movimientos.filter((mov) => mov.id !== id);
}
