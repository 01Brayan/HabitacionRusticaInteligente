import * as THREE from 'three';

export function createCaja() {
    const cajaGroup = new THREE.Group();
    cajaGroup.name = "CajaMadera";

    const textureLoader = new THREE.TextureLoader();

    // Textura de madera compartida
    const maderaDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        roughnessMap: maderaRough,
        color: 0x3D2C1E,
        roughness: 0.68,
    });

    // --- CUERPO PRINCIPAL DE LA CAJA ---
    const cuerpoGeo = new THREE.BoxGeometry(6.125, 6.125, 6.125); // <- AJUSTAR tamaño
    const cuerpo = new THREE.Mesh(cuerpoGeo, maderaMat);
    cuerpo.position.set(-39.276, 2.764, -45.462); // <- AJUSTAR posición
    cajaGroup.add(cuerpo);

    //palos verticlaes en cada esquina
    const palosVertiGeo = new THREE.BoxGeometry(0.875, 4.851, 0.875); // <- AJUSTAR tamaño
    const palosVertiFrontalIzqui = new THREE.Mesh(palosVertiGeo, maderaMat);
    palosVertiFrontalIzqui.position.set(-36.214, 2.785, -42.399); 
    const palosVertiFrontalDer = new THREE.Mesh(palosVertiGeo, maderaMat);
    palosVertiFrontalDer.position.set(-36.214, 2.785, -48.496);
    cajaGroup.add(palosVertiFrontalIzqui, palosVertiFrontalDer);
    const palosVertiTraseroIzqui = new THREE.Mesh(palosVertiGeo, maderaMat);
    palosVertiTraseroIzqui.position.set(-42.339, 2.785, -42.399); 
    const palosVertiTraseroDer = new THREE.Mesh(palosVertiGeo, maderaMat);
    palosVertiTraseroDer.position.set(-42.339, 2.785, -48.496);
    cajaGroup.add(palosVertiTraseroIzqui, palosVertiTraseroDer);
    //palos superiores en cada esquina
    const palosHorzCortoGeo = new THREE.BoxGeometry(0.82, 0.875, 5.221); // <- AJUSTAR tamaño
    const palosHorzCortoFrontalSuperior = new THREE.Mesh(palosHorzCortoGeo, maderaMat);
    palosHorzCortoFrontalSuperior.position.set(-36.187, 5.625, -45.447); 
    const palosHorzCortoFrontalInferior = new THREE.Mesh(palosHorzCortoGeo, maderaMat);
    palosHorzCortoFrontalInferior.position.set(-36.214, -0.063, -45.447); 
    const palosHorzCortoTraseraSuperior = new THREE.Mesh(palosHorzCortoGeo, maderaMat);
    palosHorzCortoTraseraSuperior.position.set(-42.366, 5.625, -45.447); 
    const palosHorzCortoTraseraInferior = new THREE.Mesh(palosHorzCortoGeo, maderaMat);
    palosHorzCortoTraseraInferior.position.set(-42.366, -0.063, -45.447); 
    cajaGroup.add(palosHorzCortoFrontalSuperior, palosHorzCortoFrontalInferior,palosHorzCortoTraseraSuperior,palosHorzCortoTraseraInferior);

    const palosHorzLargoGeo = new THREE.BoxGeometry(7, 0.875, 0.875); // <- AJUSTAR tamaño
    const palosHorzLargoLateralSupIzq = new THREE.Mesh(palosHorzLargoGeo, maderaMat);
    palosHorzLargoLateralSupIzq.position.set(-39.276, 5.625, -42.399); 
    const palosHorzLargoLateralSupDer = new THREE.Mesh(palosHorzLargoGeo, maderaMat);
    palosHorzLargoLateralSupDer.position.set(-39.276, 5.625, -48.496); 
    const palosHorzLargoLateralInfIzq = new THREE.Mesh(palosHorzLargoGeo, maderaMat);
    palosHorzLargoLateralInfIzq.position.set(-39.276, -0.063, -42.399); 
    const palosHorzLargoLateralInfDer = new THREE.Mesh(palosHorzLargoGeo, maderaMat);
    palosHorzLargoLateralInfDer.position.set(-39.276, -0.063, -48.496); 
    cajaGroup.add(palosHorzLargoLateralSupIzq, palosHorzLargoLateralSupDer,palosHorzLargoLateralInfIzq,palosHorzLargoLateralInfDer);

    // LAS CRUCES EN LAS 4 CARAS 
    const cruzTablonGeo = new THREE.BoxGeometry(0.7, 7.685, 0.35); // <- AJUSTAR si es necesario

    // -------------------------------------------------------
    // 1. CARA FRONTAL
    // -------------------------------------------------------
    const cruzFrontal1 = new THREE.Mesh(cruzTablonGeo, maderaMat);
    cruzFrontal1.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(45));
    cruzFrontal1.position.set(-36.039, 2.884, -45.333); // <- AJUSTAR al centro de la cara frontal
    
    const cruzFrontal2 = new THREE.Mesh(cruzTablonGeo, maderaMat);
    cruzFrontal2.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(-45));
    cruzFrontal2.position.set(-36.039, 2.706, -45.407); 

    // -------------------------------------------------------
    // 2. CARA TRASERA
    // -------------------------------------------------------
    const cruzTrasera1 = new THREE.Mesh(cruzTablonGeo, maderaMat);
    cruzTrasera1.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(45));
    cruzTrasera1.position.set(-42.339, 2.706, -45.407); // <- AJUSTAR al centro de la cara trasera
    
    const cruzTrasera2 = new THREE.Mesh(cruzTablonGeo, maderaMat);
    cruzTrasera2.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-90), THREE.MathUtils.degToRad(-45));
    cruzTrasera2.position.set(-42.339, 2.884, -45.333); 

    // -------------------------------------------------------
    // 3. CARA LATERAL IZQUIERDA
    // -------------------------------------------------------
    const cruzIzq1 = new THREE.Mesh(cruzTablonGeo, maderaMat);
    cruzIzq1.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(45));
    cruzIzq1.position.set(-39.184, 2.866, -42.224); // <- AJUSTAR al centro del lateral izquierdo
    
    const cruzIzq2 = new THREE.Mesh(cruzTablonGeo, maderaMat);
    cruzIzq2.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-45));
    cruzIzq2.position.set(-39.365, 2.934, -42.224); 

    // -------------------------------------------------------
    // 4. CARA LATERAL DERECHA
    // -------------------------------------------------------
    const cruzDer1 = new THREE.Mesh(cruzTablonGeo, maderaMat);
    cruzDer1.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(45));
    cruzDer1.position.set(-39.184, 2.866, -48.61); // <- AJUSTAR al centro del lateral derecho
    
    const cruzDer2 = new THREE.Mesh(cruzTablonGeo, maderaMat);
    cruzDer2.rotation.set(THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(0), THREE.MathUtils.degToRad(-45));
    cruzDer2.position.set(-39.365, 2.934, -48.61); 

    // Añadimos todas las piezas de las cruces al grupo principal de la caja
    cajaGroup.add(
        cruzFrontal1, cruzFrontal2, 
        cruzTrasera1, cruzTrasera2, 
        cruzIzq1, cruzIzq2, 
        cruzDer1, cruzDer2
    );
    return cajaGroup;
}