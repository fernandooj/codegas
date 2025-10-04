/**
 * Función para parsear un string y convertirlo a número
 * Maneja diferentes formatos de números con comas y puntos
 * @param {string} strg - String a convertir
 * @returns {number} - Número parseado
 */
export function parseNumber(strg) {
    var strg = strg || "";
    var decimal = '.';

    // Remover caracteres que no sean números, comas, puntos o $
    strg = strg.replace(/[^0-9$.,]/g, '');

    // Determinar qué carácter es el decimal
    if (strg.indexOf(',') > strg.indexOf('.')) decimal = ',';

    // Si hay múltiples decimales, remover todos
    if ((strg.match(new RegExp("\\" + decimal, "g")) || []).length > 1) decimal = "";

    // Si el decimal está en posición incorrecta, ignorarlo
    if (decimal != "" && (strg.length - strg.indexOf(decimal) - 1 == 3) && strg.indexOf("0" + decimal) !== 0) decimal = "";

    // Limpiar todo excepto números y el decimal
    strg = strg.replace(new RegExp("[^0-9$" + decimal + "]", "g"), "");

    // Convertir coma a punto para parseFloat
    strg = strg.replace(',', '.');

    return parseFloat(strg);
}

/**
 * Formatea un número como moneda colombiana
 * @param {number} number - Número a formatear
 * @param {number} decimals - Cantidad de decimales (default: 2)
 * @returns {string} - Número formateado como moneda
 */
export function formatCurrency(number, decimals=0) {
    return '$' + Number(number).toFixed(decimals).toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
}

/**
 * Remueve caracteres no numéricos de un string
 * @param {string} str - String a limpiar
 * @returns {string} - String solo con números
 */
export function removeNonNumeric(str) {
    if (!str) return "";
    let cleaned = str.replace(/[A-Za-z$-]/g, "");
    cleaned = cleaned.replace(",", "");
    return cleaned === "NaN" ? "" : cleaned;
}

/**
 * Convierte un string a entero y lo formatea
 * @param {string} str - String a convertir
 * @returns {string} - Número entero formateado
 */
export function parseToInteger(str) {
    let cleaned = removeNonNumeric(str);
    let parsed = parseInt(cleaned).toFixed(0);
    return parsed === "NaN" ? "" : parsed;
}
