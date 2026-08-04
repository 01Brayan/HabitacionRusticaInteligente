// TERRAZA / AZOTEA EXTERIOR frente a la puerta (madera oscura)
import * as THREE from 'three';

export function createTerraza() {
    const group = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();

    // Misma receta de madera oscura que WallFront
    const maderaDiffuse = textureLoader.load('src/assets/textures/rough_wood/rough_wood_diff_2k.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/rough_wood/rough_wood_nor_gl_2k.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/rough_wood/rough_wood_rough_2k.jpg');
    const maderaAO      = textureLoader.load('src/assets/textures/rough_wood/rough_wood_ao_2k.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough, maderaAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
    });


    const diffuseMap = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_diff_2k.jpg');
    const normalMap  = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_nor_gl_2k.jpg');
    const roughMap   = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_rough_2k.jpg');
    const aoMap      = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_ao_2k.jpg');

    diffuseMap.colorSpace = THREE.SRGBColorSpace;

    [diffuseMap, normalMap, roughMap, aoMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1.5, 1.5);
    });


    const maderaOscuraMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718,
        roughness: 1.0,
    });

    const floorMat = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        roughnessMap: roughMap,
        aoMap: aoMap,
        color: 0x3E2817, // <-- tu tinte de color definido para el piso
        roughness: 1.0,  // en 1.0 porque el roughMap ya trae la variación real
    });

    // ================================================
    // PLATAFORMA SUPERIOR (donde van los asientos)
    // AJUSTA medidas y posicion:
    // ================================================
    const plataformaSuperiorGeo = new THREE.BoxGeometry(94.815, 1.34, 29.199);
    const plataformaSuperior = new THREE.Mesh(plataformaSuperiorGeo, floorMat);
    plataformaSuperior.position.set(-0.419, -1.17, -72.63);
    group.add(plataformaSuperior);

    // ================================================
    // NIVEL INFERIOR (simula altura, mas realismo)
    // AJUSTA medidas y posicion:
    // ================================================
    const nivelInferiorGeo = new THREE.BoxGeometry(93.557, 4.314, 28.113);
    const nivelInferior = new THREE.Mesh(nivelInferiorGeo, maderaOscuraMat);
    nivelInferior.position.set(-0.404, -3.997, -72.087);
    group.add(nivelInferior);

    // ================================================
    // PATAS / SOPORTES (deja plantilla, ajusta a gusto)
    // ================================================
    const pataGeo = new THREE.BoxGeometry(3, 7.684, 3);
    const posicionesPatas = [
        [44.056, -9.996, -83.309],
        [16.056, -9.996, -83.309],
        [-17.154, -9.996, -83.309],
        [-45.154, -9.996, -83.309],
    ];
    posicionesPatas.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(pataGeo, maderaOscuraMat);
        pata.position.set(x, y, z);
        group.add(pata);
    });

    // ================================================
    // ESCALERA (plantilla de peldaños, ajusta a gusto)
    // ================================================
    const peldañoGeo = new THREE.BoxGeometry(25.82, 1.34, 6.586);
    const peldaño1 = new THREE.Mesh(peldañoGeo, maderaOscuraMat);
    peldaño1.position.set(0.103, -4.859, -87.805);
    group.add(peldaño1);

    const peldaño2 = new THREE.Mesh(peldañoGeo, maderaOscuraMat);
    peldaño2.position.set(0.16, -8.137, -92.432);
    group.add(peldaño2);

    const peldaño3 = new THREE.Mesh(peldañoGeo, maderaOscuraMat);
    peldaño3.position.set(0.16, -11.366, -97.607);
    group.add(peldaño3);
    //barra diagonal
    const barraDiagonalGeo = new THREE.BoxGeometry(2.149, 6.154, 32.427);
    const barraDiagonalIzquierda = new THREE.Mesh(barraDiagonalGeo, maderaOscuraMat);
    barraDiagonalIzquierda.position.set(13.026, -12.286, -97.752);
    barraDiagonalIzquierda.rotation.set(THREE.MathUtils.degToRad(-34.283), 0, 0);
    const barraDiagonalDerecha = new THREE.Mesh(barraDiagonalGeo, maderaOscuraMat);
    barraDiagonalDerecha.position.set(-13.881, -12.286, -97.75);
    barraDiagonalDerecha.rotation.set(THREE.MathUtils.degToRad(-34.283), 0, 0);
    group.add(barraDiagonalIzquierda, barraDiagonalDerecha);

    //barrandas
    const barandaGeo = new THREE.BoxGeometry(2, 11.358, 2);
    //barrandas izquierda
    const baranda1 = new THREE.Mesh(barandaGeo, maderaOscuraMat);
    baranda1.position.set(45.5, 5.179, -85.658);
    const baranda2 = new THREE.Mesh(barandaGeo, maderaOscuraMat);
    baranda2.position.set(30.655, 5.179, -85.658);
    const baranda3 = new THREE.Mesh(barandaGeo, maderaOscuraMat);
    baranda3.position.set(15.655, 5.179, -85.658);
    //barrandas derecha
    const baranda4 = new THREE.Mesh(barandaGeo, maderaOscuraMat);
    baranda4.position.set(-15.341, 5.179, -85.658);
    const baranda5 = new THREE.Mesh(barandaGeo, maderaOscuraMat);
    baranda5.position.set(-30.341, 5.179, -85.658);
    const baranda6 = new THREE.Mesh(barandaGeo, maderaOscuraMat);
    baranda6.position.set(-45.341, 5.179, -85.658);
    group.add(baranda1, baranda2, baranda3, baranda4, baranda5, baranda6);

    //cuadrados en la parte superior de las barandas
    const cuadradoGeo = new THREE.BoxGeometry(2.311, 0.704, 2.298);
    const cuadrado1 = new THREE.Mesh(cuadradoGeo, maderaOscuraMat);
    cuadrado1.position.set(45.5, 11.21, -85.658);
    const cuadrado2 = new THREE.Mesh(cuadradoGeo, maderaOscuraMat);
    cuadrado2.position.set(30.655, 11.21, -85.658);
    const cuadrado3 = new THREE.Mesh(cuadradoGeo, maderaOscuraMat);
    cuadrado3.position.set(15.655, 11.21, -85.658);
    const cuadrado4 = new THREE.Mesh(cuadradoGeo, maderaOscuraMat);
    cuadrado4.position.set(-15.341, 11.21, -85.658);
    const cuadrado5 = new THREE.Mesh(cuadradoGeo, maderaOscuraMat);
    cuadrado5.position.set(-30.341, 11.21, -85.658);
    const cuadrado6 = new THREE.Mesh(cuadradoGeo, maderaOscuraMat);
    cuadrado6.position.set(-45.341, 11.21, -85.658);
    group.add(cuadrado1, cuadrado2, cuadrado3, cuadrado4, cuadrado5, cuadrado6);
    // union de barandas
    //barra horizontal larga
    const barraHorizontalGeo = new THREE.BoxGeometry(1, 1, 22.084);
    const barraHorizontalIzqui = new THREE.Mesh(barraHorizontalGeo, maderaOscuraMat);
    barraHorizontalIzqui.position.set(45.495, 7.856, -73.617);
    const barraHorizontalDerecha = new THREE.Mesh(barraHorizontalGeo, maderaOscuraMat);
    barraHorizontalDerecha.position.set(-45.346, 7.856, -73.617);
    group.add(barraHorizontalIzqui, barraHorizontalDerecha);
    //barra hozizontal frontal
    const barraHorizontalFrontalGeo = new THREE.BoxGeometry(27.845, 1, 1);
    const barraHorizontalFrontalIzqui = new THREE.Mesh(barraHorizontalFrontalGeo, maderaOscuraMat);
    barraHorizontalFrontalIzqui.position.set(30.578, 7.902, -85.383);
    const barraHorizontalFrontalDerecha = new THREE.Mesh(barraHorizontalFrontalGeo, maderaOscuraMat);
    barraHorizontalFrontalDerecha.position.set(-30.264, 7.902, -85.383);
    group.add(barraHorizontalFrontalIzqui, barraHorizontalFrontalDerecha);
    // Sombras
    group.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return group;
}
