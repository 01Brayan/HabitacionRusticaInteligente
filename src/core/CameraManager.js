import * as THREE from 'three';

export function createCamera(){
    const camera = new THREE.PerspectiveCamera(
        40,
        window.innerWidth/window.innerHeight, //relacion de aspecto
        0.1,
        30000
    )
    camera.position.set(1, 6, 40);
    return camera;
}
