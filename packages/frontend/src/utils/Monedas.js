export const Moneda = Object.freeze({
    PESO_ARG: "$",
    DOLAR: "U$S",
    REAL: "R$"
});

// Mapeo entre códigos internos y códigos ISO
export const MonedaToISO = Object.freeze({
    PESO_ARG: "ARS",
    DOLAR: "USD",
    REAL: "BRL"
});

// Mapeo inverso de ISO a códigos internos
export const ISOToMoneda = Object.freeze({
    ARS: "PESO_ARG",
    USD: "DOLAR",
    BRL: "REAL"
});

export const getMonedaSymbol = (code) => {
    if (!code) return "";
    
    // Si es un código ISO, convertir a código interno
    if (ISOToMoneda[code]) {
        return Moneda[ISOToMoneda[code]];
    }
    
    // Si es un código interno, devolver el símbolo
    if (Moneda[code]) {
        return Moneda[code];
    }
    
    // Si es un símbolo directamente, devolverlo
    if (Object.values(Moneda).includes(code)) {
        return code;
    }
    
    return code;
};

// Convierte código interno a ISO para API
export const toISO = (moneda) => {
    return MonedaToISO[moneda] || moneda;
};

// Convierte código ISO a interno para display
export const fromISO = (iso) => {
    return ISOToMoneda[iso] || iso;
};