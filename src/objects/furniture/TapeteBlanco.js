import * as THREE from 'three';

export function createTapeteBlanco() {
    const tapeteGroup = new THREE.Group();
    tapeteGroup.name = "TapetePrincipal";

    const textureLoader = new THREE.TextureLoader();

    const tapeteDiffuse = textureLoader.load('src/assets/decoraciones/TapeteBlanco.jpg');
    tapeteDiffuse.colorSpace = THREE.SRGBColorSpace;

    const tapeteMat = new THREE.MeshStandardMaterial({
        map: tapeteDiffuse,
        roughness: 0.9, // Los tapetes son opacos y no brillan
    });

    const tapeteGeo = new THREE.BoxGeometry(50.203, 0.36, 31.923); 
    const tapete = new THREE.Mesh(tapeteGeo, tapeteMat);

    tapete.position.set(-1.177, -0.32, 25.595); 

    tapete.receiveShadow = true; // Para que reciba la sombra de la cama y los muebles

    tapeteGroup.add(tapete);

    return tapeteGroup;
}