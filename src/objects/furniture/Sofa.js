// ===============================================================
// MUEBLE: SOFÁ PRINCIPAL
// ===============================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createSofa() {
    const sofaGroup = new THREE.Group();
    sofaGroup.name = "sofaPrincipal";

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // MATERIALES (Madera PBR)
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
        map: maderaDiffuse, normalMap: maderaNormal, roughnessMap: maderaRough,
        normalScale: new THREE.Vector2(0.55, 0.55), // --esto fue modificado: agregado normalScale para relieve de madera
        color: 0x1a0f08, roughness: 0.5,
    });
    const maderaClara = new THREE.MeshStandardMaterial({
        map: maderaDiffuse, normalMap: maderaNormal, roughnessMap: maderaRough,
        normalScale: new THREE.Vector2(0.55, 0.55), // --esto fue modificado: agregado normalScale para relieve en madera oscura
        color: 0x6E5A3E, roughness: 0.55,
    });

    // ---------------------------------------------------------------
    // BASE Y ESPALDERO DE MADERA
    // ---------------------------------------------------------------
    // Base principal
    const baseGeo = new THREE.BoxGeometry(9.272, 1.039, 27.317);
    const base = new THREE.Mesh(baseGeo, maderaMat);
    base.position.set(33.458, 4.055, -15.228);

    // Espaldero
    const espalderoGeo = new THREE.BoxGeometry(1.685, 7.563, 26.989);
    const espaldero = new THREE.Mesh(espalderoGeo, maderaMat);
    espaldero.position.set(38.936, 7.477, -15.064);

    sofaGroup.add(base, espaldero);

    // ---------------------------------------------------------------
    // PATAS TRASERAS Y DELANTERAS
    // ---------------------------------------------------------------
    // Patas Traseras
    const pataTraseraGeo = new THREE.BoxGeometry(1.685, 10.594, 2.06);
    const posPatasTras = [
        [38.936, 4.797, -29.589], // Patas Izquierda
        [38.936, 4.797, -0.539]   // Patas Derecha
    ];
    posPatasTras.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(pataTraseraGeo, maderaMat);
        pata.position.set(x, y, z);
        sofaGroup.add(pata);
    });

    // Patas Delanteras
    const pataDelanteraGeo = new THREE.BoxGeometry(1.873, 9.433, 1.873);
    const posPatasDel = [
        [28.728, 4.217, -29.495], // Patas Izquierda
        [28.728, 4.217, -0.633]   // Patas Derecha
    ];
    posPatasDel.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(pataDelanteraGeo, maderaMat);
        pata.position.set(x, y, z);
        sofaGroup.add(pata);
    });

    // Patas Delanteras Centrales Extras
    const pataCentralGeo = new THREE.BoxGeometry(1.56, 2.578, 1.873);
    const posPatasCentrales = [
        [28.572, 0.789, -27.623],
        [28.572, 0.789, -2.506]
    ];
    posPatasCentrales.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(pataCentralGeo, maderaMat);
        pata.position.set(x, y, z);
        sofaGroup.add(pata);
    });

    // ---------------------------------------------------------------
    // DECORACIÓN Y MARCOS DELANTEROS / ZÓCALO
    // ---------------------------------------------------------------
    // Marcos Delanteros sobre las Patas (Inferior, Central, Superior)
    const marcoFrontalConfig = [
        { geo: new THREE.BoxGeometry(0.281, 3.845, 1.873), pos: [[27.651, 1.423, -29.495], [27.651, 1.423, -0.633]], mat: maderaMat }, // Inferior
        { geo: new THREE.BoxGeometry(0.281, 4.654, 1.212), pos: [[27.651, 5.673, -29.495], [27.651, 5.673, -0.633]], mat: maderaClara }, // Central
        { geo: new THREE.BoxGeometry(0.281, 0.933, 1.873), pos: [[27.651, 8.467, -29.495], [27.651, 8.467, -0.633]], mat: maderaMat }  // Superior
    ];
    marcoFrontalConfig.forEach(({ geo, pos, mat }) => {
        pos.forEach(([x, y, z]) => {
            const marco = new THREE.Mesh(geo, mat);
            marco.position.set(x, y, z);
            sofaGroup.add(marco);
        });
    });

    // Marcos Laterales
    const marcoLateralGeo = new THREE.BoxGeometry(0.281, 4.654, 0.331);
    const posMarcosLat = [
        [27.651, 5.673, -30.266], [27.651, 5.673, -28.724],
        [27.651, 5.673, -1.404],  [27.651, 5.673, 0.138]
    ];
    posMarcosLat.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoLateralGeo, maderaMat);
        marco.position.set(x, y, z);
        sofaGroup.add(marco);
    });

    // Zócalos Frontales (Superior, Central, Inferior)
    const zocalosConfig = [
        { geo: new THREE.BoxGeometry(1.311, 0.632, 26.99), y: 4.151 }, // Superior
        { geo: new THREE.BoxGeometry(1.311, 0.678, 26.99), y: 3.496 }, // Central
        { geo: new THREE.BoxGeometry(0.749, 1.079, 26.99), y: 2.617 }  // Inferior
    ];
    zocalosConfig.forEach(({ geo, y }) => {
        const zocalo = new THREE.Mesh(geo, maderaMat);
        zocalo.position.set(28.166, y, -15.064);
        sofaGroup.add(zocalo);
    });

    // ---------------------------------------------------------------
    // REPOSABRAZOS Y LATERALES DEL SOFÁ
    // ---------------------------------------------------------------
    // Maderas Laterales de Apoyo (Superior e Inferior)
    const maderaLatGeo = new THREE.BoxGeometry(8.429, 0.859, 1.685);
    const posMaderaLat = [
        [33.879, 8.504, -29.401], [33.879, 8.504, -0.727], // Superior Izq y Der
        [33.879, 1.802, -29.401], [33.879, 1.802, -0.727]  // Inferior Izq y Der
    ];
    posMaderaLat.forEach(([x, y, z]) => {
        const madera = new THREE.Mesh(maderaLatGeo, maderaMat);
        madera.position.set(x, y, z);
        sofaGroup.add(madera);
    });

    // Maderas Centrales de Apoyo (4 niveles a cada lado)
    const maderaCentralGeo = new THREE.BoxGeometry(8.429, 1.404, 1.077);
    const posMaderaCentral = [
        // Lado Izquierdo
        [33.879, 7.372, -29.425], [33.879, 5.893, -29.425],
        [33.879, 4.413, -29.425], [33.879, 2.934, -29.425],
        // Lado Derecho
        [33.879, 7.372, -0.824],  [33.879, 5.893, -0.824],
        [33.879, 4.413, -0.824],  [33.879, 2.934, -0.824]
    ];
    posMaderaCentral.forEach(([x, y, z]) => {
        const madera = new THREE.Mesh(maderaCentralGeo, maderaClara);
        madera.position.set(x, y, z);
        sofaGroup.add(madera);
    });

    // Posadores de Brazos (Capas de reposabrazos)
    const reposabrazosConfig = [
        { geo: new THREE.BoxGeometry(10.684, 0.266, 2.247), pos: [[32.751, 9.066, -29.495], [32.751, 9.066, -0.446]], mat: maderaClara   }, // Inferior
        { geo: new THREE.BoxGeometry(10.308, 0.561, 1.498), pos: [[32.939, 9.479, -29.495], [32.939, 9.479, -0.446]], mat: maderaMat  }, // Central
        { geo: new THREE.BoxGeometry(12.23,  0.266, 2.06),  pos: [[33.664, 10.159, -29.495], [33.664, 10.159, -0.446]], mat: maderaClara  }, // Superior Largo
        { geo: new THREE.BoxGeometry(10.426, 0.266, 1.817), pos: [[32.88, 9.893, -29.495],  [32.88, 9.893, -0.446]], mat: maderaClara  }   // Superior Corto
    ];
    reposabrazosConfig.forEach(({ geo, pos, mat }) => {
        pos.forEach(([x, y, z]) => {
            const pieza = new THREE.Mesh(geo, mat);
            pieza.position.set(x, y, z);
            sofaGroup.add(pieza);
        });
    });

    // ---------------------------------------------------------------
    // CARGA DEL MODELO 3D DE LOS COJINES (GLTF)
    // ---------------------------------------------------------------
    const loader = new GLTFLoader();
    loader.load('src/assets/models/Sofa.glb', function (gltf) {
        const cojinesImportados = gltf.scene;
        cojinesImportados.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        cojinesImportados.scale.set(1, 1, 1);
        cojinesImportados.position.set(0, 0, 0);
        sofaGroup.add(cojinesImportados);
    }, undefined, function (error) {
        console.error('Error cargando los cojines del sofá:', error);
    });

    // Recorrido para activar sombras proyectadas y recibidas en el sofá completo
    sofaGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return sofaGroup;
}