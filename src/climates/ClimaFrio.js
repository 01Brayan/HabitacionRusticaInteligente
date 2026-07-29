import * as THREE from 'three';

export function createClimaFrio(scene) {
    const state = { activo: false };

    // --- NIEBLA DENSA ---
    const nieblaBase = scene.fog;
    const nieblaFrio = new THREE.FogExp2(0x8aaccc, 0.009);

    // --- LLUVIA (particulas visibles por las ventanas) ---
    const cantidad = 3000;
    const geometria = new THREE.BufferGeometry();
    const posiciones = new Float32Array(cantidad * 3);
    const velocidades = new Float32Array(cantidad);

    const ancho = 200;
    const profundo = 200;
    const alto = 100;

    for (let i = 0; i < cantidad; i++) {
        posiciones[i * 3] = (Math.random() - 0.5) * ancho;
        posiciones[i * 3 + 1] = Math.random() * alto + 10;
        posiciones[i * 3 + 2] = (Math.random() - 0.5) * profundo;
        velocidades[i] = 0.3 + Math.random() * 0.4;
    }

    geometria.setAttribute('position', new THREE.BufferAttribute(posiciones, 3));

    const material = new THREE.PointsMaterial({
        color: 0x8ab8e0,
        size: 0.25,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const lluvia = new THREE.Points(geometria, material);
    lluvia.position.set(0, 0, 0);

    scene.add(lluvia);
    lluvia.visible = false;

    function activar() {
        if (state.activo) return;
        state.activo = true;

        scene.fog = nieblaFrio;
        lluvia.visible = true;
    }

    function desactivar() {
        if (!state.activo) return;
        state.activo = false;

        scene.fog = nieblaBase || null;
        lluvia.visible = false;
    }

    function toggle() {
        state.activo ? desactivar() : activar();
    }

    function update() {
        if (!state.activo) return;
        const positions = lluvia.geometry.attributes.position.array;
        for (let i = 0; i < cantidad; i++) {
            positions[i * 3 + 1] -= velocidades[i];
            if (positions[i * 3 + 1] < -5) {
                positions[i * 3 + 1] = alto + Math.random() * 20;
                positions[i * 3] = (Math.random() - 0.5) * ancho;
                positions[i * 3 + 2] = (Math.random() - 0.5) * profundo;
            }
        }
        lluvia.geometry.attributes.position.needsUpdate = true;
    }

    return { toggle, update, activar, desactivar, state };
}
