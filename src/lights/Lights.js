import * as THREE from 'three';

/**
 * Sistema de iluminación con ciclo día/noche.
 * Por ahora se usa de forma ESTÁTICA (se llama createLights(scene) y ya
 * queda fijado a una hora), pero internamente ya está listo para que el
 * día de mañana conectes un slider y llames a lights.setTime(hour) en un
 * loop/onChange sin tener que tocar esta lógica de nuevo.
 */

// Puntos clave del sol. "hour" en formato 0-24 (podés usar decimales, ej: 6.5 = 6:30am)
const SUN_KEYFRAMES = [
    { hour: 0,    color: 0x0d1b3e, intensity: 0.0,  elevation: -90 },
    { hour: 5,    color: 0x2b3a67, intensity: 0.05, elevation: -20 },
    { hour: 6,    color: 0xff8c5a, intensity: 1.2,  elevation: 0   },
    { hour: 7.5,  color: 0xffc38a, intensity: 2.8,  elevation: 15  },
    { hour: 10,   color: 0xfff1d6, intensity: 4.0,  elevation: 45  },
    { hour: 13,   color: 0xfff2df, intensity: 3.8,  elevation: 70  },
    { hour: 16,   color: 0xfff0da, intensity: 3.6,  elevation: 40  },
    { hour: 18,   color: 0xff9a52, intensity: 2.2,  elevation: 12  },
    { hour: 19.5, color: 0xff5e3a, intensity: 0.6,  elevation: -3  },
    { hour: 21,   color: 0x1c2748, intensity: 0.0,  elevation: -30 },
    { hour: 24,   color: 0x0d1b3e, intensity: 0.0,  elevation: -90 },
];

// Cielo/tierra de la hemisférica, sincronizado a grandes rasgos con el sol
const HEMI_KEYFRAMES = [
    { hour: 0,  sky: 0x0a1128, ground: 0x0a0806, intensity: 0.15 },
    { hour: 6,  sky: 0xffb27a, ground: 0x2a1c12, intensity: 0.35 },
    { hour: 12, sky: 0x87ceeb, ground: 0x3d2817, intensity: 0.55 },
    { hour: 18, sky: 0xff9a52, ground: 0x2a1c12, intensity: 0.4  },
    { hour: 21, sky: 0x162038, ground: 0x0a0806, intensity: 0.18 },
    { hour: 24, sky: 0x0a1128, ground: 0x0a0806, intensity: 0.15 },
];

const _colorA = new THREE.Color();
const _colorB = new THREE.Color();

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

export function createLights(scene) {
    // 1. SOL DINÁMICO
    const sunLight = new THREE.DirectionalLight(0xffffff, 0);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.set(2048, 2048);
    sunLight.shadow.camera.near = 1;
    sunLight.shadow.camera.far = 150;
    // Agrandado para cubrir tu casa real (~92 unidades de ancho en X).
    // Si más adelante tu casa mide más en Z, subí este valor también.
    const d = 100;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.02;
    scene.add(sunLight);
    scene.add(sunLight.target);

    // 2. LUNA (fría, sutil, solo de noche, sin sombra propia por performance)
    const moonLight = new THREE.DirectionalLight(0x8fa8d9, 0);
    moonLight.castShadow = false;
    scene.add(moonLight);
    scene.add(moonLight.target);

    // 3. HEMISFÉRICA - ambiente general cielo/tierra (reemplaza tu 'ambientLight' anterior)
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x3d2817, 0.4);
    scene.add(hemiLight);

    // 4. RELLENO - evita que el lado sin luz directa (donde después va la chimenea)
    //    se vea negro puro mientras no exista esa luz local.
    const fillLight = new THREE.AmbientLight(0xffffff, 0.12);
    scene.add(fillLight);

    // --- HOOK PARA LA CHIMENEA (sin activar todavía) ---
    // Cuando exista el fuego en Chimenea.js, agregá algo así en ese mismo
    // archivo (no acá) y pasale la posición real del modelo:
    //
    //   const fireLight = new THREE.PointLight(0xff6a2b, 3, 8, 2);
    //   fireLight.position.set(x, y, z);
    //   scene.add(fireLight);
    //
    // Con eso el fillLight de acá lo podés bajar de 0.12 a algo como 0.05.

    const RADIUS = 150; // bien afuera de tu casa (~92 unidades de ancho)

    // Azimut: ahora tenés ventanas en DOS paredes opuestas (derecha x=-46,
    // izquierda x=+45.5), así que el sol hace el arco completo de un lado
    // al otro en vez de quedarse de un solo lado:
    //
    //   hora 6  -> azimuth 180° -> x negativo -> "nace" del lado de la
    //              derecha (las 2 ventanas grandes)
    //   hora 13 -> azimuth ~90° -> x ~0        -> casi cenital (mediodía)
    //   hora 20 -> azimuth 0°   -> x positivo  -> "se pone" del lado de
    //              la izquierda (ventana fija)
    //
    // Si preferís invertirlo (amanecer por la izquierda), invertí los
    // valores 180 y 0 de abajo.
    function getAzimuth(hour) {
        return THREE.MathUtils.degToRad(THREE.MathUtils.mapLinear(hour, 6, 20, 180, 0));
    }

    function setSunPosition(light, elevationDeg, azimuthRad) {
        const elevRad = THREE.MathUtils.degToRad(elevationDeg);
        light.position.set(
            RADIUS * Math.cos(elevRad) * Math.cos(azimuthRad),
            RADIUS * Math.sin(elevRad),
            RADIUS * Math.cos(elevRad) * Math.sin(azimuthRad)
        );
        light.target.position.set(0, 0, 0);
    }

    function setTime(hour) {
        const sun = lerpKeyframes(SUN_KEYFRAMES, hour, ['color', 'intensity', 'elevation']);
        const hemi = lerpKeyframes(HEMI_KEYFRAMES, hour, ['sky', 'ground', 'intensity']);
        const azimuth = getAzimuth(hour);

        sunLight.color.copy(sun.color);
        sunLight.intensity = Math.max(sun.intensity, 0);
        setSunPosition(sunLight, sun.elevation, azimuth);

        const moonT = THREE.MathUtils.smoothstep(-sun.elevation, 0, 30);
        moonLight.intensity = moonT * 0.35;
        setSunPosition(moonLight, -sun.elevation * 0.6 + 20, azimuth + Math.PI);

        hemiLight.color.copy(hemi.sky);
        hemiLight.groundColor.copy(hemi.ground);
        hemiLight.intensity = hemi.intensity;

        fillLight.intensity = THREE.MathUtils.lerp(0.12, 0.04, THREE.MathUtils.smoothstep(sun.elevation, -10, 20));
    }

    // ESTÁTICO por ahora: fijamos la hora acá mismo.
    // Cuando armes la GUI, en vez de esta línea vas a llamar a lights.setTime(hour)
    // desde el slider (te devuelvo setTime más abajo para eso).
    setTime(7); // mañana dorada — probá también 17.5 (atardecer) o 13 (mediodía neutro)

    return { sunLight, moonLight, hemiLight, fillLight, setTime };
}