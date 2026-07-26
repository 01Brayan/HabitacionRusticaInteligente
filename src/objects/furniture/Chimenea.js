// ===============================================================
// MUEBLE: CHIMENEA DE PIEDRA Y MADERA
// ===============================================================
import * as THREE from 'three';

export function createChimenea() {
    const chimeneaGroup = new THREE.Group();
    chimeneaGroup.name = "chimeneaPrincipal";

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. CARGA DE TEXTURAS (Piedra, Piedra Oscura y Madera)
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
        tex.repeat.set(1, 2); 
    });

    // Materiales
    const piedraMat = new THREE.MeshStandardMaterial({
        map: piedraDiffuse,
        normalMap: piedraNormal,
        normalScale: new THREE.Vector2(1.5, 1.5),
        roughnessMap: piedraRough,
        aoMap: piedraAO,
        roughness: 1,
        aoMapIntensity: 1.8,
        color: 0x453f37,
    });

    const piedraOscuroMat = new THREE.MeshStandardMaterial({
        map: piedraDiffuse,
        normalMap: piedraNormal,
        normalScale: new THREE.Vector2(1, 1),
        roughnessMap: piedraRough,
        aoMap: piedraAO,
        roughness: 1,
        aoMapIntensity: 1.8,
        color: 0x2f2b26,
    });

    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        roughnessMap: maderaRough,
        color: 0x1a0f08,
        roughness: 0.45,
    });

    const hogarInteriorMat = new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 1,
    });

    // ---------------------------------------------------------------
    // 2. BASE DE 3 NIVELES
    // ---------------------------------------------------------------
    const basesConfig = [
        { geo: new THREE.BoxGeometry(13.6, 0.6, 23.8), pos: [-38.7, -0.2, -14.991] },  // Primer nivel (Inferior)
        { geo: new THREE.BoxGeometry(13, 0.45, 23),    pos: [-39, 0.425, -14.991] },   // Segundo nivel (Medio)
        { geo: new THREE.BoxGeometry(12.4, 0.583, 22.2), pos: [-39.3, 0.942, -14.991] } // Tercer nivel (Superior)
    ];
    basesConfig.forEach(({ geo, pos: [x, y, z] }) => {
        const base = new THREE.Mesh(geo, piedraMat);
        base.position.set(x, y, z);
        chimeneaGroup.add(base);
    });

    // ---------------------------------------------------------------
    // 3. COLUMNAS INFERIORES LATERALES
    // ---------------------------------------------------------------
    // Bloques Cuadrados de las Columnas (Izquierdo y Derecho)
    const baseColumnaGeo = new THREE.BoxGeometry(6.728, 3.249, 4.199);
    const posBaseColumnas = [
        [-37.607, 3.796, -6.431], // Columna Izquierda
        [-37.607, 3.796, -23.612] // Columna Derecha
    ];
    posBaseColumnas.forEach(([x, y, z]) => {
        const bloque = new THREE.Mesh(baseColumnaGeo, piedraMat);
        bloque.position.set(x, y, z);
        chimeneaGroup.add(bloque);
    });

    // Soportes de Piedra Oscura debajo de las columnas
    const soportBaseInferGeo = new THREE.BoxGeometry(6.948, 0.94, 4.769);
    const posSoportesInf = [
        [-37.498, 1.702, -6.505], // Izquierdo
        [-37.498, 1.702, -23.687] // Derecho
    ];
    posSoportesInf.forEach(([x, y, z]) => {
        const soporte = new THREE.Mesh(soportBaseInferGeo, piedraOscuroMat);
        soporte.position.set(x, y, z);
        chimeneaGroup.add(soporte);
    });

    // Columnas Principales
    const columnaInferiorGeo = new THREE.BoxGeometry(6.256, 6.495, 3.255);
    const posColumnasInf = [
        [-37.844, 10.043, -6.436], // Izquierda
        [-37.844, 10.043, -23.617] // Derecha
    ];
    posColumnasInf.forEach(([x, y, z]) => {
        const columna = new THREE.Mesh(columnaInferiorGeo, piedraMat);
        columna.position.set(x, y, z);
        chimeneaGroup.add(columna);
    });

    // Decoraciones Delante de Columnas (Piedra Oscura)
    const cuadradoPosteriorGeo = new THREE.BoxGeometry(0.169, 5.625, 2.578);
    const posDecoCol = [
        [-34.631, 10.03, -6.428], // Izquierda
        [-34.631, 10.03, -23.609] // Derecha
    ];
    posDecoCol.forEach(([x, y, z]) => {
        const deco = new THREE.Mesh(cuadradoPosteriorGeo, piedraOscuroMat);
        deco.position.set(x, y, z);
        chimeneaGroup.add(deco);
    });

    // ---------------------------------------------------------------
    // 4. SOPORTES GRADUADOS EN MEDIO DE LAS COLUMNAS (3 niveles c/u)
    // ---------------------------------------------------------------
    const escalonadosConfig = [
        // Primer Nivel
        { geo: new THREE.BoxGeometry(6.948, 0.458, 4.632), pos: [[-37.498, 5.65, -6.437], [-37.498, 5.65, -23.618]] },
        // Segundo Nivel
        { geo: new THREE.BoxGeometry(6.506, 0.458, 3.717), pos: [[-37.718, 6.108, -6.442], [-37.718, 6.108, -23.623]] },
        // Tercer Nivel
        { geo: new THREE.BoxGeometry(6.374, 0.458, 3.464), pos: [[-37.785, 6.566, -6.445], [-37.785, 6.566, -23.626]] },
        // Soporte Superior
        { geo: new THREE.BoxGeometry(6.374, 0.458, 3.464), pos: [[-37.785, 13.507, -6.445], [-37.785, 13.507, -23.626]] }
    ];
    escalonadosConfig.forEach(({ geo, pos }) => {
        pos.forEach(([x, y, z]) => {
            const pieza = new THREE.Mesh(geo, piedraOscuroMat);
            pieza.position.set(x, y, z);
            chimeneaGroup.add(pieza);
        });
    });

    // Soporte de Vigas Superior (Delgado y Grueso)
    const soporteLargoAnchoSupGeo = new THREE.BoxGeometry(6.062, 3.047, 20.001);
    const soporteLargoAnchoSup = new THREE.Mesh(soporteLargoAnchoSupGeo, piedraOscuroMat);
    soporteLargoAnchoSup.position.set(-37.941, 15.009, -15.036);

    const SoporteAlargoDelgSupGeo = new THREE.BoxGeometry(6.482, 0.472, 20.899);
    const SoporteAlargoDelgSup = new THREE.Mesh(SoporteAlargoDelgSupGeo, piedraOscuroMat);
    SoporteAlargoDelgSup.position.set(-37.73, 13.972, -15.034);

    chimeneaGroup.add(soporteLargoAnchoSup, SoporteAlargoDelgSup);

    // ---------------------------------------------------------------
    // 5. CAJA DE HOGAR Y MARCOS DE LA CHIMENEA (Frente, Piso, Paredes)
    // ---------------------------------------------------------------
    // Marco Exterior Vertical (Izquierdo y Derecho)
    const marcoExteriVertiGeo = new THREE.BoxGeometry(0.924, 11.139, 1.899);
    const posMarcosVert = [
        [-35.714, 6.801, -8.776], // Izquierdo
        [-35.714, 6.801, -21.233] // Derecho
    ];
    posMarcosVert.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoExteriVertiGeo, piedraMat);
        marco.position.set(x, y, z);
        chimeneaGroup.add(marco);
    });

    // Marco Exterior Horizontal
    const marcoExteriHorizonGeo = new THREE.BoxGeometry(0.924, 1.367, 14.356);
    const marcoExteriHoriz = new THREE.Mesh(marcoExteriHorizonGeo, piedraMat);
    marcoExteriHoriz.position.set(-35.714, 13.054, -15.004);

    // Marcos Interiores (Izquierdo y Derecho)
    const marcoInteriorVertiGeo = new THREE.BoxGeometry(0.172, 8.126, 1.52);
    const posMarcosInt = [
        [-35.839, 6.874, -9.946], // Izquierdo
        [-35.839, 6.874, -20.073] // Derecho
    ];
    posMarcosInt.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoInteriorVertiGeo, piedraOscuroMat);
        marco.position.set(x, y, z);
        chimeneaGroup.add(marco);
    });

    // Marcos Interiores Horizontales (Ancho y Delgado)
    const marcoInteriorHorizAnchoGeo = new THREE.BoxGeometry(0.622, 1.807, 10.568);
    const marcoInteriorHorizAncho = new THREE.Mesh(marcoInteriorHorizAnchoGeo, piedraOscuroMat);
    marcoInteriorHorizAncho.position.set(-35.865, 2.137, -15.01);

    const marcoInteriorHorizDelgadoGeo = new THREE.BoxGeometry(0.622, 1.42, 11.019);
    const marcoInteriorHorizDelgado = new THREE.Mesh(marcoInteriorHorizDelgadoGeo, piedraOscuroMat);
    marcoInteriorHorizDelgado.position.set(-35.865, 3.152, -15.235);

    // Piso, Pared y Techo de la Chimenea (Color Negro Interior)
    const pisoChimeneaGeo = new THREE.BoxGeometry(5.048, 0.622, 13.269);
    const pisoChimenea = new THREE.Mesh(pisoChimeneaGeo, piedraOscuroMat);
    pisoChimenea.position.set(-38.445, 1.4, -14.856);

    const techoChimeneaGeo = new THREE.BoxGeometry(4.28, 0.622, 13.418);
    const techoChimenea = new THREE.Mesh(techoChimeneaGeo, hogarInteriorMat);
    techoChimenea.position.set(-38.6, 13.796, -15.227);

    const paredChimeneaGeo = new THREE.BoxGeometry(0.603, 12.503, 14.356);
    const paredChimenea = new THREE.Mesh(paredChimeneaGeo, hogarInteriorMat);
    paredChimenea.position.set(-40.901, 7.484, -15.003);

    chimeneaGroup.add(marcoExteriHoriz, marcoInteriorHorizAncho, marcoInteriorHorizDelgado, pisoChimenea, techoChimenea, paredChimenea);

    // Marco Superior Curvo (4 Cuadrados rotados)
    const curvasConfig = [
        { geo: new THREE.BoxGeometry(0.622, 2.047, 2.609), rot: 25.3,   pos: [-35.865, 11.631, -10.472] },
        { geo: new THREE.BoxGeometry(0.622, 1.239, 2.981), rot: 9.421,  pos: [-35.865, 12.06,  -13.063] },
        { geo: new THREE.BoxGeometry(0.622, 1.122, 3.387), rot: -7.678, pos: [-35.865, 12.074, -15.99]  },
        { geo: new THREE.BoxGeometry(0.622, 2.256, 3.777), rot: -25.919,pos: [-35.865, 11.65,  -19.324] }
    ];
    curvasConfig.forEach(({ geo, rot, pos: [x, y, z] }) => {
        const pieza = new THREE.Mesh(geo, piedraOscuroMat);
        pieza.position.set(x, y, z);
        pieza.rotation.x = THREE.MathUtils.degToRad(rot);
        chimeneaGroup.add(pieza);
    });

    // ---------------------------------------------------------------
    // 6. REPISE SUPERIOR DE MADERA DECORATIVA (4 Niveles)
    // ---------------------------------------------------------------
    const repisasMaderaConfig = [
        { geo: new THREE.BoxGeometry(7.671, 0.561, 20.85),  pos: [-37.136, 16.746, -15.003] },
        { geo: new THREE.BoxGeometry(8.16, 0.561, 21.808),  pos: [-36.891, 17.246, -14.991] },
        { geo: new THREE.BoxGeometry(8.604, 0.462, 22.859),  pos: [-36.67, 17.644, -15.061]  },
        { geo: new THREE.BoxGeometry(8.906, 0.57, 23.619),   pos: [-36.518, 18.16, -15.005]  }
    ];
    repisasMaderaConfig.forEach(({ geo, pos: [x, y, z] }) => {
        const nivel = new THREE.Mesh(geo, maderaMat);
        nivel.position.set(x, y, z);
        chimeneaGroup.add(nivel);
    });

    // ---------------------------------------------------------------
    // 7. ESTRUCTURA SUPERIOR DE LA CHIMENEA (Columnas y Paredes)
    // ---------------------------------------------------------------
    // Pared Central Superior
    const paredCentralSuperiorGeo = new THREE.BoxGeometry(6.311, 19.578, 7.776);
    const paredCentralSuperior = new THREE.Mesh(paredCentralSuperiorGeo, piedraMat);
    paredCentralSuperior.position.set(-38.732, 28.234, -15.1);

    // Columnas Superiores Laterales
    const columnaSuperiorGeo = new THREE.BoxGeometry(7.172, 17.263, 5.361);
    const posColsSup = [
        [-38.302, 29.391, -8.531],  // Columna Izquierda
        [-38.302, 29.42, -21.668]   // Columna Derecha
    ];
    posColsSup.forEach(([x, y, z]) => {
        const col = new THREE.Mesh(columnaSuperiorGeo, piedraMat);
        col.position.set(x, y, z);
        chimeneaGroup.add(col);
    });

    // Escalonados de Piedra para las Columnas Superiores (4 Niveles c/u)
    const escalonesSupConfig = [
        { geo: new THREE.BoxGeometry(7.864, 0.94, 6.048), pos: [[-37.956, 18.915, -8.187], [-37.956, 18.915, -22.012]] },
        { geo: new THREE.BoxGeometry(7.671, 0.458, 5.865), pos: [[-38.052, 19.614, -8.279], [-38.052, 19.614, -21.92]]  },
        { geo: new THREE.BoxGeometry(7.422, 0.458, 5.586), pos: [[-38.176, 20.072, -8.419], [-38.176, 20.072, -21.781]] },
        { geo: new THREE.BoxGeometry(7.29, 0.458, 5.457),  pos: [[-38.243, 20.531, -8.483], [-38.243, 20.531, -21.716]] }
    ];
    escalonesSupConfig.forEach(({ geo, pos }) => {
        pos.forEach(([x, y, z]) => {
            const pieza = new THREE.Mesh(geo, piedraOscuroMat);
            pieza.position.set(x, y, z);
            chimeneaGroup.add(pieza);
        });
    });

    // Cuadrados Exteriores Decorativos para las Columnas Superiores
    const cuadradoExteriorColumnaGeo = new THREE.BoxGeometry(0.173, 15.582, 4.61);
    const posCuadradosExtSup = [
        [-34.629, 29.381, -8.487],  // Izquierdo
        [-34.629, 29.381, -21.698]  // Derecho
    ];
    posCuadradosExtSup.forEach(([x, y, z]) => {
        const deco = new THREE.Mesh(cuadradoExteriorColumnaGeo, piedraOscuroMat);
        deco.position.set(x, y, z);
        chimeneaGroup.add(deco);
    });

    // Madera de Decoración Superior (3 niveles)
    const maderaSuperiNivel1Geo = new THREE.BoxGeometry(8.989, 0.664, 22.873);
    const maderaSuperiNivel1 = new THREE.Mesh(maderaSuperiNivel1Geo, maderaMat);
    maderaSuperiNivel1.position.set(-38.141, 38.355, -15.1);

    const maderaSuperiNivel2Geo = new THREE.BoxGeometry(9.362, 0.866, 19.991);
    const maderaSuperiNivel2 = new THREE.Mesh(maderaSuperiNivel2Geo, maderaMat);
    maderaSuperiNivel2.position.set(-37.954, 39.12, -15.076);

    const maderaSuperiNivel3Geo = new THREE.BoxGeometry(9.046, 0.866, 17.281);
    const maderaSuperiNivel3 = new THREE.Mesh(maderaSuperiNivel3Geo, maderaMat);
    maderaSuperiNivel3.position.set(-37.981, 39.986, -15.081);

    // Paredes de Piedra de Cierre del Fondo
    const paredInferiorGeo = new THREE.BoxGeometry(4.529, 18.245, 23.8);
    const paredInferior = new THREE.Mesh(paredInferiorGeo, piedraOscuroMat);
    paredInferior.position.set(-43.236, 9.323, -14.991);

    const paredSuperiorGeo = new THREE.BoxGeometry(3.613, 21.956, 23.8);
    const paredSuperior = new THREE.Mesh(paredSuperiorGeo, piedraOscuroMat);
    paredSuperior.position.set(-43.694, 29.423, -14.991);

    chimeneaGroup.add(paredCentralSuperior, maderaSuperiNivel1, maderaSuperiNivel2, maderaSuperiNivel3, paredInferior, paredSuperior);

    // ---------------------------------------------------------------
    // 8. LUZ CÁLIDA DEL FUEGO
    // ---------------------------------------------------------------
    const fuegoLuz = new THREE.PointLight(0xff6b1a, 1.5, 4, 2);
    fuegoLuz.position.set(0, 1, 0.6);
    chimeneaGroup.add(fuegoLuz);

    // --esto fue modificado: Recorrido para activar sombras en todas las piezas de la chimenea
    chimeneaGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return chimeneaGroup;
}