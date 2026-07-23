import * as THREE from 'three';

export function createTapeteRojo() {
    const tapeteGroup = new THREE.Group();
    tapeteGroup.name = "TapeteRojo";

    const textureLoader = new THREE.TextureLoader();

    const tapeteDiffuse = textureLoader.load('src/assets/decoraciones/TapeteRojo.jpg');
    tapeteDiffuse.colorSpace = THREE.SRGBColorSpace;

    const tapeteMat = new THREE.MeshStandardMaterial({
        map: tapeteDiffuse,
        roughness: 0.9, // Los tapetes son opacos y no brillan
    });

    const tapeteGeo = new THREE.BoxGeometry(25, 0.3, 25); 
    const tapete = new THREE.Mesh(tapeteGeo, tapeteMat);

    tapete.position.set(14.187, -0.35, -14.993); 

    tapete.receiveShadow = true; // Para que reciba la sombra de la cama y los muebles

    tapeteGroup.add(tapete);

    return tapeteGroup;
}