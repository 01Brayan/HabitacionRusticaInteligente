import * as THREE from 'three';

export function createWallWindowStatic() {
    const wallGroup = new THREE.Group();
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
        tex.repeat.set(0.5, 1);
    });

    // ---------------------------------------------------------------
    // 2. MARCOS (externo e interno) -> rough_wood
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
        map: paredDiffuse,
        normalMap: paredNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: paredRough,
        aoMap: paredAO,
        color: 0x5C4530, // tono de pared definido
        roughness: 1.0,
    });

    // Marco EXTERNO (el que rodea toda la ventana contra la pared)
    const marcoMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x4A3220, // marco externo
        roughness: 1.0,
    });

    // Marco INTERNO / travesaños (las líneas finas que dividen los vidrios) -> más oscuro
    const marcoInternoMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718, // travesaños internos, el más oscuro de los 2
        roughness: 1.0,
    });

    // Vidrio real (material físico)
    const vidrioMat = new THREE.MeshPhysicalMaterial({
        color: 0xBFD9E8,
        transmission: 0.95,
        roughness: 0.05,
        thickness: 0.3,
        ior: 1.5,
        metalness: 0,
    });

    // ========================================================
    // 🧱 PARTE 1: LAS PAREDES (tablones)
    // ========================================================
    const GeoInferior = new THREE.BoxGeometry(3, 15.308, 22);
    GeoInferior.setAttribute('uv2', new THREE.BufferAttribute(GeoInferior.attributes.uv.array, 2));
    const meshInferior = new THREE.Mesh(GeoInferior, wallMat);
    meshInferior.position.set(45.495, 7.154, -14.979);
    wallGroup.add(meshInferior);

    const GeoSuperior = new THREE.BoxGeometry(3, 4.796, 22);
    GeoSuperior.setAttribute('uv2', new THREE.BufferAttribute(GeoSuperior.attributes.uv.array, 2));
    const meshSuperior = new THREE.Mesh(GeoSuperior, wallMat);
    meshSuperior.position.set(45.495, 30.102, -14.979);
    wallGroup.add(meshSuperior);

    const GeoIzquierdo = new THREE.BoxGeometry(3, 12.896, 1.355);
    GeoIzquierdo.setAttribute('uv2', new THREE.BufferAttribute(GeoIzquierdo.attributes.uv.array, 2));
    const meshIzquierdo = new THREE.Mesh(GeoIzquierdo, wallMat);
    meshIzquierdo.position.set(45.505, 21.256, -25.301);
    wallGroup.add(meshIzquierdo);

    const GeoDerecho = new THREE.BoxGeometry(3, 12.896, 1.355);
    GeoDerecho.setAttribute('uv2', new THREE.BufferAttribute(GeoDerecho.attributes.uv.array, 2));
    const meshDerecho = new THREE.Mesh(GeoDerecho, wallMat);
    meshDerecho.position.set(45.505, 21.256, -4.656);
    wallGroup.add(meshDerecho);

    // ========================================================
    // 🪟 PARTE 2: VENTANA FIJA
    // ========================================================

    // 1. EL VIDRIO
    const vidrio = new THREE.Mesh(new THREE.BoxGeometry(0.5, 8.865, 15.718), vidrioMat);
    vidrio.position.set(45.548, 21.252, -14.963);
    wallGroup.add(vidrio);

    // 2. MARCO EXTERNO
    const geoMarcoSuperior = new THREE.BoxGeometry(3, 1.5, 17.086);
    geoMarcoSuperior.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoSuperior.attributes.uv.array, 2));
    const marcoSuperior = new THREE.Mesh(geoMarcoSuperior, marcoMat);
    marcoSuperior.position.set(45.505, 26.954, -14.979);
    wallGroup.add(marcoSuperior);

    const geoMarcoInferior = new THREE.BoxGeometry(3, 1.5, 17);
    geoMarcoInferior.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoInferior.attributes.uv.array, 2));
    const marcoInferior = new THREE.Mesh(geoMarcoInferior, marcoMat);
    marcoInferior.position.set(45.505, 15.558, -14.979);
    wallGroup.add(marcoInferior);

    const geoMarcoIzquierdo = new THREE.BoxGeometry(3, 12.896, 1.145);
    geoMarcoIzquierdo.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoIzquierdo.attributes.uv.array, 2));
    const marcoIzquierdo = new THREE.Mesh(geoMarcoIzquierdo, marcoMat);
    marcoIzquierdo.position.set(45.495, 21.256, -24.051);
    wallGroup.add(marcoIzquierdo);

    const geoMarcoDerecho = new THREE.BoxGeometry(3, 12.896, 1.145);
    geoMarcoDerecho.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoDerecho.attributes.uv.array, 2));
    const marcoDerecho = new THREE.Mesh(geoMarcoDerecho, marcoMat);
    marcoDerecho.position.set(45.505, 21.256, -5.906);
    wallGroup.add(marcoDerecho);

    // 3. MARCO INTERNO / TRAVESAÑOS (más oscuro que el externo)
    const geoMarcoInternoSuperior = new THREE.BoxGeometry(1.5, 0.52, 17.017);
    geoMarcoInternoSuperior.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoInternoSuperior.attributes.uv.array, 2));
    const marcoInternoSuperior = new THREE.Mesh(geoMarcoInternoSuperior, marcoInternoMat);
    marcoInternoSuperior.position.set(45.548, 25.944, -15.013);
    wallGroup.add(marcoInternoSuperior);

    const geoMarcoInternoInferior = new THREE.BoxGeometry(1.5, 0.52, 18.208);
    geoMarcoInternoInferior.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoInternoInferior.attributes.uv.array, 2));
    const marcoInternoInferior = new THREE.Mesh(geoMarcoInternoInferior, marcoInternoMat);
    marcoInternoInferior.position.set(45.548, 16.568, -15.508);
    wallGroup.add(marcoInternoInferior);

    const geoMarcoInternoIzquierdo = new THREE.BoxGeometry(1.5, 8.865, 0.7);
    geoMarcoInternoIzquierdo.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoInternoIzquierdo.attributes.uv.array, 2));
    const marcoInternoIzquierdo = new THREE.Mesh(geoMarcoInternoIzquierdo, marcoInternoMat);
    marcoInternoIzquierdo.position.set(45.536, 21.252, -23.172);
    wallGroup.add(marcoInternoIzquierdo);

    const geoMarcoInternoDerecho = new THREE.BoxGeometry(1.5, 8.856, 0.7);
    geoMarcoInternoDerecho.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoInternoDerecho.attributes.uv.array, 2));
    const marcoInternoDerecho = new THREE.Mesh(geoMarcoInternoDerecho, marcoInternoMat);
    marcoInternoDerecho.position.set(45.548, 21.256, -6.754);
    wallGroup.add(marcoInternoDerecho);

    const geoMarcoHorizontalMedio = new THREE.BoxGeometry(1.5, 0.52, 17.118);
    geoMarcoHorizontalMedio.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoHorizontalMedio.attributes.uv.array, 2));
    const marcohorizontalmedio = new THREE.Mesh(geoMarcoHorizontalMedio, marcoInternoMat);
    marcohorizontalmedio.position.set(45.548, 21.414, -14.963);
    wallGroup.add(marcohorizontalmedio);

    const geoMarcoMediVertIzqui = new THREE.BoxGeometry(1.5, 8.856, 0.7);
    geoMarcoMediVertIzqui.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoMediVertIzqui.attributes.uv.array, 2));
    const marcoMediVertIzqui = new THREE.Mesh(geoMarcoMediVertIzqui, marcoInternoMat);
    marcoMediVertIzqui.position.set(45.548, 21.256, -17.822);
    wallGroup.add(marcoMediVertIzqui);

    const geoMarcoMediVertDerecho = new THREE.BoxGeometry(1.5, 8.865, 0.7);
    geoMarcoMediVertDerecho.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoMediVertDerecho.attributes.uv.array, 2));
    const marcoMediVertDerecho = new THREE.Mesh(geoMarcoMediVertDerecho, marcoInternoMat);
    marcoMediVertDerecho.position.set(45.536, 21.252, -12.454);
    wallGroup.add(marcoMediVertDerecho);

    return wallGroup;
}