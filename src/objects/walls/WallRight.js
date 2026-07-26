// ===============================================================
// PARED: PARED LATERAL DERECHA CON VENTANA FIJA Y PILARES
// ===============================================================
import * as THREE from 'three';
import { createWallWindowStatic } from './WallWindowStatic.js';

export function createWallRight() {
    const wallRightGroup = new THREE.Group();
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
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: paredRough,
        aoMap: paredAO,
        color: 0x5C4530,
        roughness: 1.0,
    });

    const pilaresMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718, 
        roughness: 1.0,
    });

    const vigasHorizontalesMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
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
    // 2. PAREDES DE TABLONES ESTÁTICAS Y VENTANA MODULAR FIJA
    // ---------------------------------------------------------------
    const wallGeo = new THREE.BoxGeometry(3, 33, 22);
    wallGeo.setAttribute('uv2', new THREE.BufferAttribute(wallGeo.attributes.uv.array, 2));

    // Paredes Estáticas (Pared 1, Pared 2 y Pared 4)
    const posParedesEstaticas = [
        [45.488, 16, 38.969], // Pared 1 (Fondo)
        [45.488, 16, 11.969], // Pared 2
        [45.488, 16, -42.031] // Pared 4 (Frente)
    ];
    posParedesEstaticas.forEach(([x, y, z]) => {
        const wall = new THREE.Mesh(wallGeo, wallMat);
        wall.position.set(x, y, z);
        wallRightGroup.add(wall);
    });

    // Pared con ventana modular fija (Importado de WallWindowStatic.js)
    const paredConVentanaFija = createWallWindowStatic();
    paredConVentanaFija.position.set(0, 0, 0);
    wallRightGroup.add(paredConVentanaFija);

    // ---------------------------------------------------------------
    // 3. PILARES / COLUMNAS DE MADERA DESDE EL FONDO HACIA ADELANTE
    // ---------------------------------------------------------------
    const pillarGeo = new THREE.BoxGeometry(7.5, 33, 5);
    pillarGeo.setAttribute('uv2', new THREE.BufferAttribute(pillarGeo.attributes.uv.array, 2));

    const posPilares = [
        [43.238, 16, 52.521],  // Pilar 1 (Fondo)
        [43.238, 16, 25.521],  // Pilar 2
        [44.032, 16, -1.479],  // Pilar 3 (Con desfase leve de posición)
        [44.029, 16, -28.531], // Pilar 4 (Con desfase leve de posición)
        [43.238, 16, -55.531]  // Pilar 5 (Frente)
    ];
    posPilares.forEach(([x, y, z]) => {
        const pillar = new THREE.Mesh(pillarGeo, pilaresMat);
        pillar.position.set(x, y, z);
        wallRightGroup.add(pillar);
    });

    // Viga de Amarre Superior
    const vigasHorizontalesGeo = new THREE.BoxGeometry(8, 5, 115.852);
    vigasHorizontalesGeo.setAttribute('uv2', new THREE.BufferAttribute(vigasHorizontalesGeo.attributes.uv.array, 2));

    const vigasHorizontales1 = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
    vigasHorizontales1.position.set(42.391, 33.25, -0.105);
    wallRightGroup.add(vigasHorizontales1);

    // ---------------------------------------------------------------
    // 4. BASES DE PIEDRA BAJO LOS PILARES
    // ---------------------------------------------------------------
    // Soportes de Piedra Inferiores (Más grandes)
    const squareCentralGeo = new THREE.BoxGeometry(5, 4.2, 6);
    squareCentralGeo.setAttribute('uv2', new THREE.BufferAttribute(squareCentralGeo.attributes.uv.array, 2));
    const posSoportesInf = [
        [41.488, 1.6, 52.469],  // Soporte 1 (Fondo)
        [41.488, 1.6, 25.469],  // Soporte 2
        [42.282, 1.6, -1.531],  // Soporte 3 (Con desfase leve)
        [42.279, 1.6, -28.531], // Soporte 4 (Con desfase leve)
        [41.488, 1.6, -55.531]  // Soporte 5 (Frente)
    ];
    posSoportesInf.forEach(([x, y, z]) => {
        const soporte = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
        soporte.position.set(x, y, z);
        wallRightGroup.add(soporte);
    });

    // Soportes de Piedra Superiores (Detalle más angosto)
    const squareSuperiorGeo = new THREE.BoxGeometry(4.75, 1, 5.5);
    squareSuperiorGeo.setAttribute('uv2', new THREE.BufferAttribute(squareSuperiorGeo.attributes.uv.array, 2));
    const posSoportesSup = [
        [41.613, 4.213, 52.521],  // Soporte Superior 1 (Fondo)
        [41.613, 4.213, 25.521],  // Soporte Superior 2
        [42.407, 4.213, -1.479],  // Soporte Superior 3 (Con desfase)
        [42.404, 4.213, -28.479], // Soporte Superior 4 (Con desfase)
        [41.613, 4.213, -55.479]  // Soporte Superior 5 (Frente)
    ];
    posSoportesSup.forEach(([x, y, z]) => {
        const soporte = new THREE.Mesh(squareSuperiorGeo, baseColumnaMat);
        soporte.position.set(x, y, z);
        wallRightGroup.add(soporte);
    });

    // --esto fue modificado: Recorrido para la pared derecha proyecte y reciba sombras
    wallRightGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return wallRightGroup;
}