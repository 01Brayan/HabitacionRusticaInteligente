// Nombres COMPLETOS y exactos de las lámparas que están afuera de la casa
// (tal cual aparecen en layout.json / object.name). Si en el futuro duplicás
// alguna de estas 3 para poner otra lámpara más afuera, no hace falta tocar
// nada: isExteriorLamp() también reconoce sus futuros "_copia_..." hijos.
const EXTERIOR_LAMP_NAMES = [
    'lampara1_copia_1785899329454_copia_1785899504033_copia_1785899833314',
    'lampara1_copia_1785899329454_copia_1785899504033_copia_1785899645766',
    'lampara1_copia_1785899329454_copia_1785899504033',
];

function isExteriorLamp(name) {
    return EXTERIOR_LAMP_NAMES.some(
        base => name === base || name.startsWith(base + '_copia_')
    );
}

export const LIGHT_TYPES = [
    {
        id: 'candle',
        match: /candelabro|candle/i,
        color: 0xff6b1a,
        intensity: 95,
        distance: 102,
        decay: 2,
        flicker: true
    },
    {
        id: 'lamp_exterior',
        match: /lamp|lampara/i,
        color: 0xff6b1a,
        intensity: 800,   // más fuerte: afuera no hay paredes/techo que reboten luz
        distance: 160,
        decay: 2,
        flicker: false
    },
    {
        id: 'lamp',
        match: /lamp|lampara/i,
        color: 0xff6b1a,
        intensity: 110,
        distance: 106,
        decay: 2,
        flicker: false
    }
];

// Devuelve la config del tipo correspondiente, o null si el nombre no matchea nada.
// El orden importa: primero candelabro, después "¿es una de mis 3 exteriores?",
// y solo si no, cae al tipo genérico "lamp" (interior).
export function resolveLightType(name) {
    if (!name) return null;

    const candleType = LIGHT_TYPES.find(t => t.id === 'candle');
    if (candleType.match.test(name)) return candleType;

    const isLampName = /lamp|lampara/i.test(name);
    if (!isLampName) return null;

    if (isExteriorLamp(name)) {
        return LIGHT_TYPES.find(t => t.id === 'lamp_exterior');
    }
    return LIGHT_TYPES.find(t => t.id === 'lamp');
}