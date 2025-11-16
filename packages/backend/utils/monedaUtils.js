// Mapeo entre códigos de BD y códigos ISO
const MonedaToISO = {
    PESO_ARG: "ARS",
    DOLAR: "USD",
    REAL: "BRL"
};

const ISOToMoneda = {
    ARS: "PESO_ARG",
    USD: "DOLAR",
    BRL: "REAL"
};

/**
 * Convierte código de moneda de BD a ISO
 */
export const toISO = (moneda) => {
    return MonedaToISO[moneda] || moneda;
};

/**
 * Convierte código ISO a formato de BD
 */
export const fromISO = (iso) => {
    return ISOToMoneda[iso] || iso;
};

/**
 * Verifica si es un código ISO válido
 */
export const isISO = (code) => {
    return ['ARS', 'USD', 'BRL'].includes(code);
};

/**
 * Verifica si es un código de BD válido
 */
export const isMonedaBD = (code) => {
    return ['PESO_ARG', 'DOLAR', 'REAL'].includes(code);
};

export { MonedaToISO, ISOToMoneda };
