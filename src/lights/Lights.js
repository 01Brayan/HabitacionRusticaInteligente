import * as THREE from 'three';

// Puntos clave del sol. "hour" en formato 0-24 (podés usar decimales, ej: 6.5 = 6:30am)
// ============================================================
// 📌 CÓMO AJUSTAR COLORES TÚ MISMO:
//    El color está en hex 0xRRGGBB. Para obtener un tono:
//    - Googleá "color picker" y elegí un color
//    - Tomá los valores R, G, B (0-255) y convertilos a hex:
//      Ej: R=255, G=180, B=80 → 0xffb450
// ============================================================
const SUN_KEYFRAMES = [
    { hour: 0,    color: 0x0a0e1a, intensity: 0.0 },
    { hour: 5,    color: 0x0a0e1a, intensity: 0.0 },   // 5 AM: noche, sol bajo tierra
    { hour: 8,    color: 0x8db4e8, intensity: 6.0 },   // 8 AM: mañana azul brillante
    { hour: 11,   color: 0xffbb5e, intensity: 9.0 },   // 11 AM: dorado suave
    { hour: 14,   color: 0xffc46a, intensity: 9.0 },   // 2 PM: "color piel" dorado-peach
    { hour: 16.5, color: 0xffa33d, intensity: 8.0 },   // 4:30 PM: naranja
    { hour: 20,   color: 0xcc1500, intensity: 2.5 },   // 8 PM: rojo atardecer
    { hour: 21,   color: 0x0a0e1a, intensity: 0.0 },
    { hour: 24,   color: 0x0a0e1a, intensity: 0.0 },
];

// Cielo (sky) y tierra (ground) de la luz hemisférica.
// Esta luz es la que REBOTA del entorno y tiñe la madera de la casa.
// ============================================================
// 📌 PARA CAMBIAR EL TONO DE LA CASA:
//    - sky → color del cielo (ilumina desde arriba)
//    - ground → color del suelo (ilumina desde abajo, tiñe la madera)
//    - intensity → qué tan fuerte es este rebote
// ============================================================
const HEMI_KEYFRAMES = [
    { hour: 0,   sky: 0x040712, ground: 0x010103, intensity: 0.03 },
    { hour: 5,   sky: 0x040712, ground: 0x010103, intensity: 0.03 },  // noche
    { hour: 8,   sky: 0x4a7dbd, ground: 0x1a2a40, intensity: 0.30 },  // mañana azul
    { hour: 11,  sky: 0xa8c8e8, ground: 0x5a3d20, intensity: 0.35 },  // mañana cálida
    { hour: 14,  sky: 0xb0cce0, ground: 0x5f4423, intensity: 0.40 },  // peak cálido
    { hour: 16.5,sky: 0xcc8844, ground: 0x4a2010, intensity: 0.30 },  // tarde naranja
    { hour: 20,  sky: 0xa31800, ground: 0x1a0400, intensity: 0.15 },  // atardecer rojo
    { hour: 24,  sky: 0x040712, ground: 0x010103, intensity: 0.03 },
];

// POSICIONES FIJAS DEL SOL EN EL ESPACIO 3D
// La luz viaja desde esta posición hacia el target (0,0,-18).
// ============================================================
// 📌 CÓMO AJUSTAR TÚ MISMO:
//    Poné un Part en Roblox en (X, Y, Z), movelo hasta que
//    te guste la dirección de la luz, copiá los valores acá.
//    La Y define día (Y>0) o noche (Y<0).
// ============================================================
const SUN_POSITIONS = [
    { hour: 5,    pos: new THREE.Vector3(193.814, -20.6, -63.098) },   // 5 AM: sale desde la derecha-frente
    { hour: 8,    pos: new THREE.Vector3(150.918, 31.377, 99.388) },  // 8 AM: derecha-trasera, arriba
    { hour: 11,   pos: new THREE.Vector3(-11.087, 64.935, 176.646) }, // 11 AM: centro-trasero, muy alto
    { hour: 14,   pos: new THREE.Vector3(-164.599, 88.891, 188.407) },// 2 PM: izquierda-trasera, más alto
    { hour: 16.5, pos: new THREE.Vector3(-228.387, 98.319, -15.567) },// 4:30 PM: izquierda-frente, muy alto
    { hour: 20,   pos: new THREE.Vector3(-220.487, -15.086, -24.909) },// 8 PM: izquierda-frente, bajo tierra
];

const _colorA = new THREE.Color();
const _colorB = new THREE.Color();

