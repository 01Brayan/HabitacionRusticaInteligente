import * as THREE from 'three';
import { Sky } from 'three/addons/objects/Sky.js';

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
    { hour: 8,    color: 0x8db4e8, intensity: 4.5 },   // 8 AM: mañana azul brillante
    { hour: 11,   color: 0xffbb5e, intensity: 6.5 },   // 11 AM: dorado suave
    { hour: 14,   color: 0xffc46a, intensity: 6.0 },   // 2 PM: "color piel" dorado-peach
    { hour: 16.5, color: 0xff6b1a , intensity: 5.0 },   // 4:30 PM: naranja
    { hour: 20,   color: 0x5c7097, intensity: 0 },   // 8 PM: rojo atardecer
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
    { hour: 0,   sky: 0x0a0e1a, ground: 0x010103, intensity: 0.03 },
    { hour: 5,   sky: 0x040712, ground: 0x010103, intensity: 0.05 },
    { hour: 6.5, sky: 0xd68a55, ground: 0x3a1a08, intensity: 0.25 },
    { hour: 8,   sky: 0x5a8dd0, ground: 0x2a3a50, intensity: 0.55 },
    { hour: 11,  sky: 0xffcb70, ground: 0x8a5028, intensity: 0.70 },
    { hour: 14,  sky: 0xf5b565, ground: 0x905225, intensity: 0.75 },
    { hour: 16.5,sky: 0xdd6625, ground: 0x5a2510, intensity: 0.55 },
    { hour: 20,  sky: 0x8a2000, ground: 0x0d0300, intensity: 0.20 },
    { hour: 24,  sky: 0x040712, ground: 0x010103, intensity: 0.05 },
];

// POSICIONES FIJAS DEL SOL EN EL ESPACIO 3D

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
    scene.fog = new THREE.FogExp2(0x87ceeb, 0.0015);
    // 1. SOL
    const sunLight = new THREE.DirectionalLight(0xFFF3E0, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(4096,4096);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 350;
    const d = 95;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.00015;
    sunLight.shadow.normalBias = 0.04;
    sunLight.shadow.radius = 11; // Suaviza los bordes de las sombras (más realista, menos "cortante")
    scene.add(sunLight);
    scene.add(sunLight.target);

    // 2. LUNA (opuesta al sol)
    const moonLight = new THREE.DirectionalLight(0xbfd2ff, 0);
    moonLight.castShadow = false;
    scene.add(moonLight);
    scene.add(moonLight.target);

    // 3. HEMISFÉRICA
    const hemiLight = new THREE.HemisphereLight(0xffd89e, 0x3d2817, 0.8);
    scene.add(hemiLight);

    // 4. RELLENO
    const fillLight = new THREE.AmbientLight(0xffe9c2, 0.2);
    scene.add(fillLight);

    // 5. CIELO PROCEDURAL 3D (Sky de Three.js)
    const sky = new Sky();
    sky.scale.setScalar(1000);
    scene.add(sky);
    scene.background = null; // El Sky actúa como fondo

    // Ajustes atmosféricos del cielo procedural
    const skyUniforms = sky.material.uniforms;
    skyUniforms.turbidity.value = 7;    // 0-20: más alto = más brumoso
    skyUniforms.rayleigh.value = 0.1;   // 0-4: intensidad del color del cielo
    skyUniforms.mieCoefficient.value = 0.005;
    skyUniforms.mieDirectionalG.value = 0.8;

    function setTime(hour) {

        // 1. Interpolar color e intensidad del sol desde los keyframes
        const sun = lerpKeyframes(SUN_KEYFRAMES, hour, ['color', 'intensity']);
        // 2. Interpolar la luz hemisférica PRIMERO (para tener sus datos listos)
        const hemi = lerpKeyframes(HEMI_KEYFRAMES, hour, ['sky', 'ground', 'intensity']);
        // 3. Interpolar posición 3D del sol desde tus 5 puntos fijos
        const sunPos = lerpPosition(SUN_POSITIONS, hour);

        // 4. Aplicar color al sol
        sunLight.color.copy(sun.color);
        // 5. Sincronizar la niebla y el fondo con el color del cielo
        //    (pero NO si el modo FRIO esta activo, la niebla debe ser gris fija)
        if (scene.fog && !scene.userData.frioActivo) {
            scene.fog.color.copy(hemi.sky);
        }
        scene.background = hemi.sky.clone(); // Fondo sólido del color del cielo en esa hora
        // 6. Transición día/noche según la altura Y del sol:
        //    - Y > 10 → luz al 100%
        //    - Y entre -5 y 10 → crepúsculo gradual
        //    - Y < -5 → noche, intensidad 0
        // 📌 Si querés que el día dure más o menos, cambiá estos -5 y 10
        const yFade = THREE.MathUtils.smoothstep(sunPos.y, -5, 10);
        sunLight.intensity = Math.max(sun.intensity, 0) * yFade;

        // 7. Posicionar el sol y la luna
        sunLight.position.copy(sunPos);
        sunLight.target.position.set(0, 0, -18);

        // Sincronizar el cielo procedural con la posición del sol
        skyUniforms.sunPosition.value.copy(sunPos);

        // Luna: opuesta al sol, siempre un poco sobre el horizonte
        const moonPos = new THREE.Vector3().copy(sunPos).negate();
        moonPos.y = Math.max(Math.abs(moonPos.y) * 0.3, 5);
        moonLight.position.copy(moonPos);
        moonLight.target.position.set(0, 0, -18);

        // Intensidad de la luna: visible cuando el sol está bajo tierra
        const moonT = THREE.MathUtils.smoothstep(-sunPos.y, 0, 20);
        moonLight.intensity = moonT * 0.12;

        // 8. Luz hemisférica (ambiente cielo/suelo)
        hemiLight.color.copy(hemi.sky);
        hemiLight.groundColor.copy(hemi.ground);
        hemiLight.intensity = hemi.intensity;

        // 9. Luz de relleno (evita negro total en sombras y de noche)
        //    De noche sube un poco para que la escena no quede completamente a oscuras
        fillLight.color.setHex(0xffb865);
        fillLight.intensity = THREE.MathUtils.lerp(0.05, 0.15, THREE.MathUtils.smoothstep(sunPos.y, -10, 15));

        // 10. Environment map (reflejos sutiles en la madera)
        //    Casi apagado de noche para que no ilumine artificialmente
        if ('environmentIntensity' in scene) {
            const dayFactor = THREE.MathUtils.smoothstep(sunPos.y, -10, 20);
            scene.environmentIntensity = THREE.MathUtils.lerp(0.05, 0.11, dayFactor);
        }

    }

    // Hora inicial (7 AM = mañana azul)
    setTime(7);

    return { sunLight, moonLight, hemiLight, fillLight, setTime };
}
