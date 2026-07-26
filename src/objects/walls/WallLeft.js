// ===============================================================
// PARED: PARED LATERAL IZQUIERDA CON VENTANAS MODULARES Y PILARES
// ===============================================================
import * as THREE from 'three';
import { createWallWindow } from './WallWindow.js';

export function createWallLeft() {
    const wallLeftGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. CARGA DE TEXTURAS (Pared de Tablones, Madera Rústica y Piedra)
    // ---------------------------------------------------------------
    const paredDiffuse = textureLoader.load('src/assets/textures/plank_wall/plank_wall_diff_2k.jpg');
    const paredNormal  = textureLoader.load('src/assets/textures/plank_wall/plank_wall_nor_gl_2k.jpg');
    const paredRough   = textureLoader.load('src/assets/textures/plank_wall/plank_wall_rough_2k.jpg');
    const paredAO      = textureLoader.load('src/assets/textures/plank_wall/plank_wall_ao_2k.jpg');

    paredDiffuse.colorSpace = THREE.SRGBColorSpace;
    [paredDiffuse, paredNormal, paredRough, paredAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 3); 
    });

    const maderaDiffuse = textureLoader.load('src/assets/textures/rough_wood/rough_wood_diff_2k.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/rough_wood/rough_wood_nor_gl_2k.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/rough_wood/rough_wood_rough_2k.jpg');
    const maderaAO      = textureLoader.load('src/assets/textures/rough_wood/rough_wood_ao_2k.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough, maderaAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
        tex.center.set(0.5, 0.5);
    });
    
    const piedraDiffuse = textureLoader.load('src/assets/textures/stone/stone_diff_2k.jpg');
    const piedraNormal  = textureLoader.load('src/assets/textures/stone/stone_nor_gl_2k.jpg');
    const piedraRough   = textureLoader.load('src/assets/textures/stone/stone_rough_2k.jpg');
    const piedraAO      = textureLoader.load('src/assets/textures/stone/stone_ao_2k.jpg');

    piedraDiffuse.colorSpace = THREE.SRGBColorSpace;
    [piedraDiffuse, piedraNormal, piedraRough, piedraAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1); 
    });

    // Materiales
    const wallMat = new THREE.MeshStandardMaterial({
        map: paredDiffuse,
        normalMap: paredNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: paredRough,
        aoMap: paredAO,
        color: 0x5C4530,
        roughness: 1.0,
    });

    const pilaresMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718, 
        roughness: 1.0,
    });

    const vigasHorizontalesMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x4A3220, 
        roughness: 1.0,
    });

    const baseColumnaMat = new THREE.MeshStandardMaterial({
        map: piedraDiffuse,       
        normalMap: piedraNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: piedraRough,
        aoMap: piedraAO,
        color: 0x5C554A,           
        roughness: 1.0,
    });

    // ---------------------------------------------------------------
    // 2. PAREDES Y VENTANAS MODULARES DEL FONDO HACIA ADELANTE
    // ---------------------------------------------------------------
    const wallGeo = new THREE.BoxGeometry(3, 33, 22);
    wallGeo.setAttribute('uv2', new THREE.BufferAttribute(wallGeo.attributes.uv.array, 2));

    // Paredes de Tablones Estáticas (Pared 1 y Pared 3)
    const posParedesEstanterias = [
        [-46.202, 16, 38.969], // Pared 1
        [-46.202, 16, -15.031] // Pared 3
    ];
    posParedesEstanterias.forEach(([x, y, z]) => {
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(x, y, z);
        wallLeftGroup.add(wall);
    });

    // Ventanas Modulares Importadas (Ventana 1 y Ventana 2)
    const posVentanas = [
        [0, 0, 54], // Ventana 2 (Fondo)
        [0, 0, 0]   // Ventana 1 (Frente)
    ];
    posVentanas.forEach(([x, y, z]) => {
        const ventana = createWallWindow();
        ventana.position.set(x, y, z);
        wallLeftGroup.add(ventana);
    });

    // ---------------------------------------------------------------
    // 3. PILARES / COLUMNAS DE MADERA DESDE EL FONDO HACIA ADELANTE
    // ---------------------------------------------------------------
    const pillarGeo = new THREE.BoxGeometry(7.5, 33, 5);
    pillarGeo.setAttribute('uv2', new THREE.BufferAttribute(pillarGeo.attributes.uv.array, 2));

    const posPilares = [
        [-43.952, 16, 52.521],  // Pilar 1 (Fondo)
        [-43.952, 16, 25.521],  // Pilar 2
        [-43.952, 16, -1.479],  // Pilar 3
        [-43.952, 16, -28.531], // Pilar 4
        [-43.952, 16, -55.531]  // Pilar 5 (Frente)
    ];
    posPilares.forEach(([x, y, z]) => {
        const pillar = new THREE.Mesh(pillarGeo, pilaresMat);
        pillar.position.set(x, y, z);
        wallLeftGroup.add(pillar);
    });

    // Viga Horizontal de Amarre Superior
    const vigasHorizontalesGeo = new THREE.BoxGeometry(8, 5, 115.852);
    vigasHorizontalesGeo.setAttribute('uv2', new THREE.BufferAttribute(vigasHorizontalesGeo.attributes.uv.array, 2));

    const vigasHorizontales1 = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
    vigasHorizontales1.position.set(-43.702, 33.25, -0.105);
    wallLeftGroup.add(vigasHorizontales1);

    // ---------------------------------------------------------------
    // 4. BASES DE PIEDRA BAJO LOS PILARES DESDE EL FONDO HACIA ADELANTE
    // ---------------------------------------------------------------
    // Soportes de Piedra Inferiores (Más grandes)
    const squareCentralGeo = new THREE.BoxGeometry(5, 4.2, 6);
    squareCentralGeo.setAttribute('uv2', new THREE.BufferAttribute(squareCentralGeo.attributes.uv.array, 2));
    const posSoportesInf = [
        [-42.213, 1.6, 52.469],  // Soporte 1
        [-42.213, 1.6, 25.469],  // Soporte 2
        [-42.213, 1.6, -1.531],  // Soporte 3
        [-42.213, 1.6, -28.531], // Soporte 4
        [-42.213, 1.6, -55.531]  // Soporte 5
    ];
    posSoportesInf.forEach(([x, y, z]) => {
        const soporte = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
        soporte.position.set(x, y, z);
        wallLeftGroup.add(soporte);
    });

    // Soportes de Piedra Superiores (Detalle más angosto)
    const squareSuperiorGeo = new THREE.BoxGeometry(4.75, 1, 5.5);
    squareSuperiorGeo.setAttribute('uv2', new THREE.BufferAttribute(squareSuperiorGeo.attributes.uv.array, 2));
    const posSoportesSup = [
        [-42.338, 4.213, 52.521],  // Soporte Superior 1
        [-42.338, 4.213, 25.521],  // Soporte Superior 2
        [-42.338, 4.213, -1.479],  // Soporte Superior 3
        [-42.338, 4.213, -28.479], // Soporte Superior 4
        [-42.338, 4.213, -55.479]  // Soporte Superior 5
    ];
    posSoportesSup.forEach(([x, y, z]) => {
        const soporte = new THREE.Mesh(squareSuperiorGeo, baseColumnaMat);
        soporte.position.set(x, y, z);
        wallLeftGroup.add(soporte);
    });

    // --esto fue modificado: Recorrido para la pared izquierda proyecte y reciba sombras
    wallLeftGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return wallLeftGroup;
}