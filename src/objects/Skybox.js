import * as THREE from 'three';
export function createSkybox() {
    const loader = new THREE.TextureLoader();
    // Cargamos las 6 texturas en orden: +X, -X, +Y, -Y, +Z, -Z
    const materialArray = [
        new THREE.MeshBasicMaterial({ map: loader.load('src/assets/arid2_ft.jpg'), side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('src/assets/arid2_bk.jpg'), side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('src/assets/arid2_up.jpg'), side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('src/assets/arid2_dn.jpg'), side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('src/assets/arid2_rt.jpg'), side: THREE.BackSide }),
        new THREE.MeshBasicMaterial({ map: loader.load('src/assets/arid2_lf.jpg'), side: THREE.BackSide })
    ];
    
    // Creen un cubo gigante que envuelva todo
    const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
    const skybox = new THREE.Mesh(skyboxGeo, materialArray);
    return skybox;
}