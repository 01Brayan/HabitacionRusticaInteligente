// ===============================================================
// PARED: PARED TRASERA CON VENTANAS Y CORTINAS
// ===============================================================
import * as THREE from 'three';

export function createWallBack() {
    const wallBackGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. CARGA DE TEXTURAS (Piedra, Madera Rústica, Lino de Cortina)
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

    // Materiales
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
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718,
        roughness: 1.0,
    });

    const horizontalesMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x4A3220, // vigas = tono intermedio
        roughness: 1.0,
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

    const vidrioMat = new THREE.MeshPhysicalMaterial({
        color: 0xBFD9E8,
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        metalness: 0,
        depthWrite: false,
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

    // ---------------------------------------------------------------
    // 2. PAREDES DE PANEL (Ladrillo/Piedra Central y Madera Laterales)
    // ---------------------------------------------------------------
    // Pared central de Ladrillo (Detrás de la cama)
    const wallGeo = new THREE.BoxGeometry(27.5, 63.613, 2);
    wallGeo.setAttribute('uv2', new THREE.BufferAttribute(wallGeo.attributes.uv.array, 2));
    const wallMesh = new THREE.Mesh(wallGeo, wallMat);
    wallMesh.position.set(-0.359, 31.306, 56.969);
    wallBackGroup.add(wallMesh);

    // Paredes inferiores de madera (Izquierda y Derecha)
    const wallInferiorGeo = new THREE.BoxGeometry(22.25, 8.5, 1.952);
    wallInferiorGeo.setAttribute('uv2', new THREE.BufferAttribute(wallInferiorGeo.attributes.uv.array, 2));
    const posParedesInf = [
        [28.016, 3.75, 56.845], // Pared Inferior Izquierda
        [-28.734, 3.75, 56.845]  // Pared Inferior Derecha
    ];
    posParedesInf.forEach(([x, y, z]) => {
        const mesh = new THREE.Mesh(wallInferiorGeo, pilaresMat);
        mesh.position.set(x, y, z);
        wallBackGroup.add(mesh);
    });

    // ---------------------------------------------------------------
    // 3. PILARES / COLUMNAS DE MADERA DE APOYO
    // ---------------------------------------------------------------
    // Pilares Centrales Altos
    const pillarCentralGeo = new THREE.BoxGeometry(3.5, 54, 3);
    pillarCentralGeo.setAttribute('uv2', new THREE.BufferAttribute(pillarCentralGeo.attributes.uv.array, 2));
    const posPilaresCent = [
        [15.141, 25.51, 56.469], // Pilar Central Izquierdo
        [-15.859, 25.51, 56.469]  // Pilar Central Derecho
    ];
    posPilaresCent.forEach(([x, y, z]) => {
        const pilar = new THREE.Mesh(pillarCentralGeo, pilaresMat);
        pilar.position.set(x, y, z);
        wallBackGroup.add(pilar);
    });

    // Pilares Medios
    const pilaresMediosGeo = new THREE.BoxGeometry(3.5, 42, 2.5);
    pilaresMediosGeo.setAttribute('uv2', new THREE.BufferAttribute(pilaresMediosGeo.attributes.uv.array, 2));
    const posPilaresMedios = [
        [28.641, 19.889, 56.669], // Pilar Medio Izquierdo
        [-29.323, 19.889, 56.669]  // Pilar Medio Derecho
    ];
    posPilaresMedios.forEach(([x, y, z]) => {
        const pilar = new THREE.Mesh(pilaresMediosGeo, pilaresMat);
        pilar.position.set(x, y, z);
        wallBackGroup.add(pilar);
    });

    // Pilares Extremos Bajos
    const pilaresExtremosGeo = new THREE.BoxGeometry(3, 34.262, 2.852);
    pilaresExtremosGeo.setAttribute('uv2', new THREE.BufferAttribute(pilaresExtremosGeo.attributes.uv.array, 2));
    const posPilaresExt = [
        [40.641, 15.369, 56.469], // Pilar Extremo Izquierdo
        [-41.359, 15.369, 56.395]  // Pilar Extremo Derecho
    ];
    posPilaresExt.forEach(([x, y, z]) => {
        const pilar = new THREE.Mesh(pilaresExtremosGeo, pilaresMat);
        pilar.position.set(x, y, z);
        wallBackGroup.add(pilar);
    });

    // Vigas Horizontales Superiores de madera
    const vigasHorizontalesGeo = new THREE.BoxGeometry(22.25, 2.5, 2);
    vigasHorizontalesGeo.setAttribute('uv2', new THREE.BufferAttribute(vigasHorizontalesGeo.attributes.uv.array, 2));
    const posVigasHoriz = [
        [28.016, 31.25, 56.969], // Viga Horizontal Izquierda
        [-28.734, 31.25, 56.969]  // Viga Horizontal Derecha
    ];
    posVigasHoriz.forEach(([x, y, z]) => {
        const viga = new THREE.Mesh(vigasHorizontalesGeo, horizontalesMat);
        viga.position.set(x, y, z);
        wallBackGroup.add(viga);
    });

    // ---------------------------------------------------------------
    // 4. VENTANA IZQUIERDA Y SUS DETALLES (Vidrio, Marcos y Cortina)
    // ---------------------------------------------------------------
    // Marcos exteriores e interiores de la Ventana Izquierda
    const marcosIzqConfig = [
        { geo: new THREE.BoxGeometry(0.75, 20.5, 1.5),   pos: [38.766, 19, 57.071] },     // Marco Izquierdo
        { geo: new THREE.BoxGeometry(0.75, 39.75, 1.5),  pos: [17.266, 28.625, 57.071] },  // Marco Derecho
        { geo: new THREE.BoxGeometry(22.25, 1.5, 1.5),   pos: [28.016, 30, 57.071] },      // Marco Superior
        { geo: new THREE.BoxGeometry(22.25, 0.75, 1.5),  pos: [28.016, 8.375, 57.071] },   // Marco Inferior
        { geo: new THREE.BoxGeometry(0.75, 32.139, 1.5), pos: [30.766, 24.819, 57.071] },  // Marco Interno Izq
        { geo: new THREE.BoxGeometry(0.75, 32.474, 1.5), pos: [26.516, 24.987, 57.071] },  // Marco Interno Der
        { geo: new THREE.BoxGeometry(22.25, 1.5, 1.25),  pos: [28.016, 22.25, 57.196] }    // Marco Interno Medio
    ];
    marcosIzqConfig.forEach(({ geo, pos: [x, y, z] }) => {
        geo.setAttribute('uv2', new THREE.BufferAttribute(geo.attributes.uv.array, 2));
        const marco = new THREE.Mesh(geo, horizontalesMat);
        marco.position.set(x, y, z);
        wallBackGroup.add(marco);
    });

    // Vidrio Ventana Izquierda
    const vidrioIzquierdaGeo = new THREE.BoxGeometry(20.75, 39, 0.25);
    const vidrioIzquierda = new THREE.Mesh(vidrioIzquierdaGeo, vidrioMat);
    vidrioIzquierda.position.set(28.016, 28.25, 57.196);

    // Cortina Ventana Izquierda
    // La geometria tiene el TOPE en el origen (translate hacia ABAJO),
    // asi al escalar en Y la cortina crece hacia abajo sin mover el tope.
    const cortinaIzquierdaGeo = new THREE.PlaneGeometry(22.25, 40.5, 1, 20);
    cortinaIzquierdaGeo.translate(0, -20.25, 0);
    cortinaIzquierdaGeo.setAttribute('uv2', new THREE.BufferAttribute(cortinaIzquierdaGeo.attributes.uv.array, 2));
    const cortinaIzquierda = new THREE.Mesh(cortinaIzquierdaGeo, cortinaMat);
    cortinaIzquierda.position.set(28.016, 48.5, 56.046);

    wallBackGroup.add(vidrioIzquierda, cortinaIzquierda);

    // ---------------------------------------------------------------
    // 5. VENTANA DERECHA Y SUS DETALLES (Vidrio y Marcos)
    // ---------------------------------------------------------------
    // Marcos exteriores e interiores de la Ventana Derecha
    const marcosDerConfig = [
        { geo: new THREE.BoxGeometry(0.75, 39.75, 1.5),  pos: [-17.984, 28.625, 57.071] }, // Marco Izquierdo
        { geo: new THREE.BoxGeometry(0.75, 20.5, 1.5),   pos: [-39.484, 19, 57.071] },     // Marco Derecho
        { geo: new THREE.BoxGeometry(22.25, 1.5, 1.5),   pos: [-28.734, 30, 57.071] },      // Marco Superior
        { geo: new THREE.BoxGeometry(22.25, 0.75, 1.5),  pos: [-28.734, 8.375, 57.071] },   // Marco Inferior
        { geo: new THREE.BoxGeometry(0.75, 32.139, 1.5), pos: [-27.198, 24.819, 57.071] },  // Marco Interno Izq
        { geo: new THREE.BoxGeometry(0.75, 32.139, 1.5), pos: [-31.448, 24.819, 57.071] },  // Marco Interno Der
        { geo: new THREE.BoxGeometry(22.25, 1.5, 1.25),  pos: [-28.734, 22.25, 57.196] }    // Marco Interno Medio
    ];
    marcosDerConfig.forEach(({ geo, pos: [x, y, z] }) => {
        geo.setAttribute('uv2', new THREE.BufferAttribute(geo.attributes.uv.array, 2));
        const marco = new THREE.Mesh(geo, horizontalesMat);
        marco.position.set(x, y, z);
        wallBackGroup.add(marco);
    });

    // Vidrio Ventana Derecha
    const vidrioDerechaGeo = new THREE.BoxGeometry(20.75, 39, 0.25);
    const vidrioDerecha = new THREE.Mesh(vidrioDerechaGeo, vidrioMat);
    vidrioDerecha.position.set(-28.734, 28.25, 57.196);

    // Cortina Ventana Derecha
    const cortinaDerechaGeo = new THREE.PlaneGeometry(22.25, 40.5, 1, 20);
    cortinaDerechaGeo.translate(0, -20.25, 0);
    cortinaDerechaGeo.setAttribute('uv2', new THREE.BufferAttribute(cortinaDerechaGeo.attributes.uv.array, 2));
    const cortinaDerecha = new THREE.Mesh(cortinaDerechaGeo, cortinaMat);
    cortinaDerecha.position.set(-28.734, 48.5, 56.046);

    wallBackGroup.add(vidrioDerecha, cortinaDerecha);

    // ---------------------------------------------------------------
    // 6. DETALLES DE SOPORTE DE PIEDRA BAJO LOS PILARES
    // ---------------------------------------------------------------
    // Cuadrados de Soporte Medios (Piedra Grisácea)
    const squareCentralGeo = new THREE.BoxGeometry(4, 4.2, 0.7);
    squareCentralGeo.setAttribute('uv2', new THREE.BufferAttribute(squareCentralGeo.attributes.uv.array, 2));
    const posSquaresMedios = [
        [28.641, 1.6, 55.519], // Soporte Medio Izquierdo
        [-29.323, 1.6, 55.519]  // Soporte Medio Derecho
    ];
    posSquaresMedios.forEach(([x, y, z]) => {
        const soporte = new THREE.Mesh(squareCentralGeo, baseColumnaMat);
        soporte.position.set(x, y, z);
        wallBackGroup.add(soporte);
    });

    // Cuadrados de Soporte Cercanos de Pilares Altos
    const squareCercanoGeo = new THREE.BoxGeometry(4, 4.2, 1.15);
    squareCercanoGeo.setAttribute('uv2', new THREE.BufferAttribute(squareCercanoGeo.attributes.uv.array, 2));
    const posSquaresCercanos = [
        [15.141, 1.6, 55.294], // Soporte Central Izquierdo
        [-15.859, 1.6, 55.294]  // Soporte Central Derecho
    ];
    posSquaresCercanos.forEach(([x, y, z]) => {
        const soporte = new THREE.Mesh(squareCercanoGeo, baseColumnaMat);
        soporte.position.set(x, y, z);
        wallBackGroup.add(soporte);
    });

    // --esto fue modificado: Recorrido para que toda la pared trasera proyecte y reciba sombras (excepto el vidrio transparente de las ventanas)
    wallBackGroup.traverse((child) => {
        if (child.isMesh) {
            if (child.material === vidrioMat) {
                child.castShadow = false; // El vidrio no debe proyectar sombra opaca
            } else {
                child.castShadow = true;
            }
            child.receiveShadow = true;
        }
    });

    // ================================================
    // CONTROL DE CORTINAS (se estiran hacia abajo)
    // ================================================
    // escala 1 = cortina estirada (cerrada, cubre la ventana)
    // escala 0.35 = cortina recogida arriba (abierta)
    let objetivoCortina = 0.35;
    wallBackGroup.userData.setCortina = (escala) => {
        objetivoCortina = escala;
    };
    wallBackGroup.userData.actualizarCortina = () => {
        cortinaIzquierda.scale.y = THREE.MathUtils.lerp(cortinaIzquierda.scale.y, objetivoCortina, 0.05);
        cortinaDerecha.scale.y = THREE.MathUtils.lerp(cortinaDerecha.scale.y, objetivoCortina, 0.05);
    };

    return wallBackGroup;
}