import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Genera una textura de cesped procedural (sin archivos externos).
// Se dibujan millones de "briznas" verdes con variacion de tono
// para simular pasto. La textura queda lista para repetirse.
function generarTexturaCesped() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base verde-oliva oscura y apagada (antes: #0f4620, muy saturado/frío)
    ctx.fillStyle = '#2b3620';
    ctx.fillRect(0, 0, size, size);

    // Parches de tierra/hojas secas — rompe la uniformidad "cesped de cancha"
    for (let i = 0; i < 300; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const tonoTierra = 25 + Math.random() * 20; // café-ocre
        ctx.fillStyle = `hsla(${tonoTierra}, 35%, ${18 + Math.random() * 10}%, ${0.2 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, 3 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // Briznas de pasto — rango de tono más cálido (evita el verde-azulado artificial)
    // y saturación/luminosidad más bajas (look apagado, no "cancha de fútbol")
    for (let i = 0; i < 4000; i++) {
        const x = Math.random() * size;
        const y = Math.random() * size;
        const tono = 65 + Math.random() * 40;   // antes 90-170 (cruzaba a turquesa) -> ahora 65-105 (amarillo-verde a verde)
        const sat = 25 + Math.random() * 20;    // antes 60% fijo -> ahora 25-45%, más apagado
        const luz = 20 + Math.random() * 18;    // controla directamente el brillo, antes dependía solo del alpha
        const alpha = 0.35 + Math.random() * 0.5;
        ctx.fillStyle = `hsla(${tono}, ${sat}%, ${luz}%, ${alpha})`;
        ctx.fillRect(x, y, 2, 4 + Math.random() * 5);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20); // repetir para cubrir el terreno grande
    texture.colorSpace = THREE.SRGBColorSpace; // faltaba — sin esto el canvas se interpreta con gamma incorrecto
    return texture;
}

export function createCesped() {
    const group = new THREE.Group();

    const cespedMat = new THREE.MeshStandardMaterial({
        map: generarTexturaCesped(),
        // Antes 0xffffff dejaba pasar el 100% de saturación de la textura.
        // Este tono cálido y ligeramente desaturado "calma" el verde final,
        // sin taparlo — funciona como un filtro suave, no como tinte fuerte.
        color: 0xdcd6b8,
        roughness: 1.0,
    });

    // El cesped es una caja grande que simula el terreno exterior.
    // AJUSTA estas medidas y posicion a tu gusto:
    const cespedGeo = new THREE.BoxGeometry(500, 10, 500.9);
    const cesped = new THREE.Mesh(cespedGeo, cespedMat);
    cesped.position.set(11.951, -18.773, 49.349);
    cesped.receiveShadow = true;

    group.add(cesped);

    const loader = new GLTFLoader();
    loader.load('src/assets/models/Arboles.glb', function (gltf) {
        const colchonImportado = gltf.scene;
        colchonImportado.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        colchonImportado.scale.set(1, 1, 1);
        colchonImportado.position.set(0, 1, 0);
        group.add(colchonImportado);
    }, undefined, function (error) {
        console.error('Error cargando los árboles:', error);
    });

    // todos los Mesh de la cama proyecten y reciban sombras
    group.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return { group, material: cespedMat };
}
