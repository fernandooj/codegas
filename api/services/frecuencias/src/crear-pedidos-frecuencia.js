const { poolConection } = require('../../../lib/connection-pg.js');
const DatabaseError = require('../../../lib/errors/database-error');
const { transporter, EMAIL_USER } = require('../../../lib/nodemailer-config');

const recipients = [
    'gestioncalidad@codegascolombia.com',
    'coord.logistica@codegascolombia.com',
    'gerencia@codegascolombia.com'
];

/**
 * Crea pedidos a partir de frecuencias
 * - Semanal: crea pedidos basados en el día de la semana (dia1: 1=lunes, 7=domingo)
 * - Quincenal: igual que semanal pero cada 2 semanas (semana 1 = fecha de creación del pedido)
 * - Tressemanas: igual pero cada 3 semanas
 * - Grupos: valida pedidos con grupo_id y crea pedidos según la frecuencia del grupo
 *   IMPORTANTE: Para grupos con intervalo_semanas > 1, se usa la fecha de creación del PEDIDO PADRE
 *   (no del grupo) para calcular cuándo crear los pedidos. Esto permite que cada pedido tenga su
 *   propia secuencia basada en cuándo se asignó al grupo.
 * 
 * NOTA: Este proceso se ejecuta a las 10 PM y crea pedidos para 2 días después.
 * Crea los pedidos en la base de datos y envía un correo con el reporte.
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

        // Obtener fecha actual y fecha de 2 días después (pedidos se crean para 2 días después)
        const { rows: fechaActual } = await client.query(`
            SELECT 
                CURRENT_DATE as fecha,
                CURRENT_DATE + INTERVAL '2 days' as fecha_dos_dias,
                EXTRACT(ISODOW FROM CURRENT_DATE) as dia_semana,
                EXTRACT(ISODOW FROM CURRENT_DATE + INTERVAL '2 days') as dia_semana_dos_dias,
                EXTRACT(DAY FROM CURRENT_DATE + INTERVAL '2 days')::INTEGER as dia_mes_dos_dias
        `);
        const fechaHoy = fechaActual[0].fecha;
        const fechaDosDias = fechaActual[0].fecha_dos_dias; // Fecha para la cual se crearán los pedidos
        const diaSemanaActual = parseInt(fechaActual[0].dia_semana); // 1=lunes, 7=domingo (ISODOW)
        const diaSemanaDosDias = parseInt(fechaActual[0].dia_semana_dos_dias); // Día de la semana en 2 días
        const diaMesDosDias = parseInt(fechaActual[0].dia_mes_dos_dias); // Día del mes en 2 días

        // Ajustar para que 1=lunes, 7=domingo (ISODOW ya da 1=lunes, 7=domingo)
        const diaSemanaActualAjustado = diaSemanaActual === 0 ? 7 : diaSemanaActual;
        const diaSemanaDosDiasAjustado = diaSemanaDosDias === 0 ? 7 : diaSemanaDosDias;

        // Convertir fechaDosDias a string en formato YYYY-MM-DD
        const fechaDosDiasString = fechaDosDias instanceof Date
            ? fechaDosDias.toISOString().split('T')[0]
            : String(fechaDosDias).split('T')[0];

        console.log(`[DEBUG] Fecha actual: ${fechaHoy}, Fecha objetivo (2 días después): ${fechaDosDiasString}, Día de la semana objetivo: ${diaSemanaDosDiasAjustado} (1=Lunes, 7=Domingo)`);

        // ============================================
        // 1. PROCESAR FRECUENCIA SEMANAL
        // ============================================

        const GET_PEDIDOS_SEMANAL = `
      SELECT 
        p._id,
        p.forma,
        p.cantidadkl,
        p.cantidadprecio,
        p.frecuencia,
        p.dia1,
        p.dia2,
        p.usuarioid,
        p.usuariocrea,
        p.puntoid,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioid
      WHERE p.frecuencia = 'semanal'
        AND p.dia1 = $1
        AND p.eliminado = FALSE
    `;

        const { rows: pedidosSemanal } = await client.query(GET_PEDIDOS_SEMANAL, [diaSemanaDosDiasAjustado]);

        pedidosSemanal.forEach(pedido => {

            pedidosACrear.semanal.push({
                pedidoPadre: pedido._id,
                forma: pedido.forma,
                cantidadkl: pedido.cantidadkl,
                cantidadprecio: pedido.cantidadprecio,
                frecuencia: pedido.frecuencia,
                dia1: pedido.dia1,
                dia2: pedido.dia2,
                usuarioid: pedido.usuarioid,
                usuariocrea: pedido.usuariocrea,
                puntoid: pedido.puntoid,
                valorunitario: pedido.valorunitario,
                observacion: pedido.observacion,
                grupo_id: pedido.grupo_id,
                fechaSolicitud: fechaDosDias, // Fecha de 2 días después
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
        p.cantidadkl,
        p.cantidadprecio,
        p.frecuencia,
        p.dia1,
        p.dia2,
        p.usuarioid,
        p.usuariocrea,
        p.puntoid,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioid
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

        const { rows: pedidosQuincenal } = await client.query(GET_PEDIDOS_QUINCENAL, [diaSemanaDosDiasAjustado]);

        pedidosQuincenal.forEach(pedido => {
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

            // Calcular semanas desde la creación del pedido hasta la fecha objetivo (2 días después)
            const fechaObjetivoDate = new Date(fechaDosDias);
            const diffTime = fechaObjetivoDate - fechaCreacion;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDays / 7);

            // Solo crear si han pasado múltiplos de 2 semanas (2, 4, 6, etc.)
            // La semana 1 es cuando se creó el pedido (semana 0), así que empezamos desde semana 2
            // Verificar que sea exactamente un múltiplo de 2 semanas y que hayan pasado al menos 2 semanas
            if (diffWeeks >= 2 && diffWeeks % 2 === 0) {
                pedidosACrear.quincenal.push({
                    pedidoPadre: pedido._id,
                    forma: pedido.forma,
                    cantidadkl: pedido.cantidadkl,
                    cantidadprecio: pedido.cantidadprecio,
                    frecuencia: pedido.frecuencia,
                    dia1: pedido.dia1,
                    dia2: pedido.dia2,
                    usuarioid: pedido.usuarioid,
                    usuariocrea: pedido.usuariocrea,
                    puntoid: pedido.puntoid,
                    valorunitario: pedido.valorunitario,
                    observacion: pedido.observacion,
                    grupo_id: pedido.grupo_id,
                    fechaSolicitud: fechaDosDias, // Fecha de 2 días después
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
        p.cantidadkl,
        p.cantidadprecio,
        p.frecuencia,
        p.dia1,
        p.dia2,
        p.usuarioid,
        p.usuariocrea,
        p.puntoid,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioid
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

        const { rows: pedidosTressemanas } = await client.query(GET_PEDIDOS_TRESSEMANAS, [diaSemanaDosDiasAjustado]);

        pedidosTressemanas.forEach(pedido => {
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

            // Calcular semanas desde la creación del pedido hasta la fecha objetivo (2 días después)
            const fechaObjetivoDate = new Date(fechaDosDias);
            const diffTime = fechaObjetivoDate - fechaCreacion;
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            const diffWeeks = Math.floor(diffDays / 7);

            // Solo crear si han pasado múltiplos de 3 semanas (3, 6, 9, etc.)
            // La semana 1 es cuando se creó el pedido (semana 0), así que empezamos desde semana 3
            // Verificar que sea exactamente un múltiplo de 3 semanas y que hayan pasado al menos 3 semanas
            if (diffWeeks >= 3 && diffWeeks % 3 === 0) {
                pedidosACrear.tressemanas.push({
                    pedidoPadre: pedido._id,
                    forma: pedido.forma,
                    cantidadkl: pedido.cantidadkl,
                    cantidadprecio: pedido.cantidadprecio,
                    frecuencia: pedido.frecuencia,
                    dia1: pedido.dia1,
                    dia2: pedido.dia2,
                    usuarioid: pedido.usuarioid,
                    usuariocrea: pedido.usuariocrea,
                    puntoid: pedido.puntoid,
                    valorunitario: pedido.valorunitario,
                    observacion: pedido.observacion,
                    grupo_id: pedido.grupo_id,
                    fechaSolicitud: fechaDosDias, // Fecha de 2 días después
                    fechaCreacionOriginal: pedido.creado,
                    semanasDesdeCreacion: diffWeeks
                });
            }
        });

        // ============================================
        // 4. PROCESAR FRECUENCIA MENSUAL
        // ============================================
        // Ya tenemos diaMesDosDias calculado arriba

        // Mensual individual: dia1 = día del mes, dia2 = día de la semana (1–7, igual que grupos.dia_semana_mensual).
        // Si dia2 es NULL (legado), solo se exige coincidir el día del mes.
        const GET_PEDIDOS_MENSUAL = `
      SELECT 
        p._id,
        p.forma,
        p.cantidadkl,
        p.cantidadprecio,
        p.frecuencia,
        p.dia1,
        p.dia2,
        p.usuarioid,
        p.usuariocrea,
        p.puntoid,
        p.creado,
        p.observacion,
        p.grupo_id,
        u.valorunitario
      FROM pedidos p
      JOIN users u ON u._id = p.usuarioid
      WHERE p.frecuencia = 'mensual'
        AND p.dia1 = $1
        AND (p.dia2 IS NULL OR p.dia2 = $2)
        AND p.eliminado = FALSE
        AND p._id NOT IN (
          SELECT p2.pedidoPadre 
          FROM pedidos p2 
          WHERE p2.pedidoPadre IS NOT NULL
            AND p2.fechaSolicitud IS NOT NULL
        )
    `;

        const { rows: pedidosMensual } = await client.query(GET_PEDIDOS_MENSUAL, [
            diaMesDosDias,
            diaSemanaDosDiasAjustado
        ]);

        pedidosMensual.forEach(pedido => {
            pedidosACrear.mensual.push({
                pedidoPadre: pedido._id,
                forma: pedido.forma,
                cantidadkl: pedido.cantidadkl,
                cantidadprecio: pedido.cantidadprecio,
                frecuencia: pedido.frecuencia,
                dia1: pedido.dia1, // Día del mes
                dia2: pedido.dia2, // Día de la semana
                usuarioid: pedido.usuarioid,
                usuariocrea: pedido.usuariocrea,
                puntoid: pedido.puntoid,
                valorunitario: pedido.valorunitario,
                observacion: pedido.observacion,
                grupo_id: pedido.grupo_id,
                fechaSolicitud: fechaDosDias, // Fecha de 2 días después
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
        p.cantidadkl,
        p.cantidadprecio,
        p.usuarioid,
        p.usuariocrea,
        p.puntoid,
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
      JOIN users u ON u._id = p.usuarioid
      JOIN grupos_frecuencias g ON g._id = p.grupo_id
      WHERE p.grupo_id IS NOT NULL
        AND p.eliminado = FALSE
        AND g.eliminado = FALSE
    `;

        const { rows: pedidosConGrupo } = await client.query(GET_PEDIDOS_CON_GRUPO, []);

        console.log(`[DEBUG] ==========================================`);
        console.log(`[DEBUG] PROCESANDO GRUPOS DE FRECUENCIAS`);
        console.log(`[DEBUG] Total pedidos con grupo: ${pedidosConGrupo.length}`);
        console.log(`[DEBUG] Fecha objetivo: ${fechaDosDiasString}, Día semana objetivo: ${diaSemanaDosDiasAjustado} (1=Lunes, 7=Domingo)`);
        console.log(`[DEBUG] ==========================================`);
        
        if (pedidosConGrupo.length > 0) {
            console.log(`[DEBUG] Primer pedido con grupo: ID=${pedidosConGrupo[0]._id}, tipo_frecuencia=${pedidosConGrupo[0].tipo_frecuencia}, dia_semana=${pedidosConGrupo[0].dia_semana}, intervalo_semanas=${pedidosConGrupo[0].intervalo_semanas}, creado=${pedidosConGrupo[0].creado}`);
        } else {
            console.log(`[DEBUG] ⚠️ NO SE ENCONTRARON PEDIDOS CON GRUPO`);
        }

        pedidosConGrupo.forEach(pedido => {
            const tipoFrecuencia = pedido.tipo_frecuencia;
            let debeCrear = false;
            let semanasDesdeCreacion = 0;

            console.log(`[DEBUG] Procesando pedido ${pedido._id}: tipo_frecuencia=${tipoFrecuencia}, dia_semana=${pedido.dia_semana}, intervalo_semanas=${pedido.intervalo_semanas}`);

            if (tipoFrecuencia === 'semanal') {
                // IMPORTANTE: El dia_semana del grupo es el día de ENTREGA, no de ejecución
                // La ejecución se hace 2 días antes, entonces verificamos si el día objetivo (2 días después = día de entrega)
                // coincide con el dia_semana del grupo
                console.log(`[DEBUG] Pedido ${pedido._id}: dia_semana grupo=${pedido.dia_semana}, diaSemanaDosDiasAjustado=${diaSemanaDosDiasAjustado}, intervalo=${pedido.intervalo_semanas}`);
                
                if (pedido.dia_semana === diaSemanaDosDiasAjustado) {
                    console.log(`[DEBUG] Día coincide para pedido ${pedido._id}`);
                    // Si tiene intervalo_semanas, verificar que hayan pasado las semanas correctas
                    if (pedido.intervalo_semanas === 1) {
                        // Cada semana: si el día de entrega coincide, se crea hoy (2 días antes)
                        console.log(`[DEBUG] Intervalo 1 semana - debe crear pedido ${pedido._id}`);
                        debeCrear = true;
                    } else {
                        // IMPORTANTE: Usar la fecha de creación del PEDIDO PADRE, no del grupo
                        let fechaCreacionPedido;
                        try {
                            // Parsear la fecha correctamente, manejando diferentes formatos de PostgreSQL
                            let fechaRaw = pedido.creado;
                            
                            // Si viene como Date, convertir a string primero
                            if (fechaRaw instanceof Date) {
                                fechaRaw = fechaRaw.toISOString();
                            }
                            
                            // Extraer solo la parte de fecha (YYYY-MM-DD) para evitar problemas de zona horaria
                            const fechaStr = String(fechaRaw).split('T')[0];
                            
                            // Crear fecha usando solo la parte de fecha, en UTC para evitar problemas de zona horaria
                            fechaCreacionPedido = new Date(fechaStr + 'T00:00:00.000Z');
                            
                            if (isNaN(fechaCreacionPedido.getTime())) {
                                console.warn(`Fecha de creación inválida para pedido ${pedido._id}: ${pedido.creado}`);
                                return;
                            }
                            
                            // Normalizar a medianoche UTC
                            fechaCreacionPedido.setUTCHours(0, 0, 0, 0);
                        } catch (e) {
                            console.warn(`Error al parsear fecha de creación para pedido ${pedido._id}: ${pedido.creado}`, e);
                            return;
                        }

                        // IMPORTANTE: El dia_semana del grupo es el día de ENTREGA
                        // Necesitamos encontrar la primera fecha de entrega desde la creación del pedido
                        // y luego verificar si la fecha objetivo (2 días después = día de entrega) es un múltiplo del intervalo
                        
                        // Parsear fecha objetivo correctamente (viene de PostgreSQL como DATE)
                        let fechaEntregaObjetivo;
                        let fechaObjetivoStr;
                        
                        if (fechaDosDias instanceof Date) {
                            fechaObjetivoStr = fechaDosDias.toISOString().split('T')[0];
                        } else {
                            fechaObjetivoStr = String(fechaDosDias).split('T')[0];
                        }
                        
                        // Crear fecha usando solo la parte de fecha, en UTC
                        fechaEntregaObjetivo = new Date(fechaObjetivoStr + 'T00:00:00.000Z');
                        fechaEntregaObjetivo.setUTCHours(0, 0, 0, 0);
                        
                        // Convertir dia_semana del grupo (1-7, donde 7=Domingo) a formato JavaScript (0-6, donde 0=Domingo)
                        const diaObjetivoJS = pedido.dia_semana === 7 ? 0 : pedido.dia_semana;
                        
                        console.log(`[DEBUG] Pedido ${pedido._id}: fechaCreacion=${fechaCreacionPedido.toISOString().split('T')[0]}, fechaEntregaObjetivo=${fechaEntregaObjetivo.toISOString().split('T')[0]}, dia_semana grupo=${pedido.dia_semana}, diaObjetivoJS=${diaObjetivoJS}`);
                        
                        // Encontrar la primera fecha de entrega desde la creación del pedido
                        let primeraFechaEntrega = new Date(fechaCreacionPedido);
                        
                        // Avanzar hasta el primer día de entrega correcto
                        // Usar getUTCDay() para evitar problemas de zona horaria (0=Domingo, 1=Lunes, ..., 6=Sábado)
                        let diasAvanzados = 0;
                        while (primeraFechaEntrega.getUTCDay() !== diaObjetivoJS && diasAvanzados < 7) {
                            primeraFechaEntrega.setUTCDate(primeraFechaEntrega.getUTCDate() + 1);
                            diasAvanzados++;
                        }
                        
                        if (diasAvanzados >= 7) {
                            console.warn(`[DEBUG] No se encontró el día objetivo para pedido ${pedido._id}`);
                            return;
                        }

                        console.log(`[DEBUG] Pedido ${pedido._id}: primeraFechaEntrega=${primeraFechaEntrega.toISOString().split('T')[0]}, día semana=${primeraFechaEntrega.getDay()}`);

                        // Calcular semanas desde la primera fecha de entrega hasta la fecha de entrega objetivo
                        const diffTimeEntrega = fechaEntregaObjetivo.getTime() - primeraFechaEntrega.getTime();
                        const diffDaysEntrega = Math.floor(diffTimeEntrega / (1000 * 60 * 60 * 24));
                        const semanasDesdePrimeraEntrega = Math.floor(diffDaysEntrega / 7);
                        
                        console.log(`[DEBUG] Pedido ${pedido._id}: diffDaysEntrega=${diffDaysEntrega}, semanasDesdePrimeraEntrega=${semanasDesdePrimeraEntrega}, intervalo=${pedido.intervalo_semanas}, modulo=${semanasDesdePrimeraEntrega % pedido.intervalo_semanas}`);
                        
                        // Verificar que sea un múltiplo del intervalo (0, intervalo_semanas, 2*intervalo_semanas, etc.)
                        // semanasDesdePrimeraEntrega debe ser >= 0 y múltiplo del intervalo
                        if (semanasDesdePrimeraEntrega >= 0 && semanasDesdePrimeraEntrega % pedido.intervalo_semanas === 0) {
                            console.log(`[DEBUG] ✅ DEBE CREAR pedido ${pedido._id}`);
                            debeCrear = true;
                            semanasDesdeCreacion = semanasDesdePrimeraEntrega;
                        } else {
                            console.log(`[DEBUG] ❌ NO debe crear pedido ${pedido._id} - no es múltiplo del intervalo (semanas=${semanasDesdePrimeraEntrega}, intervalo=${pedido.intervalo_semanas})`);
                        }
                    }
                } else {
                    console.log(`[DEBUG] Día NO coincide para pedido ${pedido._id}: grupo dia_semana=${pedido.dia_semana}, objetivo=${diaSemanaDosDiasAjustado}`);
                }
            } else if (tipoFrecuencia === 'mensual') {
                // Igual que individuales mensuales: día del mes + día de la semana de la fecha objetivo (1=Lun…7=Dom)
                if (pedido.dia_mes === diaMesDosDias) {
                    const dsem = pedido.dia_semana_mensual;
                    if (dsem != null && dsem !== '') {
                        debeCrear = Number(dsem) === diaSemanaDosDiasAjustado;
                    } else {
                        debeCrear = true;
                    }
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
                    cantidadkl: pedido.cantidadkl,
                    cantidadprecio: pedido.cantidadprecio,
                    frecuencia: frecuenciaFinal,
                    dia1: tipoFrecuencia === 'semanal' ? pedido.dia_semana : pedido.dia_mes,
                    dia2: tipoFrecuencia === 'mensual' ? pedido.dia_semana_mensual : null,
                    usuarioid: pedido.usuarioid,
                    usuariocrea: pedido.usuariocrea,
                    puntoid: pedido.puntoid,
                    valorunitario: pedido.valorunitario,
                    observacion: pedido.observacion,
                    grupo_id: pedido.grupo_id,
                    fechaSolicitud: fechaDosDias, // Fecha de 2 días después
                    fechaCreacionOriginal: pedido.creado, // Fecha de creación del pedido padre
                    semanasDesdeCreacion: semanasDesdeCreacion > 0 ? semanasDesdeCreacion : null,
                    tipoFrecuenciaGrupo: tipoFrecuencia,
                    intervalo_semanas: pedido.intervalo_semanas
                });
            }
        });

        // ============================================
        // CREAR PEDIDOS DE GRUPOS EN LA BASE DE DATOS
        // ============================================
        let pedidosGruposCreados = 0;
        const pedidosGruposCreadosIds = [];

        if (pedidosACrear.grupos.length > 0) {
            const INSERT_PEDIDO_GRUPO = `
                INSERT INTO pedidos (
                    forma,
                    cantidadkl,
                    cantidadprecio,
                    valorunitario,
                    observacion,
                    pedidopadre,
                    estado,
                    fechasolicitud,
                    usuarioid,
                    puntoid,
                    usuariocrea,
                    grupo_id
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING _id
            `;

            for (const pedido of pedidosACrear.grupos) {
                try {
                    // Asegurar que fechaDosDias esté en formato correcto para PostgreSQL
                    let fechaSolicitudFormato;
                    if (fechaDosDias instanceof Date) {
                        fechaSolicitudFormato = fechaDosDias.toISOString().split('T')[0];
                    } else {
                        fechaSolicitudFormato = String(fechaDosDias).split('T')[0];
                    }

                    const { rows: nuevoPedido } = await client.query(INSERT_PEDIDO_GRUPO, [
                        pedido.forma,
                        pedido.cantidadkl || 0,
                        pedido.cantidadprecio || 0,
                        pedido.valorunitario,
                        pedido.observacion || null,
                        pedido.pedidoPadre,
                        'espera',
                        fechaSolicitudFormato,
                        pedido.usuarioid,
                        pedido.puntoid,
                        pedido.usuariocrea || pedido.usuarioid,
                        null  // grupo_id debe ser null para los pedidos hijos creados
                    ]);

                    pedidosGruposCreados++;
                    pedidosGruposCreadosIds.push(nuevoPedido[0]._id);
                    console.log(`[INFO] Pedido creado: ${nuevoPedido[0]._id} para grupo ${pedido.grupo_id}`);
                } catch (error) {
                    console.error(`[ERROR] Error al crear pedido para grupo ${pedido.grupo_id}:`, error);
                    // Continuar con el siguiente pedido
                }
            }
        }

        // ============================================
        // OBTENER INFORMACIÓN DETALLADA DE PEDIDOS CREADOS
        // ============================================
        let pedidosDetalle = [];
        
        if (pedidosGruposCreadosIds.length > 0) {
            const GET_PEDIDOS_DETALLE = `
                SELECT 
                    p._id as pedido_id,
                    p.forma,
                    u.cedula as nit,
                    u.nombre as nombre_cliente,
                    u.razon_social,
                    u.codt,
                    pt.direccion as ubicacion,
                    p.pedidopadre,
                    g.intervalo_semanas,
                    g.tipo_frecuencia
                FROM pedidos p
                JOIN users u ON u._id = p.usuarioid
                LEFT JOIN puntos pt ON pt._id = p.puntoid
                LEFT JOIN pedidos pp ON pp._id = p.pedidopadre
                LEFT JOIN grupos_frecuencias g ON g._id = pp.grupo_id
                WHERE p._id = ANY($1::int[])
                    AND p.eliminado = FALSE
                ORDER BY g.intervalo_semanas ASC, u.razon_social ASC, u.nombre ASC
            `;

            const { rows: pedidosDetalleRows } = await client.query(GET_PEDIDOS_DETALLE, [pedidosGruposCreadosIds]);
            pedidosDetalle = pedidosDetalleRows;
        }

        // ============================================
        // ENVIAR CORREO CON REPORTE
        // ============================================
        const totalPedidos =
            pedidosACrear.semanal.length +
            pedidosACrear.quincenal.length +
            pedidosACrear.tressemanas.length +
            pedidosACrear.mensual.length +
            pedidosACrear.grupos.length;

        // Clasificar pedidos creados por frecuencia
        // Primero separar mensuales, luego los semanales por intervalo
        const pedidosCreadosMensual = pedidosDetalle.filter(p => p.tipo_frecuencia === 'mensual');
        const pedidosCreadosSemanales = pedidosDetalle.filter(p => p.tipo_frecuencia === 'semanal' || (!p.tipo_frecuencia && p.intervalo_semanas));
        const pedidosCreadosSemanal = pedidosCreadosSemanales.filter(p => !p.intervalo_semanas || p.intervalo_semanas === 1);
        const pedidosCreadosQuincenal = pedidosCreadosSemanales.filter(p => p.intervalo_semanas === 2);
        const pedidosCreadosTresSemanas = pedidosCreadosSemanales.filter(p => p.intervalo_semanas === 3);
        const pedidosCreadosCuatroSemanas = pedidosCreadosSemanales.filter(p => p.intervalo_semanas === 4);

        // Generar HTML del correo con formato detallado
        const currentDate = new Date().toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        // Función para generar tabla de pedidos
        const generateTable = (data, title, color) => {
            if (!data || data.length === 0) {
                return `
                    <div class="section">
                        <h3 style="color: ${color}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                            📊 ${title}
                        </h3>
                        <div class="no-data">
                            <p style="margin: 0; color: #666; font-style: italic;">No hay datos disponibles</p>
                        </div>
                    </div>
                `;
            }

            return `
                <div class="section">
                    <h3 style="color: ${color}; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
                        📊 ${title} (${data.length} registros)
                    </h3>
                    <div class="table-container">
                        <table style="width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                            <thead>
                                <tr style="background: linear-gradient(135deg, ${color}, ${color}dd);">
                                    <th style="padding: 12px 15px; text-align: left; color: white; font-weight: 600; font-size: 14px;">ID</th>
                                    <th style="padding: 12px 15px; text-align: left; color: white; font-weight: 600; font-size: 14px;">NIT</th>
                                    <th style="padding: 12px 15px; text-align: left; color: white; font-weight: 600; font-size: 14px;">Nombre Cliente</th>
                                    <th style="padding: 12px 15px; text-align: left; color: white; font-weight: 600; font-size: 14px;">CODT</th>
                                    <th style="padding: 12px 15px; text-align: left; color: white; font-weight: 600; font-size: 14px;">Ubicación</th>
                                    <th style="padding: 12px 15px; text-align: left; color: white; font-weight: 600; font-size: 14px;">Forma</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.map((row, index) => `
                                    <tr style="border-bottom: 1px solid #eee; background: ${index % 2 === 0 ? '#fff' : '#f8f9fa'};">
                                        <td style="padding: 12px 15px; color: #333; font-size: 13px; border-right: 1px solid #f0f0f0;">${row.pedido_id || '-'}</td>
                                        <td style="padding: 12px 15px; color: #333; font-size: 13px; border-right: 1px solid #f0f0f0;">${row.nit || '-'}</td>
                                        <td style="padding: 12px 15px; color: #333; font-size: 13px; border-right: 1px solid #f0f0f0;">${row.razon_social || row.nombre_cliente || '-'}</td>
                                        <td style="padding: 12px 15px; color: #333; font-size: 13px; border-right: 1px solid #f0f0f0;">${row.codt || '-'}</td>
                                        <td style="padding: 12px 15px; color: #333; font-size: 13px; border-right: 1px solid #f0f0f0;">${row.ubicacion || '-'}</td>
                                        <td style="padding: 12px 15px; color: #333; font-size: 13px;">${row.forma || '-'}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        };

        const emailHTML = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Reporte de Pedidos Frecuencias</title>
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa; line-height: 1.6;">
                <div style="max-width: 1000px; margin: 0 auto; background: white; box-shadow: 0 0 20px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
                        <h1 style="margin: 0; font-size: 28px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
                            📈 Reporte de Pedidos Frecuencias
                        </h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">
                            CodeGas Colombia - ${currentDate}
                        </p>
                    </div>

                    <!-- Summary Cards -->
                    <div style="padding: 30px; background: #f8f9fa;">
                        <div style="display: flex; gap: 20px; flex-wrap: wrap; justify-content: center;">
                            <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #28a745; text-align: center;">
                                <h4 style="margin: 0 0 10px 0; color: #28a745; font-size: 16px; font-weight: 600;">Semanal</h4>
                                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #28a745;">${pedidosCreadosSemanal.length}</p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                            </div>
                            <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #ffc107; text-align: center;">
                                <h4 style="margin: 0 0 10px 0; color: #ffc107; font-size: 16px; font-weight: 600;">Cada 2 semanas</h4>
                                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #ffc107;">${pedidosCreadosQuincenal.length}</p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                            </div>
                            <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #fd7e14; text-align: center;">
                                <h4 style="margin: 0 0 10px 0; color: #fd7e14; font-size: 16px; font-weight: 600;">Cada 3 semanas</h4>
                                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #fd7e14;">${pedidosCreadosTresSemanas.length}</p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                            </div>
                            <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #e83e8c; text-align: center;">
                                <h4 style="margin: 0 0 10px 0; color: #e83e8c; font-size: 16px; font-weight: 600;">Cada 4 semanas</h4>
                                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #e83e8c;">${pedidosCreadosCuatroSemanas.length}</p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                            </div>
                            <div style="flex: 1; min-width: 200px; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.07); border-left: 4px solid #17a2b8; text-align: center;">
                                <h4 style="margin: 0 0 10px 0; color: #17a2b8; font-size: 16px; font-weight: 600;">Mensual</h4>
                                <p style="margin: 0; font-size: 32px; font-weight: 700; color: #17a2b8;">${pedidosCreadosMensual.length}</p>
                                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">pedidos</p>
                            </div>
                        </div>
                    </div>

                    <!-- Data Tables -->
                    <div style="padding: 30px;">
                        ${generateTable(pedidosCreadosSemanal, 'Pedidos Semanales', '#28a745')}
                        ${generateTable(pedidosCreadosQuincenal, 'Pedidos Cada 2 Semanas', '#ffc107')}
                        ${generateTable(pedidosCreadosTresSemanas, 'Pedidos Cada 3 Semanas', '#fd7e14')}
                        ${generateTable(pedidosCreadosCuatroSemanas, 'Pedidos Cada 4 Semanas', '#e83e8c')}
                        ${generateTable(pedidosCreadosMensual, 'Pedidos Mensuales', '#17a2b8')}
                    </div>

                    <!-- Footer -->
                    <div style="background: #343a40; color: white; padding: 25px; text-align: center;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.8;">
                            Este es un reporte automático generado por el sistema
                        </p>
                        <p style="margin: 0; font-size: 12px; opacity: 0.6;">
                            © ${new Date().getFullYear()} CodeGas Colombia. Todos los derechos reservados.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // Enviar el correo
        try {
            const mailOptions = {
                from: {
                    name: 'CodeGas Colombia - Sistema Automático',
                    address: EMAIL_USER
                },
                to: recipients,
                subject: `📊 Reporte de Pedidos Frecuencias - ${new Date().toLocaleDateString('es-CO')}`,
                html: emailHTML
            };

            const info = await transporter.sendMail(mailOptions);
            console.log(`[INFO] Correo enviado exitosamente: ${info.messageId}`);
        } catch (error) {
            if (error?.code === 'NO_RECIPIENTS') {
                console.warn('[WARN] Correo de frecuencias omitido: sin destinatarios válidos');
            } else {
                console.error('[ERROR] Error al enviar correo:', error);
            }
            // No lanzar error, solo registrar
        }

        // ============================================
        // RESUMEN Y RESPUESTA
        // ============================================
        return {
            status: true,
            fecha: fechaHoy,
            fechaObjetivo: fechaDosDias, // Fecha para la cual se crearán los pedidos (2 días después)
            diaSemana: diaSemanaActualAjustado,
            diaSemanaObjetivo: diaSemanaDosDiasAjustado, // Día de la semana objetivo
            diaMesObjetivo: diaMesDosDias, // Día del mes objetivo
            resumen: {
                semanal: pedidosACrear.semanal.length,
                quincenal: pedidosACrear.quincenal.length,
                tressemanas: pedidosACrear.tressemanas.length,
                mensual: pedidosACrear.mensual.length,
                grupos: pedidosACrear.grupos.length,
                total: totalPedidos
            },
            pedidosCreados: {
                grupos: pedidosGruposCreados,
                gruposIds: pedidosGruposCreadosIds
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

