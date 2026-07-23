import * as THREE from 'three';

export function createChimenea() {
    const chimeneaGroup = new THREE.Group();
    chimeneaGroup.name = "chimeneaPrincipal";

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. MATERIAL DE PIEDRA (mismo patrón PBR que usas en la cómoda)
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
    
        const piedraDiffuse = textureLoader.load('src/assets/textures/stone/stone_diff_2k.jpg');
    const piedraNormal  = textureLoader.load('src/assets/textures/stone/stone_nor_gl_2k.jpg');
    const piedraRough   = textureLoader.load('src/assets/textures/stone/stone_rough_2k.jpg');
    const piedraAO      = textureLoader.load('src/assets/textures/stone/stone_ao_2k.jpg');

    piedraDiffuse.colorSpace = THREE.SRGBColorSpace;
    [piedraDiffuse, piedraNormal, piedraRough, piedraAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 2); // <- AJUSTAR según tamaño de cada bloque
    });

    const piedraMat = new THREE.MeshStandardMaterial({
        map: piedraDiffuse,
        normalMap: piedraNormal,
        normalScale: new THREE.Vector2(1.5, 1.5),
        roughnessMap: piedraRough,
        aoMap: piedraAO,
        roughness: 1,
        aoMapIntensity: 1.8,
        color:  0x453f37, //#111111 //0x635F62
    });

        const piedraOscuroMat = new THREE.MeshStandardMaterial({
        map: piedraDiffuse,
        normalMap: piedraNormal,
        normalScale: new THREE.Vector2(1,1),
        roughnessMap: piedraRough,
        aoMap: piedraAO,
        roughness: 1,
        aoMapIntensity: 1.8,
        color:  0x2f2b26, //#111111 //0x635F62
    });
    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        roughnessMap: maderaRough,
        color: 0x1a0f08, //0x1a0f08 //0x2E2418
        roughness: 0.45,
    });

    const hogarInteriorMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 1,
    });
//NIVEL INFERIOR 
    // ---------------------------------------------------------------
    // 2. BASE DE 3 NIVELES
    // ---------------------------------------------------------------
    const primeraBaseGeo = new THREE.BoxGeometry(13.6, 0.6, 23.8); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const primeraBase = new THREE.Mesh(primeraBaseGeo, piedraMat);
    primeraBase.position.set(-38.7, -0.2, -14.991); // <- AJUSTAR
    chimeneaGroup.add(primeraBase);

    const segundaBaseGeo = new THREE.BoxGeometry(13, 0.45, 23); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const segundaBase = new THREE.Mesh(segundaBaseGeo, piedraMat);
    segundaBase.position.set(-39, 0.425, -14.991); // <- AJUSTAR
    chimeneaGroup.add(segundaBase);

    const terceraBaseGeo = new THREE.BoxGeometry(12.4, 0.583, 22.2); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const terceraBase = new THREE.Mesh(terceraBaseGeo, piedraMat);
    terceraBase.position.set(-39.3, 0.942, -14.991); // <- AJUSTAR
    chimeneaGroup.add(terceraBase);

    //columna inferior
    //cuadrado para ambos lados
    const baseColumnaGeo = new THREE.BoxGeometry(6.728, 3.249, 4.199); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const baseColumnaIzqui = new THREE.Mesh(baseColumnaGeo, piedraMat);
    baseColumnaIzqui.position.set(-37.607, 3.796, -6.431); // <- AJUSTAR
    chimeneaGroup.add(baseColumnaIzqui);

    const baseColumnaDerech = new THREE.Mesh(baseColumnaGeo, piedraMat);
    baseColumnaDerech.position.set(-37.607, 3.796, -23.612); // <- AJUSTAR
    chimeneaGroup.add(baseColumnaDerech);

    //rectangulo abajo del cuadrado //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const SoportBaseInferGeo = new THREE.BoxGeometry(6.948, 0.94, 4.769); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const soportbaseizqui = new THREE.Mesh(SoportBaseInferGeo, piedraOscuroMat);
    soportbaseizqui.position.set(-37.498, 1.702, -6.505); // <- AJUSTAR
    chimeneaGroup.add(soportbaseizqui);
    const soportbasederch = new THREE.Mesh(SoportBaseInferGeo, piedraOscuroMat);
    soportbasederch.position.set(-37.498, 1.702, -23.687); // <- AJUSTAR
    chimeneaGroup.add(soportbasederch);
