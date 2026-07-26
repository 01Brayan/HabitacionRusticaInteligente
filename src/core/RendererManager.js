import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createRenderer(container) {
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Sombras suaves
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Esto es lo que hace que los colores cálidos del sol/fuego no se vean
    // "quemados" o planos, sino con el contraste tipo foto de la referencia
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    renderer.outputColorSpace = THREE.SRGBColorSpace;

    container.appendChild(renderer.domElement);

    return renderer;
}

/**
 * Genera un environment map procedural (no necesita ningún archivo .hdr)
 * y lo asigna a la escena. Sin esto, cualquier material con roughness bajo
 * (madera pulida, metal, vidrio) se ve plano porque no tiene nada que reflejar.
 *
 * Llamar UNA vez, después de tener renderer y scene creados:
 *   const renderer = createRenderer(container);
 *   const scene = createScene();
 *   applyEnvironment(scene, renderer);
 */
export function applyEnvironment(scene, renderer) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    scene.environment = envTexture;
    // scene.background = envTexture; // descomentar solo si querés que se vea como fondo/skybox

    pmrem.dispose();
    return envTexture;
}
