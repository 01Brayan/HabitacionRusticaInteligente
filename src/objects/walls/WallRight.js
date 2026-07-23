import * as THREE from 'three';
import { createWallWindowStatic } from './WallWindowStatic.js';

export function createWallRight() {
    const wallRightGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. PARED (tablones) -> plank_wall
    // ---------------------------------------------------------------
    const paredDiffuse = textureLoader.load('src/assets/textures/plank_wall/plank_wall_diff_2k.jpg');
    const paredNormal  = textureLoader.load('src/assets/textures/plank_wall/plank_wall_nor_gl_2k.jpg');
    const paredRough   = textureLoader.load('src/assets/textures/plank_wall/plank_wall_rough_2k.jpg');
    const paredAO      = textureLoader.load('src/assets/textures/plank_wall/plank_wall_ao_2k.jpg');

    paredDiffuse.colorSpace = THREE.SRGBColorSpace;
    [paredDiffuse, paredNormal, paredRough, paredAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 3); // mismo ajuste que en WallLeft.js, para que combinen
    });

    // ---------------------------------------------------------------
    // 2. MADERA (pilares, vigas horizontales, soportes) -> rough_wood
    // ---------------------------------------------------------------
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
    
    // ---------------------------------------------------------------
    // 3. PIEDRA (base de columnas) -> stone
    //    (esto era lo que faltaba, causaba el ReferenceError)
    // ---------------------------------------------------------------
    const piedraDiffuse = textureLoader.load('src/assets/textures/stone/stone_diff_2k.jpg');
    const piedraNormal  = textureLoader.load('src/assets/textures/stone/stone_nor_gl_2k.jpg');
    const piedraRough   = textureLoader.load('src/assets/textures/stone/stone_rough_2k.jpg');
    const piedraAO      = textureLoader.load('src/assets/textures/stone/stone_ao_2k.jpg');

    piedraDiffuse.colorSpace = THREE.SRGBColorSpace;
    [piedraDiffuse, piedraNormal, piedraRough, piedraAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1); // piezas chicas, poca repetición para que las piedras se vean a escala real
    });

    // ---------------------------------------------------------------
    // MATERIALES
    // ---------------------------------------------------------------
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
        color: 0x3A2718, // columnas
        roughness: 1.0,
    });

    const vigasHorizontalesMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x4A3220, // vigas
        roughness: 1.0,
    });

    const baseColumnaMat = new THREE.MeshStandardMaterial({
    map: piedraDiffuse,       // MISMA imagen base que wallMat (ya cargada, no gastas memoria extra)
    normalMap: piedraNormal,
    normalScale: new THREE.Vector2(0.4, 0.4),
    roughnessMap: piedraRough,
    aoMap: piedraAO,
    color: 0x5C554A,           // tinte propio, más gris/apagado que el 0x6E6259 de la pared
    roughness: 1.0,
    });

    //PAREDES DEL FONDO HACIA ADELANTE
    const wallGeo = new THREE.BoxGeometry(3, 33, 22);
    wallGeo.setAttribute('uv2', new THREE.BufferAttribute(wallGeo.attributes.uv.array, 2));

    const wall1 = new THREE.Mesh(wallGeo, wallMat);
    wall1.position.set(45.488, 16, 38.969);
    wallRightGroup.add(wall1);

    const wall2 = new THREE.Mesh(wallGeo, wallMat);
    wall2.position.set(45.488, 16, 11.969);
    wallRightGroup.add(wall2);

    //const wall3 = new THREE.Mesh(wallGeo, wallMat);
    // wall3.position.set(31.5, 12.5, -19);
    //wallRightGroup.add(wall3);

    //pared con ventana importado de wallwindowstatic.js
    const paredConVentanaFija = createWallWindowStatic();
    paredConVentanaFija.position.set(0, 0, 0);
    wallRightGroup.add(paredConVentanaFija);

    const wall4 = new THREE.Mesh(wallGeo, wallMat);
    wall4.position.set(45.488, 16, -42.031);
    wallRightGroup.add(wall4);

    //Pilares desde el fondo hacia adelante
    const pillarGeo = new THREE.BoxGeometry(7.5, 33, 5);
    pillarGeo.setAttribute('uv2', new THREE.BufferAttribute(pillarGeo.attributes.uv.array, 2));

    const pillar1 = new THREE.Mesh(pillarGeo, pilaresMat);
    pillar1.position.set(43.238, 16, 52.521);
    wallRightGroup.add(pillar1);

    const pillar2 = new THREE.Mesh(pillarGeo, pilaresMat);
    pillar2.position.set(43.238, 16, 25.521);
    wallRightGroup.add(pillar2);

    const pillar3 = new THREE.Mesh(pillarGeo, pilaresMat);
    pillar3.position.set(44.032, 16, -1.479);
    wallRightGroup.add(pillar3);

    const pillar4 = new THREE.Mesh(pillarGeo, pilaresMat);
    pillar4.position.set(44.029, 16, -28.531);
    wallRightGroup.add(pillar4);

    const pillar5 = new THREE.Mesh(pillarGeo, pilaresMat);
    pillar5.position.set(43.238, 16, -55.531);
    wallRightGroup.add(pillar5);

    // Viga horizontal
    const vigasHorizontalesGeo = new THREE.BoxGeometry(8, 5, 115.852);
    vigasHorizontalesGeo.setAttribute('uv2', new THREE.BufferAttribute(vigasHorizontalesGeo.attributes.uv.array, 2));

    const vigasHorizontales1 = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
    vigasHorizontales1.position.set(42.391, 33.25, -0.105);
    wallRightGroup.add(vigasHorizontales1);

    //cuadrados centrales para columnas de piedra
    const squareCentralGeo = new THREE.BoxGeometry(5, 4.2, 6);
    squareCentralGeo.setAttribute('uv2', new THREE.BufferAttribute(squareCentralGeo.attributes.uv.array, 2));
    // soporte de piedra desde el fondo hacia adelante
    const soporte1 = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
    soporte1.position.set(41.488, 1.6, 52.469);
    wallRightGroup.add(soporte1);
    const soporte2 = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
    soporte2.position.set(41.488, 1.6, 25.469);
    wallRightGroup.add(soporte2);
    const soporte3 = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
    soporte3.position.set(42.282, 1.6, -1.531);
    wallRightGroup.add(soporte3);
    const soporte4 = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
    soporte4.position.set(42.279, 1.6, -28.531);
    wallRightGroup.add(soporte4);
    const soporte5 = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
    soporte5.position.set(41.488, 1.6, -55.531);
    wallRightGroup.add(soporte5);
    //pequeño soporte de piedra superior
    const squareSuperiorGeo = new THREE.BoxGeometry(4.75, 1, 5.5);
    squareSuperiorGeo.setAttribute('uv2', new THREE.BufferAttribute(squareSuperiorGeo.attributes.uv.array, 2));
    const soporteSuperior1 = new THREE.Mesh(squareSuperiorGeo, baseColumnaMat);
    soporteSuperior1.position.set(41.613, 4.213, 52.521);
    wallRightGroup.add(soporteSuperior1);
    const soporteSuperior2 = new THREE.Mesh(squareSuperiorGeo, baseColumnaMat);
    soporteSuperior2.position.set(41.613, 4.213, 25.521);
    wallRightGroup.add(soporteSuperior2);
    const soporteSuperior3 = new THREE.Mesh(squareSuperiorGeo, baseColumnaMat);
    soporteSuperior3.position.set(42.407, 4.213, -1.479);
    wallRightGroup.add(soporteSuperior3);
    const soporteSuperior4 = new THREE.Mesh(squareSuperiorGeo, baseColumnaMat);
    soporteSuperior4.position.set(42.404, 4.213, -28.479);
    wallRightGroup.add(soporteSuperior4);
    const soporteSuperior5 = new THREE.Mesh(squareSuperiorGeo, baseColumnaMat);
    soporteSuperior5.position.set(41.613, 4.213, -55.479);
    wallRightGroup.add(soporteSuperior5);


    return wallRightGroup; // ¡MUY IMPORTANTE RETORNARLO!
}