//===============================
    //soporte encima del cuadrado
    //columna
    const columnaInferiorGeo = new THREE.BoxGeometry(6.256, 6.495, 3.255); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const columnaInferIzqui = new THREE.Mesh(columnaInferiorGeo, piedraMat);
    columnaInferIzqui.position.set(-37.844, 10.043, -6.436); // <- AJUSTAR
    chimeneaGroup.add(columnaInferIzqui);

    const columnaInferDerec = new THREE.Mesh(columnaInferiorGeo, piedraMat);
    columnaInferDerec.position.set(-37.844, 10.043, -23.617); // <- AJUSTAR
    chimeneaGroup.add(columnaInferDerec);
    // cuadrado delante de la columna para decoracion //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const cuadradoPosteriorGeo = new THREE.BoxGeometry(0.169, 5.625, 2.578); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const cuadradoPosteriorIzqu = new THREE.Mesh(cuadradoPosteriorGeo, piedraOscuroMat);
    cuadradoPosteriorIzqu.position.set(-34.631, 10.03, -6.428); // <- AJUSTAR
    chimeneaGroup.add(cuadradoPosteriorIzqu);

    const cuadradoPosteriorDer = new THREE.Mesh(cuadradoPosteriorGeo, piedraOscuroMat);
    cuadradoPosteriorDer.position.set(-34.631, 10.03, -23.609); // <- AJUSTAR
    chimeneaGroup.add(cuadradoPosteriorDer);
    //soportes inferiores de las columnas inferiores  //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const primerNivelGeo = new THREE.BoxGeometry(6.948, 0.458, 4.632); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const primerNivelsoporteIzqui = new THREE.Mesh(primerNivelGeo, piedraOscuroMat);
    primerNivelsoporteIzqui.position.set(-37.498, 5.65, -6.437); // <- AJUSTAR
    chimeneaGroup.add(primerNivelsoporteIzqui);
//PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const primerNivelsoporteDer = new THREE.Mesh(primerNivelGeo, piedraOscuroMat);
    primerNivelsoporteDer.position.set(-37.498, 5.65, -23.618); // <- AJUSTAR
    chimeneaGroup.add(primerNivelsoporteDer);
 // segundo nivel //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const segundoNivelGeo = new THREE.BoxGeometry(6.506, 0.458, 3.717); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const segundoNivelsoporteIzqui = new THREE.Mesh(segundoNivelGeo, piedraOscuroMat);
    segundoNivelsoporteIzqui.position.set(-37.718, 6.108, -6.442); // <- AJUSTAR
    chimeneaGroup.add(segundoNivelsoporteIzqui);

    const segundoNivelsoporteDer = new THREE.Mesh(segundoNivelGeo, piedraOscuroMat);
    segundoNivelsoporteDer.position.set(-37.718, 6.108, -23.623); // <- AJUSTAR
    chimeneaGroup.add(segundoNivelsoporteDer);
    //tercer nivel//PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const tercerNivelGeo = new THREE.BoxGeometry(6.374, 0.458, 3.464); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const tercerNivelsoporteIzqui = new THREE.Mesh(tercerNivelGeo, piedraOscuroMat);
    tercerNivelsoporteIzqui.position.set(-37.785, 6.566, -6.445); // <- AJUSTAR
    chimeneaGroup.add(tercerNivelsoporteIzqui);

    const tercerNivelsoporteDer = new THREE.Mesh(tercerNivelGeo, piedraOscuroMat);
    tercerNivelsoporteDer.position.set(-37.785, 6.566, -23.626); // <- AJUSTAR
    chimeneaGroup.add(tercerNivelsoporteDer);
    //soportes superiores a la columnas inferiores
    //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const PrimerSoporteSubGeo = new THREE.BoxGeometry(6.374, 0.458, 3.464); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const PrimerSoporteSubIzquierdo = new THREE.Mesh(PrimerSoporteSubGeo, piedraOscuroMat);
    PrimerSoporteSubIzquierdo.position.set(-37.785, 13.507, -6.445); // <- AJUSTAR
    chimeneaGroup.add(PrimerSoporteSubIzquierdo);
//PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const PrimerSoporteSubDerecho = new THREE.Mesh(PrimerSoporteSubGeo, piedraOscuroMat);
    PrimerSoporteSubDerecho.position.set(-37.785, 13.507, -23.626); // <- AJUSTAR
    chimeneaGroup.add(PrimerSoporteSubDerecho);

    //soporte largo delgado superior//PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const SoporteAlargoDelgSupGeo = new THREE.BoxGeometry(6.482, 0.472, 20.899); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const SoporteAlargoDelgSup = new THREE.Mesh(SoporteAlargoDelgSupGeo, piedraOscuroMat);
    SoporteAlargoDelgSup.position.set(-37.73, 13.972, -15.034); // <- AJUSTAR
    chimeneaGroup.add(SoporteAlargoDelgSup);
    //soporte largo grueso superior//PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const soporteLargoAnchoSupGeo = new THREE.BoxGeometry(6.062, 3.047, 20.001); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const soporteLargoAnchoSup = new THREE.Mesh(soporteLargoAnchoSupGeo, piedraOscuroMat);
    soporteLargoAnchoSup.position.set(-37.941, 15.009, -15.036); // <- AJUSTAR
    chimeneaGroup.add(soporteLargoAnchoSup);
//========================================================
//PARTE roca CHIMENEA, MARCO, PISO, PARED, TECHO CHIMENEA
    const marcoExteriVertiGeo = new THREE.BoxGeometry(0.924, 11.139, 1.899); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const marcoExteriVertiIzq = new THREE.Mesh(marcoExteriVertiGeo, piedraMat);
    marcoExteriVertiIzq.position.set(-35.714, 6.801, -8.776); // <- AJUSTAR
    chimeneaGroup.add(marcoExteriVertiIzq);
    const marcoExteriVertiDer = new THREE.Mesh(marcoExteriVertiGeo, piedraMat);
    marcoExteriVertiDer.position.set(-35.714, 6.801, -21.233); // <- AJUSTAR
    chimeneaGroup.add(marcoExteriVertiDer);

    const marcoExteriHorizonGeo = new THREE.BoxGeometry(0.924, 1.367, 14.356); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const marcoExteriHoriz = new THREE.Mesh(marcoExteriHorizonGeo, piedraMat);
    marcoExteriHoriz.position.set(-35.714, 13.054, -15.004); // <- AJUSTAR
    chimeneaGroup.add(marcoExteriHoriz);

    // marco interior de la chimenea //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const marcoInteriorVertiGeo = new THREE.BoxGeometry(0.172, 8.126, 1.52); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const marcoInteriorVertiIzq = new THREE.Mesh(marcoInteriorVertiGeo, piedraOscuroMat);
    marcoInteriorVertiIzq.position.set(-35.839, 6.874, -9.946); // <- AJUSTAR
    chimeneaGroup.add(marcoInteriorVertiIzq);
//PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const marcoInteriorVertiDer = new THREE.Mesh(marcoInteriorVertiGeo, piedraOscuroMat);
    marcoInteriorVertiDer.position.set(-35.839, 6.874, -20.073); // <- AJUSTAR
    chimeneaGroup.add(marcoInteriorVertiDer);

    //marco horizontal inferior //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const marcoInteriorHorizAnchoGeo = new THREE.BoxGeometry(0.622, 1.807, 10.568); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const marcoInteriorHorizAncho = new THREE.Mesh(marcoInteriorHorizAnchoGeo, piedraOscuroMat);
    marcoInteriorHorizAncho.position.set(-35.865, 2.137, -15.01); // <- AJUSTAR
    chimeneaGroup.add(marcoInteriorHorizAncho);
//PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const marcoInteriorHorizDelgadoGeo = new THREE.BoxGeometry(0.622, 1.42, 11.019); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const marcoInteriorHorizDelgado = new THREE.Mesh(marcoInteriorHorizDelgadoGeo, piedraOscuroMat);
    marcoInteriorHorizDelgado.position.set(-35.865, 3.152, -15.235); // <- AJUSTAR
    chimeneaGroup.add(marcoInteriorHorizDelgado);
    //piso de la chimenea //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const pisoChimeneaGeo = new THREE.BoxGeometry(5.048, 0.622, 13.269); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const pisoChimenea = new THREE.Mesh(pisoChimeneaGeo, piedraOscuroMat);
    pisoChimenea.position.set(-38.445, 1.4, -14.856); // <- AJUSTAR
    chimeneaGroup.add(pisoChimenea);
    //piso de la techo //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const techoChimeneaGeo = new THREE.BoxGeometry(4.28, 0.622, 13.418); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const techoChimenea = new THREE.Mesh(techoChimeneaGeo, hogarInteriorMat); //tiene que ser negro el techo cambiar
    techoChimenea.position.set(-38.6, 13.796, -15.227); // <- AJUSTAR
    chimeneaGroup.add(techoChimenea);

    //pared de la techo (PONERLE TEXTURA OSEA JUNTO CON //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR))
    const paredChimeneaGeo = new THREE.BoxGeometry(0.603, 12.503, 14.356); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const paredChimenea = new THREE.Mesh(paredChimeneaGeo, hogarInteriorMat); //tiene que ser negro el techo cambiar
    paredChimenea.position.set(-40.901, 7.484, -15.003); // <- AJUSTAR
    chimeneaGroup.add(paredChimenea);
//PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    //marco superior de la chimenea (integrado por 4 cuadrados para darle forma de curva)
    //cuadrados del 1 al 4 de izquierda a derecha para el marco superior curveado
    const primermarcoSupGeo = new THREE.BoxGeometry(0.622, 2.047, 2.609); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const primermarcoSup = new THREE.Mesh(primermarcoSupGeo, piedraOscuroMat); //tiene que ser negro el techo cambiar
    primermarcoSup.position.set(-35.865, 11.631, -10.472); // <- AJUSTAR
    primermarcoSup.rotation.x = THREE.MathUtils.degToRad(25.3);
    chimeneaGroup.add(primermarcoSup);
    
    const segundomarcoSupGeo = new THREE.BoxGeometry(0.622, 1.239, 2.981); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const segundomarcoSup = new THREE.Mesh(segundomarcoSupGeo, piedraOscuroMat); //tiene que ser negro el techo cambiar
    segundomarcoSup.position.set(-35.865, 12.06, -13.063); // <- AJUSTAR
    segundomarcoSup.rotation.x = THREE.MathUtils.degToRad(9.421);
    chimeneaGroup.add(segundomarcoSup);

    const tercermarcoSupGeo = new THREE.BoxGeometry(0.622, 1.122, 3.387); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const tercermarcoSup = new THREE.Mesh(tercermarcoSupGeo, piedraOscuroMat); //tiene que ser negro el techo cambiar
    tercermarcoSup.position.set(-35.865, 12.074, -15.99); // <- AJUSTAR
    tercermarcoSup.rotation.x = THREE.MathUtils.degToRad(-7.678);
    chimeneaGroup.add(tercermarcoSup);

    const cuartomarcoSupGeo = new THREE.BoxGeometry(0.622, 2.256, 3.777); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const cuartomarcoSup = new THREE.Mesh(cuartomarcoSupGeo, piedraOscuroMat); //tiene que ser negro el techo cambiar
    cuartomarcoSup.position.set(-35.865, 11.65, -19.324); // <- AJUSTAR
    cuartomarcoSup.rotation.x = THREE.MathUtils.degToRad(-25.919);
    chimeneaGroup.add(cuartomarcoSup);
    // ---------------------------------------------------------------
    // NIVEL INTERMEDIO DE MADERA PARA SEPARACION ENTRE INFERIOR Y SUPERIOR (repisa)
    // ---------------------------------------------------------------
    //4 niveles de madera.. 
    const repisaNivel1Geo = new THREE.BoxGeometry(7.671, 0.561, 20.85); // <- AJUSTAR
    const repisaNivel1 = new THREE.Mesh(repisaNivel1Geo, maderaMat);
    repisaNivel1.position.set(-37.136, 16.746, -15.003); // <- AJUSTAR
    chimeneaGroup.add(repisaNivel1);

    const repisaNivel2Geo = new THREE.BoxGeometry(8.16, 0.561, 21.808); // <- AJUSTAR
    const repisaNivel2 = new THREE.Mesh(repisaNivel2Geo, maderaMat);
    repisaNivel2.position.set(-36.891, 17.246, -14.991); // <- AJUSTAR
    chimeneaGroup.add(repisaNivel2);

    const repisaNivel3Geo = new THREE.BoxGeometry(8.604, 0.462, 22.859); // <- AJUSTAR
    const repisaNivel3 = new THREE.Mesh(repisaNivel3Geo, maderaMat);
    repisaNivel3.position.set(-36.67, 17.644, -15.061); // <- AJUSTAR
    chimeneaGroup.add(repisaNivel3);

    const repisaNivel4Geo = new THREE.BoxGeometry(8.906, 0.57, 23.619); // <- AJUSTAR
    const repisaNivel4 = new THREE.Mesh(repisaNivel4Geo, maderaMat);
    repisaNivel4.position.set(-36.518, 18.16, -15.005); // <- AJUSTAR
    chimeneaGroup.add(repisaNivel4);
    // ---------------------------------------------------------------
    // NIVEL SUPERIOR DE LAS REPISAS 
    // ---------------------------------------------------------------
    const paredCentralSuperiorGeo = new THREE.BoxGeometry(6.311, 19.578, 7.776); // <- AJUSTAR
    const paredCentralSuperior = new THREE.Mesh(paredCentralSuperiorGeo, piedraMat);
    paredCentralSuperior.position.set(-38.732, 28.234, -15.1); // <- AJUSTAR
    chimeneaGroup.add(paredCentralSuperior);

    //COLUMNAS LATERALES 
    const columnaSuperiorGeo = new THREE.BoxGeometry(7.172, 17.263, 5.361); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const columnaSuperiorIzqui = new THREE.Mesh(columnaSuperiorGeo, piedraMat);
    columnaSuperiorIzqui.position.set(-38.302, 29.391, -8.531); // <- AJUSTAR
    chimeneaGroup.add(columnaSuperiorIzqui);

    const columnaSuperiorDerec = new THREE.Mesh(columnaSuperiorGeo, piedraMat);
    columnaSuperiorDerec.position.set(-38.302, 29.42, -21.668); // <- AJUSTAR
    chimeneaGroup.add(columnaSuperiorDerec);

    // escalon para columnas superiores laterales (4niveles) //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const primerEscalonGeo = new THREE.BoxGeometry(7.864, 0.94, 6.048); // <- AJUSTAR
    
    const primerEscalonIzqui = new THREE.Mesh(primerEscalonGeo, piedraOscuroMat);
    primerEscalonIzqui.position.set(-37.956, 18.915, -8.187); // <- AJUSTAR
    chimeneaGroup.add(primerEscalonIzqui);

    const primerEscalonDer = new THREE.Mesh(primerEscalonGeo, piedraOscuroMat);
    primerEscalonDer.position.set(-37.956, 18.915, -22.012); // <- AJUSTAR
    chimeneaGroup.add(primerEscalonDer);

    const segundoEscalonGeo = new THREE.BoxGeometry(7.671, 0.458, 5.865); // <- AJUSTAR

    const segundoEscalonIzqui = new THREE.Mesh(segundoEscalonGeo, piedraOscuroMat);
    segundoEscalonIzqui.position.set(-38.052, 19.614, -8.279); // <- AJUSTAR
    chimeneaGroup.add(segundoEscalonIzqui);

    const segundoEscalonDer = new THREE.Mesh(segundoEscalonGeo, piedraOscuroMat);
    segundoEscalonDer.position.set(-38.052, 19.614, -21.92); // <- AJUSTAR
    chimeneaGroup.add(segundoEscalonDer);

    const tercerEscalonGeo = new THREE.BoxGeometry(7.422, 0.458, 5.586); // <- AJUSTAR

    const tercerEscalonIzqui = new THREE.Mesh(tercerEscalonGeo, piedraOscuroMat);
    tercerEscalonIzqui.position.set(-38.176, 20.072, -8.419); // <- AJUSTAR
    chimeneaGroup.add(tercerEscalonIzqui);

    const tercerEscalonDer = new THREE.Mesh(tercerEscalonGeo, piedraOscuroMat);
    tercerEscalonDer.position.set(-38.176, 20.072, -21.781); // <- AJUSTAR
    chimeneaGroup.add(tercerEscalonDer);
    

    const cuartoEscalonGeo = new THREE.BoxGeometry(7.29, 0.458, 5.457); // <- AJUSTAR

    const cuartoEscalonIzqui = new THREE.Mesh(cuartoEscalonGeo, piedraOscuroMat);
    cuartoEscalonIzqui.position.set(-38.243, 20.531, -8.483); // <- AJUSTAR
    chimeneaGroup.add(cuartoEscalonIzqui);

    const cuartoEscalonDer = new THREE.Mesh(cuartoEscalonGeo, piedraOscuroMat);
    cuartoEscalonDer.position.set(-38.243, 20.531, -21.716); // <- AJUSTAR
    chimeneaGroup.add(cuartoEscalonDer);

    const cuadradoExteriorColumnaGeo = new THREE.BoxGeometry(0.173, 15.582, 4.61); // <- AJUSTAR (más angosto y alto)
    const cuadradoExteriorColumnaIzq = new THREE.Mesh(cuadradoExteriorColumnaGeo, piedraOscuroMat);
    cuadradoExteriorColumnaIzq.position.set(-34.629, 29.381, -8.487); // <- AJUSTAR
    chimeneaGroup.add(cuadradoExteriorColumnaIzq);
    const cuadradoExteriorColumnaDer = new THREE.Mesh(cuadradoExteriorColumnaGeo, piedraOscuroMat);
    cuadradoExteriorColumnaDer.position.set(-34.629, 29.381, -21.698); // <- AJUSTAR
    chimeneaGroup.add(cuadradoExteriorColumnaDer);

    //MADERA SUPERIOR DECORACION DE 3 NIVELES //PONERLE UN TONO MAS OSCURO (CAMBIARLE EL COLOR)
    const maderaSuperiNivel1Geo = new THREE.BoxGeometry(8.989, 0.664, 22.873); // <- AJUSTAR
    const maderaSuperiNivel1 = new THREE.Mesh(maderaSuperiNivel1Geo, maderaMat);
    maderaSuperiNivel1.position.set(-38.141, 38.355, -15.1); // <- AJUSTAR
    chimeneaGroup.add(maderaSuperiNivel1);

    const maderaSuperiNivel2Geo = new THREE.BoxGeometry(9.362, 0.866, 19.991); // <- AJUSTAR
    const maderaSuperiNivel2 = new THREE.Mesh(maderaSuperiNivel2Geo, maderaMat);
    maderaSuperiNivel2.position.set(-37.954, 39.12, -15.076); // <- AJUSTAR
    chimeneaGroup.add(maderaSuperiNivel2);

    const maderaSuperiNivel3Geo = new THREE.BoxGeometry(9.046, 0.866, 17.281); // <- AJUSTAR
    const maderaSuperiNivel3 = new THREE.Mesh(maderaSuperiNivel3Geo, maderaMat);
    maderaSuperiNivel3.position.set(-37.981, 39.986, -15.081); // <- AJUSTAR
    chimeneaGroup.add(maderaSuperiNivel3);

    //PAREDES FIJAS DE TODO EL CONJUNTO (COLOR GRIS CLARO A AMBAS PAREDES)
    //PARED INFERIOR
    const paredInferiorGeo = new THREE.BoxGeometry(4.529, 18.245, 23.8); // <- AJUSTAR
    const paredInferior = new THREE.Mesh(paredInferiorGeo, piedraOscuroMat);
    paredInferior.position.set(-43.236, 9.323, -14.991); // <- AJUSTAR
    chimeneaGroup.add(paredInferior);
    //PARED SUPERIOR
    const paredSuperiorGeo = new THREE.BoxGeometry(3.613, 21.956, 23.8); // <- AJUSTAR
    const paredSuperior = new THREE.Mesh(paredSuperiorGeo, piedraOscuroMat);
    paredSuperior.position.set(-43.694, 29.423, -14.991); // <- AJUSTAR
    chimeneaGroup.add(paredSuperior);
    // ---------------------------------------------------------------
    // 6. LUZ CÁLIDA DEL FUEGO (opcional, le da vida sin partículas)
    // ---------------------------------------------------------------
    const fuegoLuz = new THREE.PointLight(0xff6b1a, 1.5, 4, 2);
    fuegoLuz.position.set(0, 1, 0.6); // <- AJUSTAR
    chimeneaGroup.add(fuegoLuz);

    return chimeneaGroup;
}