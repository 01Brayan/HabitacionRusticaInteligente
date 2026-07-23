import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createBed() {
    const bedGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
// ---------------------------------------------------------------
    // TEXTURA DE MADERA (misma que buró/ropero/estantería)
    // ---------------------------------------------------------------
    const maderaDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
    });

    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.55, 0.55),
        roughnessMap: maderaRough,
        color: 0x3D2C1E,
        roughness: 0.68,
    });

    // Estructura base de la cama
    const baseGeo = new THREE.BoxGeometry(20.75, 0.8, 25.1);
    const base = new THREE.Mesh(baseGeo, maderaMat);
    base.position.set(-0.308, 4.616, 41.805);
    bedGroup.add(base);
    //partes de la cabecera 
    //============================================0
    //cabecera interior
    const cabeceraInferiorGeo = new THREE.BoxGeometry(19, 8.423, 1);
    const cabeceraInferior = new THREE.Mesh(cabeceraInferiorGeo, maderaMat);
    cabeceraInferior.position.set(-0.283, 9.711, 55.177); // Ajusta la posición de la cabecera
    bedGroup.add(cabeceraInferior);
    //cabecerza exterior
    const cabeceraExteriorGeo = new THREE.BoxGeometry(15.472, 4.4, 0.3);
    const cabeceraExterior = new THREE.Mesh(cabeceraExteriorGeo, maderaMat);
    cabeceraExterior.position.set(-0.315, 9.843, 54.777); // Ajusta la posición de la cabecera
    bedGroup.add(cabeceraExterior);
    // marco de cabecera exterior
    //marco vertical
    const marcoVertiGeo = new THREE.BoxGeometry(1, 4.4, 1);
    const marcoVertiIzquier = new THREE.Mesh(marcoVertiGeo, maderaMat);
    marcoVertiIzquier.position.set(7.921, 9.843, 54.927); // Ajusta la posición de la cabecera
    
    const marcoVertiDer = new THREE.Mesh(marcoVertiGeo, maderaMat);
    marcoVertiDer.position.set(-8.551, 9.843, 54.927); 

    //marco horizontal
    const marcoHorizontalGeo = new THREE.BoxGeometry(17.472, 1, 1);
    const marcoHorizontalSuperior = new THREE.Mesh(marcoHorizontalGeo, maderaMat);
    marcoHorizontalSuperior.position.set(-0.315, 12.543, 54.927); // Ajusta la posición de la cabecera
    
    const marcoHorizontalInferior = new THREE.Mesh(marcoHorizontalGeo, maderaMat);
    marcoHorizontalInferior.position.set(-0.315, 7.143, 54.927); 
    bedGroup.add(marcoHorizontalSuperior, marcoHorizontalInferior,marcoVertiIzquier, marcoVertiDer );
     //patas de la cabecera
    const patasVerticalesGeo = new THREE.BoxGeometry(1.7, 15, 1.7);
    
    const pataIzquierda = new THREE.Mesh(patasVerticalesGeo, maderaMat);
    pataIzquierda.position.set(9.967, 7, 55.119);
    const pataDerecha = new THREE.Mesh(patasVerticalesGeo, maderaMat);
    pataDerecha.position.set(-10.533, 7, 55.119);
    bedGroup.add(pataIzquierda, pataDerecha);


    // Panel/falda LATERAL (nuevo — se ve en la foto, conecta las patas a los lados)
    const panelLateralGeo = new THREE.BoxGeometry(0.7, 3.8, 24.5);
    const panelLateralIzq = new THREE.Mesh(panelLateralGeo, maderaMat);
    panelLateralIzq.position.set(10.217, 4.216, 42.105);
    const panelLateralDer = new THREE.Mesh(panelLateralGeo, maderaMat);
    panelLateralDer.position.set(-10.833, 4.216, 42.105);
    bedGroup.add(panelLateralIzq, panelLateralDer);



    //parte delantera de la cama
    const patasDelanterasGeo = new THREE.BoxGeometry(1.9, 8.2, 1.9);
    const pataDelantera1 = new THREE.Mesh(patasDelanterasGeo, maderaMat);
    pataDelantera1.position.set(9.817, 3.6, 28.905);
    const pataDelantera2 = new THREE.Mesh(patasDelanterasGeo, maderaMat);
    pataDelantera2.position.set(-10.433, 3.6, 28.905);
    bedGroup.add(pataDelantera1, pataDelantera2);

    //marco de la parte delantera
    //marco superior
    const marcoDelanteroSuperiorGeo = new THREE.BoxGeometry(18.854, 2.2, 1.2);
    const marcoDelantero = new THREE.Mesh(marcoDelanteroSuperiorGeo, maderaMat);
    marcoDelantero.position.set(-0.056, 4.733, 28.855);
    bedGroup.add(marcoDelantero);
    //marco inferior
    const marcoInferiorGeo = new THREE.BoxGeometry(19.004, 1.2, 0.8);
    const marcoInferior = new THREE.Mesh(marcoInferiorGeo, maderaMat);
    marcoInferior.position.set(0.019, 3.033, 28.475);
    bedGroup.add(marcoInferior);
//CARGAR EL NUEVO MODELO GLB
const loader = new GLTFLoader();
    
    // Asegúrate de que esta ruta apunte a donde guardaste tu archivo
    loader.load('src/assets/models/BedWhite1.glb', function (gltf) {
        const colchonImportado = gltf.scene;

        // Hacer que el modelo proyecte y reciba sombras
        colchonImportado.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        // Escala: Si está muy grande, pon 0.5 o 0.1. Si está pequeño, pon 2 o 3.
        colchonImportado.scale.set(1, 1, 1); // <- AJUSTAR
        
        // Posición: Múevelo hacia arriba (Y) para que descanse sobre las tablas
        colchonImportado.position.set(0, 1, 0); // <- AJUSTAR
        
        // Si necesitas rotarlo para que apunte al lado correcto:
        // colchonImportado.rotation.y = Math.PI / 2; // Rota 90 grados

        bedGroup.add(colchonImportado);

    }, undefined, function (error) {
        console.error('Ups, hubo un error cargando el modelo:', error);
    });



    return bedGroup; // ¡MUY IMPORTANTE RETORNARLO!
}
