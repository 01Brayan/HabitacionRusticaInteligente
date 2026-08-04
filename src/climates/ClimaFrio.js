import * as THREE from 'three';

export function createClimaFrio(scene, hemiLight = null, fillLight = null) {
    const state = { activo: false };

    scene.userData.frioActivo = false;

    const nieblaBase = scene.fog;
    const nieblaFrio = new THREE.FogExp2(0x6a7a88, 0.006);

    let coloresGuardados = null;

    // PARTICULAS DE AIRE FRIO (polvo/vaho)
    const cantParticulas = 90;
    const geoms = new THREE.BufferGeometry();
    const posArr = new Float32Array(cantParticulas * 3);
    const velArr = new Float32Array(cantParticulas * 3);
    const room = { xMin: -46, xMax: 45, yMin: 2, yMax: 30, zMin: -55, zMax: 55 };

    for (let i = 0; i < cantParticulas; i++) {
        posArr[i * 3] = room.xMin + Math.random() * (room.xMax - room.xMin);
        posArr[i * 3 + 1] = room.yMin + Math.random() * (room.yMax - room.yMin);
        posArr[i * 3 + 2] = room.zMin + Math.random() * (room.zMax - room.zMin);
        velArr[i * 3] = (Math.random() - 0.5) * 0.02;
        velArr[i * 3 + 1] = (Math.random() - 0.5) * 0.015;
        velArr[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    geoms.setAttribute('position', new THREE.BufferAttribute(posArr, 3));

    const matParticulas = new THREE.PointsMaterial({
        color: 0xd0d8e0,
        size: 0.15,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    });

    const particulas = new THREE.Points(geoms, matParticulas);
    particulas.visible = false;
    scene.add(particulas);

    function activar() {
        if (state.activo) return;
        state.activo = true;
        scene.userData.frioActivo = true;
        scene.fog = nieblaFrio;
        particulas.visible = true;

        if (hemiLight) {
            coloresGuardados = {
                hemiSky: hemiLight.color.clone(),
                hemiGround: hemiLight.groundColor.clone(),
                fill: fillLight ? fillLight.color.clone() : null,
            };
            hemiLight.color.setHex(0x6a7a88);
            hemiLight.groundColor.setHex(0x3a4a58);
        }
        if (fillLight) {
            fillLight.color.setHex(0x5a6a78);
        }
    }

    function desactivar() {
        if (!state.activo) return;
        state.activo = false;
        scene.userData.frioActivo = false;
        scene.fog = nieblaBase || null;
        particulas.visible = false;

        if (hemiLight && coloresGuardados) {
            hemiLight.color.copy(coloresGuardados.hemiSky);
            hemiLight.groundColor.copy(coloresGuardados.hemiGround);
        }
        if (fillLight && coloresGuardados?.fill) {
            fillLight.color.copy(coloresGuardados.fill);
        }
        coloresGuardados = null;
    }

    function toggle() {
        state.activo ? desactivar() : activar();
    }

    function update() {
        if (!state.activo) return;

        // B) Rafagas: la densidad pulsa suavemente
        nieblaFrio.density = 0.006 + Math.sin(Date.now() * 0.0003) * 0.0025;

        // C) Mover particulas de aire frio
        const positions = particulas.geometry.attributes.position.array;
        for (let i = 0; i < cantParticulas; i++) {
            positions[i * 3] += velArr[i * 3];
            positions[i * 3 + 1] += velArr[i * 3 + 1];
            positions[i * 3 + 2] += velArr[i * 3 + 2];

            // Rebotar en los bordes de la habitacion
            if (positions[i * 3] < room.xMin || positions[i * 3] > room.xMax) velArr[i * 3] *= -1;
            if (positions[i * 3 + 1] < room.yMin || positions[i * 3 + 1] > room.yMax) velArr[i * 3 + 1] *= -1;
            if (positions[i * 3 + 2] < room.zMin || positions[i * 3 + 2] > room.zMax) velArr[i * 3 + 2] *= -1;
        }
        particulas.geometry.attributes.position.needsUpdate = true;
    }

    return { toggle, update, activar, desactivar, state };
}
