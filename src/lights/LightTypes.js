
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
