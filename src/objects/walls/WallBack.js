import * as THREE from 'three';

export function createWallBack() {
    const wallBackGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. PIEDRA (panel central de la pared, detrás de la cama)
    // ---------------------------------------------------------------
    const piedraDiffuse = textureLoader.load('src/assets/textures/stone/stone_diff_2k.jpg');
    const piedraNormal  = textureLoader.load('src/assets/textures/stone/stone_nor_gl_2k.jpg');
    const piedraRough   = textureLoader.load('src/assets/textures/stone/stone_rough_2k.jpg');
    const piedraAO      = textureLoader.load('src/assets/textures/stone/stone_ao_2k.jpg');

    piedraDiffuse.colorSpace = THREE.SRGBColorSpace;
    [piedraDiffuse, piedraNormal, piedraRough, piedraAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 3);
    });

    // ---------------------------------------------------------------
    // 2. MADERA (pilares, vigas horizontales, vigas delgadas, soportes, marco)
    //    -> rough_wood (la misma que ya corregimos en el techo)
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
    // MATERIALES
    // ---------------------------------------------------------------
    const wallMat = new THREE.MeshStandardMaterial({
        map: piedraDiffuse,
        normalMap: piedraNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: piedraRough,
        aoMap: piedraAO,
        color: 0x6E6259, // piedra cálida, igual que la chimenea
        roughness: 1.0,
    });

    const pilaresMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718, // columnas = tono más oscuro
        roughness: 1.0,
    });

    const horizontalesMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x4A3220, // vigas = tono intermedio
        roughness: 1.0,
    });

    const vigasHorizontalesMat = horizontalesMat; // mismo material, se reusa (menos memoria)
    const vigasHorizontalesdelgadasMat = horizontalesMat;

    const soporteMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718, // soporte = mismo tono que columnas (pieza estructural)
        roughness: 1.0,
    });

    // Cortinas -> tela de lino (rough_linen), no madera
    const linenDiffuse = textureLoader.load('src/assets/textures/linen/linen_diff_2k.jpg');
    const linenNormal  = textureLoader.load('src/assets/textures/linen/linen_nor_gl_2k.jpg');
    const linenRough   = textureLoader.load('src/assets/textures/linen/linen_rough_2k.jpg');
    const linenAO      = textureLoader.load('src/assets/textures/linen/linen_ao_2k.jpg');

    linenDiffuse.colorSpace = THREE.SRGBColorSpace;
    [linenDiffuse, linenNormal, linenRough, linenAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
    });

    const cortinaMat = new THREE.MeshStandardMaterial({
        map: linenDiffuse,
        normalMap: linenNormal,
        roughnessMap: linenRough,
        aoMap: linenAO,
        color: 0xD9CFB8, // tono crema/lino, el que definimos para cortinas
        roughness: 0.9,
        side: THREE.DoubleSide, // para que se vea la tela desde ambos lados
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
    });

    // Vidrio real (material físico, no necesita textura de imagen)
    const vidrioMat = new THREE.MeshPhysicalMaterial({
        color: 0xBFD9E8,
        transmission: 0.95,
        roughness: 0.05,
        thickness: 0.3,
        ior: 1.5,
        metalness: 0,
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

    // pared cental de ladrillo detras de la cama
    const wallGeo = new THREE.BoxGeometry(27.5, 63.613, 2);
    wallGeo.setAttribute('uv2', new THREE.BufferAttribute(wallGeo.attributes.uv.array, 2));
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(-0.359, 31.306, 56.969);
    wallBackGroup.add(wallMesh);
    // pared inferior de madera izquierdo
    const wallInferiorIzquierdoGeo = new THREE.BoxGeometry(22.25, 8.5, 1.952);
    wallInferiorIzquierdoGeo.setAttribute('uv2', new THREE.BufferAttribute(wallInferiorIzquierdoGeo.attributes.uv.array, 2));
    const wallInferiorIzquierdoMesh = new THREE.Mesh(wallInferiorIzquierdoGeo, pilaresMat);
    wallInferiorIzquierdoMesh.position.set(28.016, 3.75, 56.845);
    wallBackGroup.add(wallInferiorIzquierdoMesh);
    // pared inferior de madera derecho
    const wallInferiorDerechoGeo = new THREE.BoxGeometry(22.25, 8.5, 1.952);
    wallInferiorDerechoGeo.setAttribute('uv2', new THREE.BufferAttribute(wallInferiorDerechoGeo.attributes.uv.array, 2));
    const wallInferiorDerechoMesh = new THREE.Mesh(wallInferiorDerechoGeo, pilaresMat);
    wallInferiorDerechoMesh.position.set(-28.734, 3.75, 56.845);
    wallBackGroup.add(wallInferiorDerechoMesh);

    //Pilares
    //pilares centrales
    
    const pillarCentralGeo = new THREE.BoxGeometry(3.5, 54, 3);
    pillarCentralGeo.setAttribute('uv2', new THREE.BufferAttribute(pillarCentralGeo.attributes.uv.array, 2));
    //pilar izquierdo 
    const pilarCentralIzquierdo = new THREE.Mesh(pillarCentralGeo, pilaresMat);
    pilarCentralIzquierdo.position.set(15.141, 25.51, 56.469);
    wallBackGroup.add(pilarCentralIzquierdo);
    //pilar derecho
    const pilarCentralDerecho = new THREE.Mesh(pillarCentralGeo, pilaresMat);
    pilarCentralDerecho.position.set(-15.859, 25.51, 56.469);
    wallBackGroup.add(pilarCentralDerecho);

    // pilares medios
    //===========================
    const pilaresMediosGeo = new THREE.BoxGeometry(3.5, 42, 2.5);
    pilaresMediosGeo.setAttribute('uv2', new THREE.BufferAttribute(pilaresMediosGeo.attributes.uv.array, 2));
    //pilar izquierdo
    const pilarMedioIzquierdo = new THREE.Mesh(pilaresMediosGeo, pilaresMat);
    pilarMedioIzquierdo.position.set(28.641, 19.889, 56.669);
    wallBackGroup.add(pilarMedioIzquierdo);
    //pilar derecho
    const pilarMedioDerecho = new THREE.Mesh(pilaresMediosGeo, pilaresMat);
    pilarMedioDerecho.position.set(-29.323, 19.889, 56.669);
    wallBackGroup.add(pilarMedioDerecho);

    // pilares extremos
    const pilaresExtremosGeo = new THREE.BoxGeometry(3, 34.262, 2.852);
    pilaresExtremosGeo.setAttribute('uv2', new THREE.BufferAttribute(pilaresExtremosGeo.attributes.uv.array, 2));
    // pilar izquierdo
    const pilarExtremoIzquierdo = new THREE.Mesh(pilaresExtremosGeo, pilaresMat);
    pilarExtremoIzquierdo.position.set(40.641, 15.369, 56.469);
    wallBackGroup.add(pilarExtremoIzquierdo);
    // pilar derecho
    const pilarExtremoDerecho = new THREE.Mesh(pilaresExtremosGeo, pilaresMat);
    pilarExtremoDerecho.position.set(-41.359, 15.369, 56.395);
    wallBackGroup.add(pilarExtremoDerecho);

    // Vigas horizontales 
    const vigasHorizontalesGeo = new THREE.BoxGeometry(22.25, 2.5, 2);
    vigasHorizontalesGeo.setAttribute('uv2', new THREE.BufferAttribute(vigasHorizontalesGeo.attributes.uv.array, 2));
    // viga horizontal izquierda
    const vigaHorizontalIzquierda = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
    vigaHorizontalIzquierda.position.set(28.016, 31.25, 56.969);
    wallBackGroup.add(vigaHorizontalIzquierda);
    // viga horizontal derecha
    const vigaHorizontalDerecha = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
    vigaHorizontalDerecha.position.set(-28.734, 31.25, 56.969);
    wallBackGroup.add(vigaHorizontalDerecha);
    // marco de la ventana izquierda
    //==================
    // ventana izquierda
    // marco izquierdo
    const marcoIzquierdoGeo = new THREE.BoxGeometry(0.75, 20.5, 1.5);
    marcoIzquierdoGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoIzquierdoGeo.attributes.uv.array, 2));
    const marcoIzquierdo = new THREE.Mesh(marcoIzquierdoGeo, horizontalesMat);
    marcoIzquierdo.position.set(38.766, 19, 57.071);
    wallBackGroup.add(marcoIzquierdo);
    // marco derecho
    const marcoDerechoGeo = new THREE.BoxGeometry(0.75, 39.75, 1.5);
    marcoDerechoGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoDerechoGeo.attributes.uv.array, 2));
    const marcoDerecho = new THREE.Mesh(marcoDerechoGeo, horizontalesMat);
    marcoDerecho.position.set(17.266, 28.625, 57.071);
    wallBackGroup.add(marcoDerecho);
    // marco superior
    const marcoSuperiorGeo = new THREE.BoxGeometry(22.25, 1.5, 1.5);
    marcoSuperiorGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoSuperiorGeo.attributes.uv.array, 2));
    const marcoSuperior = new THREE.Mesh(marcoSuperiorGeo, horizontalesMat);
    marcoSuperior.position.set(28.016, 30, 57.071);
    wallBackGroup.add(marcoSuperior);
    // marco inferior
    const marcoInferiorGeo = new THREE.BoxGeometry(22.25, 0.75, 1.5);
    marcoInferiorGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoInferiorGeo.attributes.uv.array, 2));
    const marcoInferior = new THREE.Mesh(marcoInferiorGeo, horizontalesMat);
    marcoInferior.position.set(28.016, 8.375, 57.071);
    wallBackGroup.add(marcoInferior);
    // marco interno izquierdo
    const marcoInternoIzquierdoGeo = new THREE.BoxGeometry(0.75, 32.139, 1.5);
    marcoInternoIzquierdoGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoInternoIzquierdoGeo.attributes.uv.array, 2));
    const marcoInternoIzquierdo = new THREE.Mesh(marcoInternoIzquierdoGeo, horizontalesMat);
    marcoInternoIzquierdo.position.set(30.766, 24.819, 57.071);
    wallBackGroup.add(marcoInternoIzquierdo);
    // marco interno derecho
    const marcoInternoDerechoGeo = new THREE.BoxGeometry(0.75, 32.474, 1.5);
    marcoInternoDerechoGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoInternoDerechoGeo.attributes.uv.array, 2));
    const marcoInternoDerecho = new THREE.Mesh(marcoInternoDerechoGeo, horizontalesMat);
    marcoInternoDerecho.position.set(26.516, 24.987, 57.071);
    wallBackGroup.add(marcoInternoDerecho);
    // marco interno medio
    const marcoInternoMedioGeo = new THREE.BoxGeometry(22.25, 1.5, 1.25);
    marcoInternoMedioGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoInternoMedioGeo.attributes.uv.array, 2));
    const marcoInternoMedio = new THREE.Mesh(marcoInternoMedioGeo, horizontalesMat);
    marcoInternoMedio.position.set(28.016, 22.25, 57.196);
    wallBackGroup.add(marcoInternoMedio);

    // vidrio izquierda
    const vidrioIzquierdaGeo = new THREE.BoxGeometry(20.75, 39, 0.25);
    const vidrioIzquierda = new THREE.Mesh(vidrioIzquierdaGeo, vidrioMat);
    vidrioIzquierda.position.set(28.016, 28.25, 57.196);
    wallBackGroup.add(vidrioIzquierda);
    
    // cortina izquierda
    const cortinaIzquierdaGeo = new THREE.PlaneGeometry(22.25, 16, 1, 20);
    cortinaIzquierdaGeo.setAttribute('uv2', new THREE.BufferAttribute(cortinaIzquierdaGeo.attributes.uv.array, 2));
    const cortinaIzquierda = new THREE.Mesh(cortinaIzquierdaGeo, cortinaMat);
    cortinaIzquierda.position.set(28.016, 40.5, 56.046);
    wallBackGroup.add(cortinaIzquierda);
    
    // marco de la ventana derecha
    //==================
    // ventana derecha
    // marco izquierdo
    const marcoIzquierdoDerechaGeo = new THREE.BoxGeometry(0.75, 39.75, 1.5);
    marcoIzquierdoDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoIzquierdoDerechaGeo.attributes.uv.array, 2));
    const marcoIzquierdoDerecha = new THREE.Mesh(marcoIzquierdoDerechaGeo, horizontalesMat);
    marcoIzquierdoDerecha.position.set(-17.984, 28.625, 57.071);
    wallBackGroup.add(marcoIzquierdoDerecha);
    // marco derecho
    const marcoDerechoDerechaGeo = new THREE.BoxGeometry(0.75, 20.5, 1.5);
    marcoDerechoDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoDerechoDerechaGeo.attributes.uv.array, 2));
    const marcoDerechoDerecha = new THREE.Mesh(marcoDerechoDerechaGeo, horizontalesMat);
    marcoDerechoDerecha.position.set(-39.484, 19, 57.071);
    wallBackGroup.add(marcoDerechoDerecha);
    // marco superior
    const marcoSuperiorDerechaGeo = new THREE.BoxGeometry(22.25, 1.5, 1.5);
    marcoSuperiorDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoSuperiorDerechaGeo.attributes.uv.array, 2));
    const marcoSuperiorDerecha = new THREE.Mesh(marcoSuperiorDerechaGeo, horizontalesMat);
    marcoSuperiorDerecha.position.set(-28.734, 30, 57.071);
    wallBackGroup.add(marcoSuperiorDerecha);
    // marco inferior
    const marcoInferiorDerechaGeo = new THREE.BoxGeometry(22.25, 0.75, 1.5);
    marcoInferiorDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoInferiorDerechaGeo.attributes.uv.array, 2));
    const marcoInferiorDerecha = new THREE.Mesh(marcoInferiorDerechaGeo, horizontalesMat);
    marcoInferiorDerecha.position.set(-28.734, 8.375, 57.071);
    wallBackGroup.add(marcoInferiorDerecha);
    // marco interno izquierdo
    const marcoInternoIzquierdoDerechaGeo = new THREE.BoxGeometry(0.75, 32.139, 1.5);
    marcoInternoIzquierdoDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoInternoIzquierdoDerechaGeo.attributes.uv.array, 2));
    const marcoInternoIzquierdoDerecha = new THREE.Mesh(marcoInternoIzquierdoDerechaGeo, horizontalesMat);
    marcoInternoIzquierdoDerecha.position.set(-27.198, 24.819, 57.071);
    wallBackGroup.add(marcoInternoIzquierdoDerecha);
    // marco interno derecho
    const marcoInternoDerechoDerechaGeo = new THREE.BoxGeometry(0.75, 32.139, 1.5);
    marcoInternoDerechoDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoInternoDerechoDerechaGeo.attributes.uv.array, 2));
    const marcoInternoDerechoDerecha = new THREE.Mesh(marcoInternoDerechoDerechaGeo, horizontalesMat);
    marcoInternoDerechoDerecha.position.set(-31.448, 24.819, 57.071);
    wallBackGroup.add(marcoInternoDerechoDerecha);
    // marco interno medio derecha
    const marcoInternoMedioDerechaGeo = new THREE.BoxGeometry(22.25, 1.5, 1.25);
    marcoInternoMedioDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(marcoInternoMedioDerechaGeo.attributes.uv.array, 2));
    const marcoInternoMedioDerecha = new THREE.Mesh(marcoInternoMedioDerechaGeo, horizontalesMat);
    marcoInternoMedioDerecha.position.set(-28.734, 22.25, 57.196); 
    wallBackGroup.add(marcoInternoMedioDerecha);
    // vidrio derecha
    const vidrioDerechaGeo = new THREE.BoxGeometry(20.75, 39, 0.25);
    const vidrioDerecha = new THREE.Mesh(vidrioDerechaGeo, vidrioMat);
    vidrioDerecha.position.set(-28.734, 28.25, 57.196);
    wallBackGroup.add(vidrioDerecha);
    // cortina derecha
    const cortinaDerechaGeo = new THREE.PlaneGeometry(22.25, 16, 1, 20);
    cortinaDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(cortinaDerechaGeo.attributes.uv.array, 2));
    const cortinaDerecha = new THREE.Mesh(cortinaDerechaGeo, cortinaMat);
    cortinaDerecha.position.set(-28.734, 40.5, 56.046);
    wallBackGroup.add(cortinaDerecha);

    //cuadrados centrales para columnas de piedra
    const squareCentralGeo = new THREE.BoxGeometry(4, 4.2, 0.7);
    squareCentralGeo.setAttribute('uv2', new THREE.BufferAttribute(squareCentralGeo.attributes.uv.array, 2));
    // cuadrado central lado izquierdo
    const squareMedioIzquierdo  = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
    squareMedioIzquierdo .position.set(28.641, 1.6, 55.519);
    wallBackGroup.add(squareMedioIzquierdo ); 
    // cuadrado central lado derecho
    const squareMedioDerecho  = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
    squareMedioDerecho .position.set(-29.323, 1.6, 55.519);
    wallBackGroup.add(squareMedioDerecho );
    // cuadrados centrales cercanos
    const squareCercanoGeo = new THREE.BoxGeometry(4, 4.2, 1.15);
    squareCercanoGeo.setAttribute('uv2', new THREE.BufferAttribute(squareCercanoGeo.attributes.uv.array, 2));
    // cuadrado cercano lado izquierdo
    const squareCentralIzquierdo  = new THREE.Mesh(squareCercanoGeo, baseColumnaMat);
    squareCentralIzquierdo .position.set(15.141, 1.6, 55.294);
    wallBackGroup.add(squareCentralIzquierdo );
    // cuadrado cercano lado derecho
    const squareCentralDerecho  = new THREE.Mesh(squareCercanoGeo, baseColumnaMat);
    squareCentralDerecho .position.set(-15.859, 1.6, 55.294);
    wallBackGroup.add(squareCentralDerecho );



    return wallBackGroup; // ¡MUY IMPORTANTE RETORNARLO!
}