// Interpola valores escalares o colores entre keyframes
function lerpKeyframes(keyframes, hour, fields) {
    const h = THREE.MathUtils.clamp(hour, 0, 24);
    let i = 0;
    while (i < keyframes.length - 2 && keyframes[i + 1].hour < h) i++;
    const a = keyframes[i];
    const b = keyframes[i + 1];
    const span = b.hour - a.hour || 1;
    const t = THREE.MathUtils.clamp((h - a.hour) / span, 0, 1);

    const result = {};
    for (const field of fields) {
        if (field === 'color' || field === 'sky' || field === 'ground') {
            _colorA.set(a[field]);
            _colorB.set(b[field]);
            result[field] = _colorA.clone().lerp(_colorB, t);
        } else {
            result[field] = THREE.MathUtils.lerp(a[field], b[field], t);
        }
    }
    return result;
}

// Interpola la posición 3D del sol entre keyframes
function lerpPosition(keyframes, hour) {
    const h = THREE.MathUtils.clamp(hour, 0, 24);
    let i = 0;
    while (i < keyframes.length - 2 && keyframes[i + 1].hour < h) i++;
    const a = keyframes[i];
    const b = keyframes[i + 1];
    const span = b.hour - a.hour || 1;
    const t = THREE.MathUtils.clamp((h - a.hour) / span, 0, 1);

    const result = new THREE.Vector3();
    result.lerpVectors(a.pos, b.pos, t);
    return result;
}

export function createLights(scene) {
    // 1. SOL
    const sunLight = new THREE.DirectionalLight(0xFFF3E0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 350;
    const d = 95;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    sunLight.shadow.radius = 5; // Suaviza los bordes de las sombras (más realista, menos "cortante")
    scene.add(sunLight);
    scene.add(sunLight.target);

    // 2. LUNA (opuesta al sol)
    const moonLight = new THREE.DirectionalLight(0x8fa8d9, 0);
    moonLight.castShadow = false;
    scene.add(moonLight);
    scene.add(moonLight.target);

    // 3. HEMISFÉRICA
    const hemiLight = new THREE.HemisphereLight(0xffd89e, 0x3d2817, 0.4);
    scene.add(hemiLight);

    // 4. RELLENO
    const fillLight = new THREE.AmbientLight(0xffe9c2, 0.025);
    scene.add(fillLight);

    function setTime(hour) {
        // 1. Interpolar color e intensidad del sol desde los keyframes
        const sun = lerpKeyframes(SUN_KEYFRAMES, hour, ['color', 'intensity']);

        // 2. Interpolar posición 3D del sol desde tus 5 puntos fijos
        const sunPos = lerpPosition(SUN_POSITIONS, hour);

        // 3. Aplicar color al sol
        sunLight.color.copy(sun.color);

        // 4. Transición día/noche según la altura Y del sol:
        //    - Y > 10 → luz al 100%
        //    - Y entre -5 y 10 → crepúsculo gradual
        //    - Y < -5 → noche, intensidad 0
        // 📌 Si querés que el día dure más o menos, cambiá estos -5 y 10
        const yFade = THREE.MathUtils.smoothstep(sunPos.y, -5, 10);
        sunLight.intensity = Math.max(sun.intensity, 0) * yFade;

        // 5. Posicionar el sol y la luna
        sunLight.position.copy(sunPos);
        sunLight.target.position.set(0, 0, -18);

        // Luna: opuesta al sol, siempre un poco sobre el horizonte
        const moonPos = new THREE.Vector3().copy(sunPos).negate();
        moonPos.y = Math.max(Math.abs(moonPos.y) * 0.3, 5);
        moonLight.position.copy(moonPos);
        moonLight.target.position.set(0, 0, -18);

        // Intensidad de la luna: visible cuando el sol está bajo tierra
        const moonT = THREE.MathUtils.smoothstep(-sunPos.y, 0, 20);
        moonLight.intensity = moonT * 0.35;

        // 6. Luz hemisférica (ambiente cielo/suelo)
        const hemi = lerpKeyframes(HEMI_KEYFRAMES, hour, ['sky', 'ground', 'intensity']);
        hemiLight.color.copy(hemi.sky);
        hemiLight.groundColor.copy(hemi.ground);
        hemiLight.intensity = hemi.intensity;

        // 7. Luz de relleno (evita negro total en sombras y de noche)
        //    De noche sube un poco para que la escena no quede completamente a oscuras
        fillLight.intensity = THREE.MathUtils.lerp(0.04, 0.008, THREE.MathUtils.smoothstep(sunPos.y, -10, 15));

        // 8. Environment map (reflejos sutiles en la madera)
        //    Casi apagado de noche para que no ilumine artificialmente
        if ('environmentIntensity' in scene) {
            const dayFactor = THREE.MathUtils.smoothstep(sunPos.y, -10, 20);
            scene.environmentIntensity = THREE.MathUtils.lerp(0.02, 0.20, dayFactor);
        }
    }

    // Hora inicial (7 AM = mañana azul)
    setTime(7);

    return { sunLight, moonLight, hemiLight, fillLight, setTime };
}
