// ===============================================================
// MUEBLE: CAMA Y CABECERA DE MADERA
// ===============================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createBed() {
    const bedGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // MATERIAL DE MADERA (PBR)
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
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: maderaRough,
        color: 0x3D2C1E,
        roughness: 1,
    });

    const madederaClaraMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: maderaRough,
        color: 0x6E5A3E,
        roughness: 1,
    });

    // ---------------------------------------------------------------
    // ESTRUCTURA DE LA CAMA
    // Base de la Cama
    const baseGeo = new THREE.BoxGeometry(20.75, 0.8, 25.1);
    const base = new THREE.Mesh(baseGeo, maderaMat);
    base.position.set(-0.308, 4.616, 41.805);

    // Paneles Laterales (Izquierda y Derecha)
    const panelLateralGeo = new THREE.BoxGeometry(0.7, 3.8, 24.5);
    const posPanelesLat = [
        [10.217, 4.216, 42.105], // Panel Lateral Izquierdo
        [-10.833, 4.216, 42.105]  // Panel Lateral Derecho
    ];
    posPanelesLat.forEach(([x, y, z]) => {
        const panel = new THREE.Mesh(panelLateralGeo, maderaMat);
        panel.position.set(x, y, z);
        bedGroup.add(panel);
    });

    bedGroup.add(base);

    // ---------------------------------------------------------------
    // CABECERA (Interior, Exterior, Marcos y Patas traseras)
    // Cabecera Interior y Exterior
    const cabeceraInferiorGeo = new THREE.BoxGeometry(19, 8.423, 1);
    const cabeceraInferior = new THREE.Mesh(cabeceraInferiorGeo, maderaMat);
    cabeceraInferior.position.set(-0.283, 9.711, 55.177);

    const cabeceraExteriorGeo = new THREE.BoxGeometry(15.472, 4.4, 0.3);
    const cabeceraExterior = new THREE.Mesh(cabeceraExteriorGeo, maderaMat);
    cabeceraExterior.position.set(-0.315, 9.843, 54.777);

    bedGroup.add(cabeceraInferior, cabeceraExterior);

    // Marcos de Cabecera (Verticales y Horizontales)
    const marcoVertiGeo = new THREE.BoxGeometry(1, 4.4, 1);
    const posMarcosVert = [
        [7.921, 9.843, 54.927], // Marco Vertical Izquierdo
        [-8.551, 9.843, 54.927]  // Marco Vertical Derecho
    ];
    posMarcosVert.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoVertiGeo, madederaClaraMat);
        marco.position.set(x, y, z);
        bedGroup.add(marco);
    });

    const marcoHorizontalGeo = new THREE.BoxGeometry(17.472, 1, 1);
    const posMarcosHoriz = [
        [-0.315, 12.543, 54.927], // Marco Horizontal Superior
        [-0.315, 7.143, 54.927]   // Marco Horizontal Inferior
    ];
    posMarcosHoriz.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoHorizontalGeo, madederaClaraMat);
        marco.position.set(x, y, z);
        bedGroup.add(marco);
    });

    // Patas de la Cabecera
    const patasVerticalesGeo = new THREE.BoxGeometry(1.7, 15, 1.7);
    const posPatasCabecera = [
        [9.967, 7, 55.119],  // Pata Cabecera Izquierda
        [-10.533, 7, 55.119] // Pata Cabecera Derecha
    ];
    posPatasCabecera.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(patasVerticalesGeo, maderaMat);
        pata.position.set(x, y, z);
        bedGroup.add(pata);
    });

    // ---------------------------------------------------------------
    // PARTE DELANTERA DE LA CAMA (Patas y Marcos delanteros)
    // Patas Delanteras
    const patasDelanterasGeo = new THREE.BoxGeometry(1.9, 8.2, 1.9);
    const posPatasDelanteras = [
        [9.817, 3.6, 28.905],  // Pata Delantera Izquierda
        [-10.433, 3.6, 28.905] // Pata Delantera Derecha
    ];
    posPatasDelanteras.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(patasDelanterasGeo, maderaMat);
        pata.position.set(x, y, z);
        bedGroup.add(pata);
    });

    // Marco Delantero Superior e Inferior
    const marcoDelanteroSuperiorGeo = new THREE.BoxGeometry(18.854, 2.2, 1.2);
    const marcoDelantero = new THREE.Mesh(marcoDelanteroSuperiorGeo, maderaMat);
    marcoDelantero.position.set(-0.056, 4.733, 28.855);

    const marcoInferiorGeo = new THREE.BoxGeometry(19.004, 1.2, 0.8);
    const marcoInferior = new THREE.Mesh(marcoInferiorGeo, maderaMat);
    marcoInferior.position.set(0.019, 3.033, 28.475);

    bedGroup.add(marcoDelantero, marcoInferior);

    // ---------------------------------------------------------------
    // 5. CARGA DEL MODELO 3D DEL COLCHÓN (GLTF)
    const loader = new GLTFLoader();
    loader.load('src/assets/models/BedWhite.glb', function (gltf) {
        const colchonImportado = gltf.scene;
        colchonImportado.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        colchonImportado.scale.set(1, 1, 1);
        colchonImportado.position.set(0, 1, 0);
        bedGroup.add(colchonImportado);
    }, undefined, function (error) {
        console.error('Error cargando el colchón:', error);
    });

    // todos los Mesh de la cama proyecten y reciban sombras
    bedGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return bedGroup;
}
