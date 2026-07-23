import * as THREE from 'three'; //asterisco significa todo

export function createScene(){
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);
    return scene;

}

//haber que solo se quiera ver la escena que hace la luz 