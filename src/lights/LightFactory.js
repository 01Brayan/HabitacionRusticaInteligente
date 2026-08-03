import * as THREE from 'three';

// Única responsabilidad: construir una PointLight lista para usar
// a partir de una config de LightTypes.js.

export function createLight(type) {
    return new THREE.PointLight(
        type.color,
        0, // arranca apagada; InteriorLightsManager decide la intensidad real
        type.distance,
        type.decay
    );
}