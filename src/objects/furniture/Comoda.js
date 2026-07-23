import * as THREE from 'three';

export function createComoda() {
    const comodaGroup = new THREE.Group();
    // Le ponemos nombre por si luego quieres buscarla desde el index
    comodaGroup.name = "comodaPrincipal"; 

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. MATERIAL DE LA MADERA (Usamos tu misma lógica PBR del ropero)
    // ---------------------------------------------------------------
    const maderaDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 2); 
    });

    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        roughnessMap: maderaRough,
        color: 0x2E2418, 
        roughness: 0.6,
    });

    const manijaMat = new THREE.MeshStandardMaterial({
        color: 0x7A6248, // bronce, no blanco/gris
        metalness: 0.8,
        roughness: 0.35,
    });

    // ---------------------------------------------------------------
    // 2. ESTRUCTURA PRINCIPAL 
    // --------------------------------------------------------------
    //tapa superior
    const tapaSuperiorGeo = new THREE.BoxGeometry(6.58, 0.8, 20.5); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const tapaSuperior = new THREE.Mesh(tapaSuperiorGeo, maderaMat);
    tapaSuperior.position.set(-41.397, 14.164, 12.029); // <- AJUSTAR
    comodaGroup.add(tapaSuperior);
    //base inferiior
    const baseInferiorGeo = new THREE.BoxGeometry(6.5, 1, 20); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const baseInferior = new THREE.Mesh(baseInferiorGeo, maderaMat);
    baseInferior.position.set(-41.357, 1, 12.029); // <- AJUSTAR
    comodaGroup.add(baseInferior);
    //tabla lateral
    const tablaLateralGeo = new THREE.BoxGeometry(5.18, 12.264, 0.156)
    const tablaLateralIzqu = new THREE.Mesh(tablaLateralGeo, maderaMat);
    tablaLateralIzqu.position.set(-41.397, 7.632, 21.857);

    const tablaLateralDer = new THREE.Mesh(tablaLateralGeo, maderaMat);
    tablaLateralDer.position.set(-41.397, 7.632, 2.201);
    comodaGroup.add(tablaLateralIzqu,tablaLateralDer);

    //patas de la comoda
    //patas
    const patasGeo = new THREE.BoxGeometry(0.7, 14.264, 0.7);
    
    //patas traseras
    const pataTraseraIzq = new THREE.Mesh(patasGeo,maderaMat);
    pataTraseraIzq.position.set(-44.337, 6.632, 21.679); // <- AJUSTAR
    comodaGroup.add(pataTraseraIzq);

    const pataTraseraDer = new THREE.Mesh(patasGeo,maderaMat);
    pataTraseraDer.position.set(-44.337, 6.632, 2.379); // <- AJUSTAR
    comodaGroup.add(pataTraseraDer);
    //patas delanteras
    const pataDelanteraIzq = new THREE.Mesh(patasGeo,maderaMat);
    pataDelanteraIzq.position.set(-38.457, 6.632, 21.679); // <- AJUSTAR
    comodaGroup.add(pataDelanteraIzq);

    const pataDelanteraDer = new THREE.Mesh(patasGeo,maderaMat);
    pataDelanteraDer.position.set(-38.457, 6.632, 2.379); // <- AJUSTAR
    comodaGroup.add(pataDelanteraDer);

    //MARCO NIVEL 1
    //horizontal ancho
    const marcoHorizGeo = new THREE.BoxGeometry(6.2, 0.8, 19.5);
    const marcoHorizSuperior = new THREE.Mesh(marcoHorizGeo,maderaMat);
    marcoHorizSuperior.position.set(-41.397, 13.364, 12.029);

    const marcoHorizInfe = new THREE.Mesh(marcoHorizGeo,maderaMat);
    marcoHorizInfe.position.set(-41.397, 1.9, 12.029);
    comodaGroup.add(marcoHorizSuperior,marcoHorizInfe );

    //vertical ancho

    const marcoVetiGeo = new THREE.BoxGeometry(6.2, 10.664, 0.8);
    const marcoVetiIzq = new THREE.Mesh(marcoVetiGeo,maderaMat);
    marcoVetiIzq.position.set(-41.397, 7.632, 20.929);

    const marcoVetiDer = new THREE.Mesh(marcoVetiGeo,maderaMat);
    marcoVetiDer.position.set(-41.397, 7.632, 3.129);
    comodaGroup.add(marcoVetiIzq,marcoVetiDer );

    //INTERIOR DE EL MARCO NIVEL 1
    //caja 
    const cajaGeo = new THREE.BoxGeometry(6.014, 10.664, 17);
    const caja = new THREE.Mesh(cajaGeo,maderaMat);
    caja.position.set(-41.49, 7.632, 12.029);
    comodaGroup.add(caja);
    // palos extremos horizontales
    const paloGeo = new THREE.BoxGeometry(0.296, 0.2, 17);
    const paloSuperior = new THREE.Mesh(paloGeo,maderaMat);
    paloSuperior.position.set(-38.335, 12.964, 12.029);

    const paloInferior = new THREE.Mesh(paloGeo,maderaMat);
    paloInferior.position.set(-38.335, 2.3, 12.029);
    comodaGroup.add(paloSuperior,paloInferior );

    //CAJONES (6) enumerados del 1 al 6 de izquierda superior hasta la derecha inferior
    const cajonesGeo = new THREE.BoxGeometry(0.296, 2.8, 7.65);
    const cajon1 = new THREE.Mesh(cajonesGeo,maderaMat);
    cajon1.position.set(-38.307, 11, 16.254);
    const cajon2 = new THREE.Mesh(cajonesGeo,maderaMat);
    cajon2.position.set(-38.307, 7.6, 16.254);
    const cajon3 = new THREE.Mesh(cajonesGeo,maderaMat);
    cajon3.position.set(-38.307, 4.2, 16.254);
    const cajon4 = new THREE.Mesh(cajonesGeo,maderaMat);
    cajon4.position.set(-38.307, 11, 7.804);
    const cajon5 = new THREE.Mesh(cajonesGeo,maderaMat);
    cajon5.position.set(-38.307, 7.6, 7.804);
    const cajon6 = new THREE.Mesh(cajonesGeo,maderaMat);
    cajon6.position.set(-38.307, 4.2, 7.804);
    comodaGroup.add(cajon1,cajon2,cajon3,cajon4,cajon5,cajon6 );
    //marco de cajones
    //marco horizontal
    const marcoHorizCajonGeo = new THREE.BoxGeometry(0.3, 0.2, 8.25);
    //marco enumerados de izquierda susperior hasta la derecha inferior
    const marcoHorizCajon1 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon1.position.set(-38.309, 12.5, 16.254);
    const marcoHorizCajon2 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon2.position.set(-38.309, 9.5, 16.254);
    const marcoHorizCajon3 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon3.position.set(-38.309, 9.1, 16.254);
    const marcoHorizCajon4 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon4.position.set(-38.309, 6.1, 16.254);
    const marcoHorizCajon5 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon5.position.set(-38.309, 5.7, 16.254);
    const marcoHorizCajon6 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon6.position.set(-38.309, 2.7, 16.254);
    const marcoHorizCajon7 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon7.position.set(-38.309, 12.5, 7.804);
    const marcoHorizCajon8 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon8.position.set(-38.309, 9.5, 7.804);
    const marcoHorizCajon9 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon9.position.set(-38.309, 9.1, 7.804);
    const marcoHorizCajon10 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon10.position.set(-38.309, 6.1, 7.804);
    const marcoHorizCajon11 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon11.position.set(-38.309, 5.7, 7.804);
    const marcoHorizCajon12 = new THREE.Mesh(marcoHorizCajonGeo,maderaMat);
    marcoHorizCajon12.position.set(-38.309, 2.7, 7.804);
    comodaGroup.add(marcoHorizCajon1,marcoHorizCajon2,marcoHorizCajon3,marcoHorizCajon4,marcoHorizCajon5,
        marcoHorizCajon6,marcoHorizCajon7,marcoHorizCajon8,marcoHorizCajon9,marcoHorizCajon10,marcoHorizCajon11,marcoHorizCajon12 );

    //marco vertical
    const marcoVertiCajonGeo = new THREE.BoxGeometry(0.3, 2.8, 0.3);
    //marco enumerados de izquierda susperior hasta la derecha inferior (por cajones)
    const marcovertiCajon1 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon1.position.set(-38.309, 11, 20.229);
    const marcovertiCajon2 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon2.position.set(-38.309, 11, 12.279);
    const marcovertiCajon3 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon3.position.set(-38.309, 7.6, 20.229);
    const marcovertiCajon4 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon4.position.set(-38.309, 7.6, 12.279);
    const marcovertiCajon5 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon5.position.set(-38.309, 4.2, 20.229);
    const marcovertiCajon6 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon6.position.set(-38.309, 4.2, 12.279);
    const marcovertiCajon7 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon7.position.set(-38.309, 11, 11.779);
    const marcovertiCajon8 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon8.position.set(-38.309, 11, 3.829);
    const marcovertiCajon9 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon9.position.set(-38.309, 7.6, 11.779);
    const marcovertiCajon10 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon10.position.set(-38.309, 7.6, 3.829);
    const marcovertiCajon11 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon11.position.set(-38.309, 4.2, 11.779);
    const marcovertiCajon12 = new THREE.Mesh(marcoVertiCajonGeo,maderaMat);
    marcovertiCajon12.position.set(-38.309, 4.2, 3.829);
    comodaGroup.add(marcovertiCajon1,marcovertiCajon2,marcovertiCajon3,marcovertiCajon4,marcovertiCajon5,
        marcovertiCajon6,marcovertiCajon7,marcovertiCajon8,marcovertiCajon9,marcovertiCajon10,marcovertiCajon11,marcovertiCajon12 );

        //manijas
    // --- MANIJA INFERIOR (cilindro rotado) ---
    const manijaGeo = new THREE.CylinderGeometry(0.1405, 0.1405, 1.871, 16); // <- AJUSTAR
    const manija1 = new THREE.Mesh(manijaGeo, manijaMat);
    manija1.rotation.x = Math.PI / 2;
    manija1.position.set(-38.159, 11, 16.254); // <- AJUSTAR
    const manija2 = new THREE.Mesh(manijaGeo, manijaMat);
    manija2.rotation.x = Math.PI / 2;
    manija2.position.set(-38.159, 7.563, 16.254); // <- AJUSTAR
    const manija3 = new THREE.Mesh(manijaGeo, manijaMat);
    manija3.rotation.x = Math.PI / 2;
    manija3.position.set(-38.159, 4.131, 16.254); // <- AJUSTAR
    const manija4 = new THREE.Mesh(manijaGeo, manijaMat);
    manija4.rotation.x = Math.PI / 2;
    manija4.position.set(-38.159, 11, 7.561); // <- AJUSTAR
    const manija5 = new THREE.Mesh(manijaGeo, manijaMat);
    manija5.rotation.x = Math.PI / 2;
    manija5.position.set(-38.159, 7.563, 7.561); // <- AJUSTAR
    const manija6 = new THREE.Mesh(manijaGeo, manijaMat);
    manija6.rotation.x = Math.PI / 2;
    manija6.position.set(-38.159, 4.131, 7.561); // <- AJUSTAR
    comodaGroup.add(manija1,manija2,manija3,manija4,manija5,manija6);


    return comodaGroup;
}