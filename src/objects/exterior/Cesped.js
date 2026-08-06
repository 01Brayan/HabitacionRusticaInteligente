import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Paletas de colores fijas
const VERDES = ['#3a5a24', '#4a7030', '#557a33', '#2f4a1d', '#6a8a3a'];
const TIERRAS = ['#3d2b1a', '#4a3523', '#553d28', '#2e2112'];

// Genera una textura de césped procedural (sin archivos externos).
// Se dibujan parches de tierra y briznas de pasto con colores de las paletas.
function generarTexturaCesped() {
    const size = 256;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // 1. Base verde-oliva
    ctx.fillStyle = '#2b3620';
    ctx.fillRect(0, 0, size, size);

    // 2. Parches de tierra (un color café al azar de la paleta)
    for (let i = 0; i < 300; i++) {
        ctx.fillStyle = TIERRAS[(Math.random() * TIERRAS.length) | 0];
        ctx.globalAlpha = 0.2 + Math.random() * 0.3;
        ctx.beginPath();
        ctx.arc(Math.random() * size, Math.random() * size, 3 + Math.random() * 6, 0, Math.PI * 2);
        ctx.fill();
    }

    // 3. Briznas de pasto (un color verde al azar de la paleta)
    ctx.globalAlpha = 1;
    for (let i = 0; i < 4000; i++) {
        ctx.fillStyle = VERDES[(Math.random() * VERDES.length) | 0];
        ctx.globalAlpha = 0.35 + Math.random() * 0.5;
        ctx.fillRect(Math.random() * size, Math.random() * size, 2, 4 + Math.random() * 5);
    }
    ctx.globalAlpha = 1;

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(20, 20);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

export function createCesped() {
    const group = new THREE.Group();

    const cespedMat = new THREE.MeshStandardMaterial({
        map: generarTexturaCesped(),
        color: 0xdcd6b8,
        roughness: 1.0,
    });

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


    group.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return { group, material: cespedMat };
}
