const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');

/**
 * Crea pedidos a partir de frecuencias
 * - Semanal: crea pedidos basados en el día de la semana (dia1: 1=lunes, 7=domingo)
 * - Quincenal: igual que semanal pero cada 2 semanas (semana 1 = fecha de creación del pedido)
 * - Tressemanas: igual pero cada 3 semanas
 * - Grupos: valida pedidos con grupo_id y crea pedidos según la frecuencia del grupo
 * 
 * Por ahora solo lista los pedidos a crear en JSON (sin crearlos)
 */
module.exports.main = async (event) => {
    let client;

    try {
        client = await poolConection.connect();

        // Configurar zona horaria
        await client.query("SET TIME ZONE 'America/Bogota'");

        const pedidosACrear = {
            semanal: [],
            quincenal: [],
            tressemanas: [],
            grupos: [],
            mensual: []
        };

        // Obtener fecha actual
        const { rows: fechaActual } = await client.query("SELECT CURRENT_DATE as fecha, EXTRACT(ISODOW FROM CURRENT_DATE) as dia_semana");
        const fechaHoy = fechaActual[0].fecha;
        const diaSemanaActual = parseInt(fechaActual[0].dia_semana); // 1=lunes, 7=domingo (ISODOW)

        // Ajustar para que 1=lunes, 7=domingo (ISODOW ya da 1=lunes, 7=domingo)
        const diaSemanaActualAjustado = diaSemanaActual === 0 ? 7 : diaSemanaActual;

        // Convertir fechaHoy a string en formato YYYY-MM-DD
        const fechaHoyString = fechaHoy instanceof Date
            ? fechaHoy.toISOString().split('T')[0]
            : String(fechaHoy).split('T')[0];

        console.log(`Fecha actual: ${fechaHoyString}, Día de la semana: ${diaSemanaActualAjustado} (1=Lunes, 7=Domingo)`);

        // ============================================
        // 1. PROCESAR FRECUENCIA SEMANAL
        // ============================================
        // Primero obtener todos los pedidos hijos existentes para la fecha de hoy
        const GET_PEDIDOS_HIJOS_HOY = `
      SELECT DISTINCT pedidoPadre 
      FROM pedidos 
      WHERE pedidoPadre IS NOT NULL
        AND fechaSolicitud IS NOT NULL
        AND (fechaSolicitud LIKE $1 || '%' OR fechaSolicitud LIKE '%' || $1)
    `;

        const fechaHoyFormato = fechaHoyString;
        const { rows: pedidosHijosHoy } = await client.query(GET_PEDIDOS_HIJOS_HOY, [fechaHoyFormato]);

        // También buscar por formato DD/MM/YYYY
        const fechaHoyDDMMYYYY = fechaHoyString.split('-').reverse().join('/');
        const { rows: pedidosHijosHoy2 } = await client.query(GET_PEDIDOS_HIJOS_HOY, [fechaHoyDDMMYYYY]);

        // Combinar ambos resultados
        const todosPedidosHijos = [...pedidosHijosHoy, ...pedidosHijosHoy2];
        const pedidosPadresExcluidos = new Set(todosPedidosHijos.map(p => p.pedidopadre));

        const GET_PEDIDOS_SEMANAL = `
      SELECT 
        p._id,
        p.forma,
        p.cantidadKl,
        p.cantidadPrecio,
        p.frecuencia,
        p.dia1,
        p.dia2,
        p.usuarioId,
        p.usuarioCrea,
        p.puntoId,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioId
      WHERE p.frecuencia = 'semanal'
        AND p.dia1 = $1
        AND p.eliminado = FALSE
    `;

        const { rows: pedidosSemanal } = await client.query(GET_PEDIDOS_SEMANAL, [diaSemanaActualAjustado]);

        pedidosSemanal.forEach(pedido => {
            // Filtrar pedidos que ya tienen un hijo para hoy
            if (pedidosPadresExcluidos.has(pedido._id)) {
                return;
            }

            pedidosACrear.semanal.push({
                pedidoPadre: pedido._id,
                forma: pedido.forma,
                cantidadKl: pedido.cantidadKl,
                cantidadPrecio: pedido.cantidadPrecio,
                frecuencia: pedido.frecuencia,
                dia1: pedido.dia1,
                dia2: pedido.dia2,
                usuarioId: pedido.usuarioId,
                usuarioCrea: pedido.usuarioCrea,
                puntoId: pedido.puntoId,
                valorUnitario: pedido.valorunitario,
                observacion: pedido.observacion,
                grupo_id: pedido.grupo_id,
                fechaSolicitud: fechaHoy,
                fechaCreacionOriginal: pedido.creado
            });
        });

        // ============================================
        // 2. PROCESAR FRECUENCIA QUINCENAL (cada 2 semanas)
        // ============================================
        const GET_PEDIDOS_QUINCENAL = `
      SELECT 
        p._id,
        p.forma,
        p.cantidadKl,
        p.cantidadPrecio,
        p.frecuencia,
        p.dia1,
        p.dia2,
        p.usuarioId,
        p.usuarioCrea,
        p.puntoId,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioId
      WHERE p.frecuencia = 'quincenal'
        AND p.dia1 = $1
        AND p.eliminado = FALSE
        AND p._id NOT IN (
          SELECT p2.pedidoPadre 
          FROM pedidos p2 
          WHERE p2.pedidoPadre IS NOT NULL
            AND p2.fechaSolicitud IS NOT NULL
        )
    `;

        const { rows: pedidosQuincenal } = await client.query(GET_PEDIDOS_QUINCENAL, [diaSemanaActualAjustado]);

        pedidosQuincenal.forEach(pedido => {
            // Filtrar pedidos que ya tienen un hijo para hoy
            if (pedidosPadresExcluidos.has(pedido._id)) {
                return;
            }
            // Calcular semanas desde la creación
            // El campo creado viene como TIMESTAMP de PostgreSQL, manejarlo correctamente
            let fechaCreacion;
            try {
                fechaCreacion = pedido.creado instanceof Date ? pedido.creado : new Date(pedido.creado);
                if (isNaN(fechaCreacion.getTime())) {
                    // Si falla el parseo, saltar este pedido
                    console.warn(`Fecha de creación inválida para pedido ${pedido._id}: ${pedido.creado}`);
                    return;
                }
            } catch (e) {
                console.warn(`Error al parsear fecha de creación para pedido ${pedido._id}: ${pedido.creado}`, e);
                return;
            }

            const fechaHoyDate = new Date(fechaHoy);
            const diffTime = fechaHoyDate - fechaCreacion;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDays / 7);

            // Solo crear si han pasado múltiplos de 2 semanas (2, 4, 6, etc.)
            // La semana 1 es cuando se creó el pedido (semana 0), así que empezamos desde semana 2
            // Verificar que sea exactamente un múltiplo de 2 semanas y que hayan pasado al menos 2 semanas
            if (diffWeeks >= 2 && diffWeeks % 2 === 0) {
                pedidosACrear.quincenal.push({
                    pedidoPadre: pedido._id,
                    forma: pedido.forma,
                    cantidadKl: pedido.cantidadKl,
                    cantidadPrecio: pedido.cantidadPrecio,
                    frecuencia: pedido.frecuencia,
                    dia1: pedido.dia1,
                    dia2: pedido.dia2,
                    usuarioId: pedido.usuarioId,
                    usuarioCrea: pedido.usuarioCrea,
                    puntoId: pedido.puntoId,
                    valorUnitario: pedido.valorunitario,
                    observacion: pedido.observacion,
                    grupo_id: pedido.grupo_id,
                    fechaSolicitud: fechaHoy,
                    fechaCreacionOriginal: pedido.creado,
                    semanasDesdeCreacion: diffWeeks
                });
            }
        });

        // ============================================
        // 3. PROCESAR FRECUENCIA TRESSEMANAS (cada 3 semanas)
        // ============================================
        const GET_PEDIDOS_TRESSEMANAS = `
      SELECT 
        p._id,
        p.forma,
        p.cantidadKl,
        p.cantidadPrecio,
        p.frecuencia,
        p.dia1,
        p.dia2,
        p.usuarioId,
        p.usuarioCrea,
        p.puntoId,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioId
      WHERE p.frecuencia = 'tressemanas'
        AND p.dia1 = $1
        AND p.eliminado = FALSE
        AND p._id NOT IN (
          SELECT p2.pedidoPadre 
          FROM pedidos p2 
          WHERE p2.pedidoPadre IS NOT NULL
            AND p2.fechaSolicitud IS NOT NULL
        )
    `;

        const { rows: pedidosTressemanas } = await client.query(GET_PEDIDOS_TRESSEMANAS, [diaSemanaActualAjustado]);

        pedidosTressemanas.forEach(pedido => {
            // Filtrar pedidos que ya tienen un hijo para hoy
            if (pedidosPadresExcluidos.has(pedido._id)) {
                return;
            }
            // Calcular semanas desde la creación
            let fechaCreacion;
            try {
                fechaCreacion = pedido.creado instanceof Date ? pedido.creado : new Date(pedido.creado);
                if (isNaN(fechaCreacion.getTime())) {
                    console.warn(`Fecha de creación inválida para pedido ${pedido._id}: ${pedido.creado}`);
                    return;
                }
            } catch (e) {
                console.warn(`Error al parsear fecha de creación para pedido ${pedido._id}: ${pedido.creado}`, e);
                return;
            }

            const fechaHoyDate = new Date(fechaHoy);
            const diffTime = fechaHoyDate - fechaCreacion;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDays / 7);

            // Solo crear si han pasado múltiplos de 3 semanas (3, 6, 9, etc.)
            // La semana 1 es cuando se creó el pedido (semana 0), así que empezamos desde semana 3
            // Verificar que sea exactamente un múltiplo de 3 semanas y que hayan pasado al menos 3 semanas
            if (diffWeeks >= 3 && diffWeeks % 3 === 0) {
                pedidosACrear.tressemanas.push({
                    pedidoPadre: pedido._id,
                    forma: pedido.forma,
                    cantidadKl: pedido.cantidadKl,
                    cantidadPrecio: pedido.cantidadPrecio,
                    frecuencia: pedido.frecuencia,
                    dia1: pedido.dia1,
                    dia2: pedido.dia2,
                    usuarioId: pedido.usuarioId,
                    usuarioCrea: pedido.usuarioCrea,
                    puntoId: pedido.puntoId,
                    valorUnitario: pedido.valorunitario,
                    observacion: pedido.observacion,
                    grupo_id: pedido.grupo_id,
                    fechaSolicitud: fechaHoy,
                    fechaCreacionOriginal: pedido.creado,
                    semanasDesdeCreacion: diffWeeks
                });
            }
        });

        // ============================================
        // 4. PROCESAR FRECUENCIA MENSUAL
        // ============================================
        const { rows: fechaInfo } = await client.query("SELECT EXTRACT(DAY FROM CURRENT_DATE)::INTEGER as dia_mes");
        const diaMesActual = parseInt(fechaInfo[0].dia_mes);

        const GET_PEDIDOS_MENSUAL = `
      SELECT 
        p._id,
        p.forma,
        p.cantidadKl,
        p.cantidadPrecio,
        p.frecuencia,
        p.dia1,
        p.dia2,
        p.usuarioId,
        p.usuarioCrea,
        p.puntoId,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioId
      WHERE p.frecuencia = 'mensual'
        AND p.dia1 = $1
        AND p.eliminado = FALSE
        AND p._id NOT IN (
          SELECT p2.pedidoPadre 
          FROM pedidos p2 
          WHERE p2.pedidoPadre IS NOT NULL
            AND p2.fechaSolicitud IS NOT NULL
        )
    `;

        const { rows: pedidosMensual } = await client.query(GET_PEDIDOS_MENSUAL, [diaMesActual]);

        pedidosMensual.forEach(pedido => {
            // Filtrar pedidos que ya tienen un hijo para hoy
            if (pedidosPadresExcluidos.has(pedido._id)) {
                return;
            }
            pedidosACrear.mensual.push({
                pedidoPadre: pedido._id,
                forma: pedido.forma,
                cantidadKl: pedido.cantidadKl,
                cantidadPrecio: pedido.cantidadPrecio,
                frecuencia: pedido.frecuencia,
                dia1: pedido.dia1, // Día del mes
                dia2: pedido.dia2, // Día de la semana
                usuarioId: pedido.usuarioId,
                usuarioCrea: pedido.usuarioCrea,
                puntoId: pedido.puntoId,
                valorUnitario: pedido.valorunitario,
                observacion: pedido.observacion,
                grupo_id: pedido.grupo_id,
                fechaSolicitud: fechaHoy,
                fechaCreacionOriginal: pedido.creado
            });
        });

        // ============================================
        // 5. PROCESAR GRUPOS DE FRECUENCIAS
        // ============================================
        const GET_PEDIDOS_CON_GRUPO = `
      SELECT 
        p._id,
        p.forma,
        p.cantidadKl,
        p.cantidadPrecio,
        p.usuarioId,
        p.usuarioCrea,
        p.puntoId,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario,
        g.tipo_frecuencia,
        g.dia_semana,
        g.intervalo_semanas,
        g.dia_mes,
        g.dia_semana_mensual
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioId
      JOIN grupos_frecuencias g ON g._id = p.grupo_id
      WHERE p.grupo_id IS NOT NULL
        AND p.eliminado = FALSE
        AND g.eliminado = FALSE
    `;

        const { rows: pedidosConGrupo } = await client.query(GET_PEDIDOS_CON_GRUPO, []);

        pedidosConGrupo.forEach(pedido => {
            // Filtrar pedidos que ya tienen un hijo para hoy
            if (pedidosPadresExcluidos.has(pedido._id)) {
                return;
            }
            const tipoFrecuencia = pedido.tipo_frecuencia;
            let debeCrear = false;
            let semanasDesdeCreacion = 0;

            if (tipoFrecuencia === 'semanal') {
                // Para semanal: verificar si el día de la semana coincide
                if (pedido.dia_semana === diaSemanaActualAjustado) {
                    // Si tiene intervalo_semanas, verificar que hayan pasado las semanas correctas
                    if (pedido.intervalo_semanas === 1) {
                        debeCrear = true;
                    } else {
                        let fechaCreacion;
                        try {
                            fechaCreacion = pedido.creado instanceof Date ? pedido.creado : new Date(pedido.creado);
                            if (isNaN(fechaCreacion.getTime())) {
                                console.warn(`Fecha de creación inválida para pedido ${pedido._id}: ${pedido.creado}`);
                                return;
                            }
                        } catch (e) {
                            console.warn(`Error al parsear fecha de creación para pedido ${pedido._id}: ${pedido.creado}`, e);
                            return;
                        }

                        const fechaHoyDate = new Date(fechaHoy);
                        const diffTime = fechaHoyDate - fechaCreacion;
                        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                        semanasDesdeCreacion = Math.floor(diffDays / 7);

                        // Verificar que hayan pasado al menos el número de semanas del intervalo
                        // y que sea exactamente un múltiplo de ese intervalo
                        if (semanasDesdeCreacion >= pedido.intervalo_semanas &&
                            semanasDesdeCreacion % pedido.intervalo_semanas === 0) {
                            debeCrear = true;
                        }
                    }
                }
            } else if (tipoFrecuencia === 'mensual') {
                // Para mensual: verificar si el día del mes coincide
                if (pedido.dia_mes === diaMesActual) {
                    debeCrear = true;
                }
            }

            if (debeCrear) {
                // Determinar frecuencia final basada en intervalo_semanas
                let frecuenciaFinal = tipoFrecuencia;
                if (tipoFrecuencia === 'semanal' && pedido.intervalo_semanas) {
                    if (pedido.intervalo_semanas === 2) {
                        frecuenciaFinal = 'quincenal';
                    } else if (pedido.intervalo_semanas === 3) {
                        frecuenciaFinal = 'tressemanas';
                    }
                }

                pedidosACrear.grupos.push({
                    pedidoPadre: pedido._id,
                    forma: pedido.forma,
                    cantidadKl: pedido.cantidadKl,
                    cantidadPrecio: pedido.cantidadPrecio,
                    frecuencia: frecuenciaFinal,
                    dia1: tipoFrecuencia === 'semanal' ? pedido.dia_semana : pedido.dia_mes,
                    dia2: tipoFrecuencia === 'mensual' ? pedido.dia_semana_mensual : null,
                    usuarioId: pedido.usuarioId,
                    usuarioCrea: pedido.usuarioCrea,
                    puntoId: pedido.puntoId,
                    valorUnitario: pedido.valorunitario,
                    observacion: pedido.observacion,
                    grupo_id: pedido.grupo_id,
                    fechaSolicitud: fechaHoy,
                    fechaCreacionOriginal: pedido.creado,
                    semanasDesdeCreacion: semanasDesdeCreacion > 0 ? semanasDesdeCreacion : null,
                    tipoFrecuenciaGrupo: tipoFrecuencia,
                    intervalo_semanas: pedido.intervalo_semanas
                });
            }
        });

        // ============================================
        // RESUMEN Y RESPUESTA
        // ============================================
        const totalPedidos =
            pedidosACrear.semanal.length +
            pedidosACrear.quincenal.length +
            pedidosACrear.tressemanas.length +
            pedidosACrear.mensual.length +
            pedidosACrear.grupos.length;

        return {
            status: true,
            fecha: fechaHoy,
            diaSemana: diaSemanaActualAjustado,
            diaMes: diaMesActual,
            resumen: {
                semanal: pedidosACrear.semanal.length,
                quincenal: pedidosACrear.quincenal.length,
                tressemanas: pedidosACrear.tressemanas.length,
                mensual: pedidosACrear.mensual.length,
                grupos: pedidosACrear.grupos.length,
                total: totalPedidos
            },
            pedidosACrear: pedidosACrear
        };

    } catch (error) {
        console.error('Error al procesar frecuencias:', error);
        throw new DatabaseError(error);
    } finally {
        if (client) {
            client.release();
        }
    }
};

