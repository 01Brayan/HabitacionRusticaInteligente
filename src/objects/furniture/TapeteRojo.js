import * as THREE from 'three';

export function createTapeteRojo() {
    const tapeteGroup = new THREE.Group();
    tapeteGroup.name = "TapeteRojo";

    const textureLoader = new THREE.TextureLoader();

    const tapeteDiffuse = textureLoader.load('src/assets/decoraciones/TapeteRojo.jpg');
    tapeteDiffuse.colorSpace = THREE.SRGBColorSpace;

    const tapeteMat = new THREE.MeshStandardMaterial({
        map: tapeteDiffuse,
        bumpMap: tapeteDiffuse,   // la misma textura en escala de grises simula el relieve de la tela
        bumpScale: 0.3,           // profundidad del relieve
        roughness: 1.0,           // la tela no refleja absolutamente nada
    });

    const tapeteGeo = new THREE.BoxGeometry(25, 0.3, 25); 
    const tapete = new THREE.Mesh(tapeteGeo, tapeteMat);

    tapete.position.set(14.187, -0.35, -14.993); 

    tapete.receiveShadow = true; // Para que reciba la sombra de la cama y los muebles

    tapeteGroup.add(tapete);

    return tapeteGroup;
}