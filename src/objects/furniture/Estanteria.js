import * as THREE from 'three';

export function createEstanteria() {
    const estanteriaGroup = new THREE.Group();
    // Le ponemos nombre por si luego quieres buscarla desde el index
    estanteriaGroup.name = "EstanteriaPrincipal"; 

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
    // 2. ESTRUCTURA PRINCIPAL DEL MUEBLE (El armazón)
    // ---------------------------------------------------------------

    // --- LATERAL IZQUIERDO ---
    const lateralGeo = new THREE.BoxGeometry(4, 28.5, 0.5); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const lateralIzq = new THREE.Mesh(lateralGeo, maderaMat);
    lateralIzq.position.set(40.988, 14.227, 29.642); // <- AJUSTAR
    estanteriaGroup.add(lateralIzq);

    // --- LATERAL DERECHO ---
    const lateralDer = new THREE.Mesh(lateralGeo, maderaMat);
    lateralDer.position.set(40.988, 14.227, 47.504); // <- AJUSTAR
    estanteriaGroup.add(lateralDer);

    // --- TAPA SUPERIOR ---
    const horizontalGeo = new THREE.BoxGeometry(6, 1, 18.562); // <- AJUSTAR
    const tapaSup = new THREE.Mesh(horizontalGeo, maderaMat);
    tapaSup.position.set(40.988, 28.151, 38.573); // <- AJUSTAR
    estanteriaGroup.add(tapaSup);

    // --- BASE (Tapa inferior) ---
    const base = new THREE.Mesh(horizontalGeo, maderaMat);
    base.position.set(40.988, 4.977, 38.573); // <- AJUSTAR
    estanteriaGroup.add(base);

    // --- FONDO (La madera delgada que va pegada al suelo) ---
    const fondoGeo = new THREE.BoxGeometry(6, 1, 18.562); // <- AJUSTAR

    const fondo1 = new THREE.Mesh(fondoGeo, maderaMat);
    fondo1.position.set(40.938, 0.377, 38.573); // <- AJUSTAR (tirado hacia atrás en Z)
    estanteriaGroup.add(fondo1);

    // RESPALDO TRASERO
    const respaldoGeo = new THREE.BoxGeometry(0.145, 22.374, 16.562); // delgado en X (profundidad), alto en Y, ancho en Z
    const respaldo = new THREE.Mesh(respaldoGeo, maderaMat);
    respaldo.position.set(43.916, 16.464, 38.573); // pegado a la parte trasera (X más alto = más al fondo, según tu convención X=profundidad)
    estanteriaGroup.add(respaldo);

    // PARTE BAJAS DE CAJONES
    //fija izquierda
    const paloFijoGeo = new THREE.BoxGeometry(6, 3.7, 0.8);
    const PaloFijoIzquierdo = new THREE.Mesh(paloFijoGeo, maderaMat);
    PaloFijoIzquierdo.position.set(40.988, 2.627, 30.692);
    estanteriaGroup.add(PaloFijoIzquierdo);

    const PaloFijoDerecho = new THREE.Mesh(paloFijoGeo, maderaMat);
    PaloFijoDerecho.position.set(40.968, 2.627, 46.454);
    estanteriaGroup.add(PaloFijoDerecho);
    //Cajones
    //palos verticales de izquierda a derecha 
    const paloVerticalGeo = new THREE.BoxGeometry(6, 2.7, 0.5);
    const paloVertical1 = new THREE.Mesh(paloVerticalGeo, maderaMat);
    paloVertical1.position.set(40.968, 2.627, 31.342);
    estanteriaGroup.add(paloVertical1);

    const paloVertical2 = new THREE.Mesh(paloVerticalGeo, maderaMat);
    paloVertical2.position.set(40.968, 2.627, 38.342);
    estanteriaGroup.add(paloVertical2);

    const paloVertical3 = new THREE.Mesh(paloVerticalGeo, maderaMat);
    paloVertical3.position.set(40.968, 2.627, 38.842);
    estanteriaGroup.add(paloVertical3);

    const paloVertical4 = new THREE.Mesh(paloVerticalGeo, maderaMat);
    paloVertical4.position.set(40.988, 2.568, 45.804);
    estanteriaGroup.add(paloVertical4);

    // palos horizontales 
    const paloHorizontalGeo = new THREE.BoxGeometry(6, 0.5, 7.75);

    const paloHorizSupeIzqui = new THREE.Mesh(paloHorizontalGeo, maderaMat);
    paloHorizSupeIzqui.position.set(40.968, 4.227, 34.967);
    estanteriaGroup.add(paloHorizSupeIzqui);

    const paloHorizInfIzqui = new THREE.Mesh(paloHorizontalGeo, maderaMat);
    paloHorizInfIzqui.position.set(40.968, 1.027, 34.842);
    estanteriaGroup.add(paloHorizInfIzqui);

    const paloHorizSupeDer = new THREE.Mesh(paloHorizontalGeo, maderaMat);
    paloHorizSupeDer.position.set(40.968, 4.227, 42.448);
    estanteriaGroup.add(paloHorizSupeDer);

    const paloHorizInfDer = new THREE.Mesh(paloHorizontalGeo, maderaMat);
    paloHorizInfDer.position.set(40.968, 1.027, 42.342);
    estanteriaGroup.add(paloHorizInfDer);

    //cajones 
    const cajonGeo = new THREE.BoxGeometry(5.902, 2.818, 6.5);

    const cajonIzquierdo = new THREE.Mesh(cajonGeo, maderaMat);
    cajonIzquierdo.position.set(41.037, 2.568, 34.842);
    estanteriaGroup.add(cajonIzquierdo);

    const cajonDerecho = new THREE.Mesh(cajonGeo, maderaMat);
    cajonDerecho.position.set(41.037, 2.568, 42.342);
    estanteriaGroup.add(cajonDerecho);

    // ---------------------------------------------------------------
    // 3. LAS REPISAS INTERNAS
    // ---------------------------------------------------------------
    const repisaGeo = new THREE.BoxGeometry(5.855, 0.8, 16.562); // Más delgadas y cortas que la tapa <- AJUSTAR

    const repisa1 = new THREE.Mesh(repisaGeo, maderaMat);
    repisa1.position.set(40.916, 22.425, 38.573); // <- AJUSTAR Altura (Y)
    estanteriaGroup.add(repisa1);

    const repisa2 = new THREE.Mesh(repisaGeo, maderaMat);
    repisa2.position.set(40.916, 16.477, 38.573); // <- AJUSTAR Altura (Y)
    estanteriaGroup.add(repisa2);

    const repisa3 = new THREE.Mesh(repisaGeo, maderaMat);
    repisa3.position.set(40.916, 10.677, 38.573); // <- AJUSTAR Altura (Y)
    estanteriaGroup.add(repisa3);

    //patas 
    const pataGeo = new THREE.BoxGeometry(1, 28.977, 1); // <- AJUSTAR

    const pataFrontalIzq = new THREE.Mesh(pataGeo, maderaMat);
    pataFrontalIzq.position.set(38.438, 13.989, 29.792); // <- AJUSTAR
    estanteriaGroup.add(pataFrontalIzq);

    const pataFrontalDer = new THREE.Mesh(pataGeo, maderaMat);
    pataFrontalDer.position.set(38.438, 13.989, 47.354); // <- AJUSTAR
    estanteriaGroup.add(pataFrontalDer);

    const pataTraseraIzq = new THREE.Mesh(pataGeo, maderaMat);
    pataTraseraIzq.position.set(43.488, 13.989, 29.792); // <- AJUSTAR
    estanteriaGroup.add(pataTraseraIzq);

    const pataTraseraDer = new THREE.Mesh(pataGeo, maderaMat);
    pataTraseraDer.position.set(43.488, 13.989, 47.354); // <- AJUSTAR
    estanteriaGroup.add(pataTraseraDer);

    //manijas
    const manijaGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.638, 12);
    const manijaIzquierda = new THREE.Mesh(manijaGeo, manijaMat);
    manijaIzquierda.rotation.x = Math.PI / 2;
    manijaIzquierda.position.set(38.086, 2.678, 34.832);
    estanteriaGroup.add(manijaIzquierda);


    const manijaDerecha = new THREE.Mesh(manijaGeo, manijaMat);
    manijaDerecha.rotation.x = Math.PI / 2;
    manijaDerecha.position.set(38.086, 2.678, 42.578);
    estanteriaGroup.add(manijaDerecha);

    return estanteriaGroup; // ¡MUY IMPORTANTE RETORNARLO!
}