// Configuración de cada tipo de luz interior que SÍ manejamos aquí:
// lámparas y candelabro. La chimenea la maneja otro sistema aparte.
//
// "match" es un regex (insensible a mayúsculas) contra el nombre del objeto.
// Agregar un tipo nuevo no requiere tocar ningún otro archivo.

export const LIGHT_TYPES = [
    {
        id: 'candle',
        match: /candelabro|candle/i,
        color: 0xff6b1a,
        intensity: 95,    // fuerte y notoria de noche
        distance: 102,
        decay: 2,
        flicker: true
    },
    {
        id: 'lamp',
        match: /lamp|lampara/i,
        color: 0xff6b1a,
        intensity: 90,
        distance: 106,
        decay: 2,
        flicker: false
    }
];

// Devuelve la config del primer tipo cuyo "match" coincida con el nombre, o null.
export function resolveLightType(name) {
    if (!name) return null;
    return LIGHT_TYPES.find(type => type.match.test(name)) || null;
}