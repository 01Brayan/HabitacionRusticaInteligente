import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createBarril() {
    const barrilGroup = new THREE.Group();
    barrilGroup.name = "BarrilModelo";

    const textureLoader = new THREE.TextureLoader();

    const loader = new GLTFLoader();
    loader.load('src/assets/models/Barril.glb', function (gltf) {
        const barrilMesh = gltf.scene;

        barrilMesh.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material) {
                    child.material.roughness = 0.95;
                    child.material.metalness = 0;
                    child.material.color.multiplyScalar(0.45);
                    if (child.material.map) {
                        child.material.map.colorSpace = THREE.SRGBColorSpace;
                    }
                }
            }
        });

        barrilMesh.scale.set(1, 1, 1);
        barrilMesh.position.set(0, 0, 0);
        barrilGroup.add(barrilMesh);

    }, undefined, function (error) {
        console.error('Error al cargar el barril:', error);
    });

    return barrilGroup;
}
