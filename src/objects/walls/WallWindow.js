import * as THREE from 'three';

export function createWallWindow() {
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
        tex.repeat.set(0.5, 1); // corregido, antes (1,5) daba rayitas finas
    });

    // ---------------------------------------------------------------
    // 2. MADERA DE MARCOS -> rough_wood
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
        color: 0x5C4530,
        roughness: 1.0,
    });

    // Marco EXTERIOR (el que va contra la pared, fijo)
    const marcoMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x4A3220,
        roughness: 1.0,
    });

    // Marco de la HOJA MÓVIL + cruz central (más oscuro, como los travesaños internos)
    const marcoHojaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.4, 0.4),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718,
        roughness: 1.0,
    });

    // Vidrio real
    const vidrioMat = new THREE.MeshPhysicalMaterial({
        color: 0xBFD9E8,
        transmission: 0.95,
        roughness: 0.05,
        thickness: 0.3,
        ior: 1.5,
        metalness: 0,
    });

    // 1. LA PARTE ESTÁTICA (No se mueve)
    // ==========================================

    const GeoInferior = new THREE.BoxGeometry(3, 15.308, 22);
    GeoInferior.setAttribute('uv2', new THREE.BufferAttribute(GeoInferior.attributes.uv.array, 2));
    const meshInferior = new THREE.Mesh(GeoInferior, wallMat);
    meshInferior.position.set(-46.187, 7.154, -42.031);
    wallGroup.add(meshInferior);

    const GeoSuperior = new THREE.BoxGeometry(3, 4.448, 22);
    GeoSuperior.setAttribute('uv2', new THREE.BufferAttribute(GeoSuperior.attributes.uv.array, 2));
    const meshSuperior = new THREE.Mesh(GeoSuperior, wallMat);
    meshSuperior.position.set(-46.187, 30.276, -42.031);
    wallGroup.add(meshSuperior);

    const GeoIzquierdo = new THREE.BoxGeometry(3, 13.243, 1.433);
    GeoIzquierdo.setAttribute('uv2', new THREE.BufferAttribute(GeoIzquierdo.attributes.uv.array, 2));
    const meshIzquierdo = new THREE.Mesh(GeoIzquierdo, wallMat);
    meshIzquierdo.position.set(-46.177, 21.43, -31.747);
    wallGroup.add(meshIzquierdo);

    const GeoDerecho = new THREE.BoxGeometry(3.003, 13.243, 1.276);
    GeoDerecho.setAttribute('uv2', new THREE.BufferAttribute(GeoDerecho.attributes.uv.array, 2));
    const meshDerecho = new THREE.Mesh(GeoDerecho, wallMat);
    meshDerecho.position.set(-46.186, 21.43, -52.392);
    wallGroup.add(meshDerecho);

    // MARCO DE VENTANA (exterior, fijo)
    const geoMarcoExtIzq = new THREE.BoxGeometry(3, 13.243, 1.172);
    geoMarcoExtIzq.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoExtIzq.attributes.uv.array, 2));
    const marcoExtIzq = new THREE.Mesh(geoMarcoExtIzq, marcoMat);
    marcoExtIzq.position.set(-46.177, 21.43, -33.05);
    wallGroup.add(marcoExtIzq);

    const geoMarcoExtDer = new THREE.BoxGeometry(3, 13.243, 1.171);
    geoMarcoExtDer.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoExtDer.attributes.uv.array, 2));
    const marcoExtDer = new THREE.Mesh(geoMarcoExtDer, marcoMat);
    marcoExtDer.position.set(-46.187, 21.43, -51.169);
    wallGroup.add(marcoExtDer);

    const geoMarcoExtInf = new THREE.BoxGeometry(3, 1.5, 17);
    geoMarcoExtInf.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoExtInf.attributes.uv.array, 2));
    const marcoExtInf = new THREE.Mesh(geoMarcoExtInf, marcoMat);
    marcoExtInf.position.set(-46.177, 15.558, -42.109);
    wallGroup.add(marcoExtInf);

    const geoMarcoExtSup = new THREE.BoxGeometry(3, 1.5, 17.118);
    geoMarcoExtSup.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoExtSup.attributes.uv.array, 2));
    const marcoExtSup = new THREE.Mesh(geoMarcoExtSup, marcoMat);
    marcoExtSup.position.set(-46.177, 27.302, -42.093);
    wallGroup.add(marcoExtSup);

    // 2. LA HOJA MÓVIL IZQUIERDA (Ventana que se abre)
    // =============================================
    const hojaIzqGroup = new THREE.Group();
    hojaIzqGroup.name = "ventanaIzquierda";
    hojaIzqGroup.position.set(-45.384, 21.43, -33.637);

    const vidrioIzq = new THREE.Mesh(new THREE.BoxGeometry(0.5, 9.288, 7.5), vidrioMat);
    vidrioIzq.position.set(-0.75, 0.042, -4.348);
    hojaIzqGroup.add(vidrioIzq);

    const geoMarcoSupIzq = new THREE.BoxGeometry(1.5, 0.535, 8.559);
    geoMarcoSupIzq.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoSupIzq.attributes.uv.array, 2));
    const marcoSupIzq = new THREE.Mesh(geoMarcoSupIzq, marcoHojaMat);
    marcoSupIzq.position.set(-0.75, 4.854, -4.177);
    hojaIzqGroup.add(marcoSupIzq);

    const geoMarcoInfIzq = new THREE.BoxGeometry(1.5, 0.52, 8.559);
    geoMarcoInfIzq.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoInfIzq.attributes.uv.array, 2));
    const marcoInfIzq = new THREE.Mesh(geoMarcoInfIzq, marcoHojaMat);
    marcoInfIzq.position.set(-0.75, -4.862, -4.177);
    hojaIzqGroup.add(marcoInfIzq);

    const geoMarcoLatIzq = new THREE.BoxGeometry(1.5, 9.203, 0.599);
    geoMarcoLatIzq.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoLatIzq.attributes.uv.array, 2));
    const marcoLatIzq = new THREE.Mesh(geoMarcoLatIzq, marcoHojaMat);
    marcoLatIzq.position.set(-0.75, 0, -0.298);
    hojaIzqGroup.add(marcoLatIzq);

    const geoMarcoLatDer = new THREE.BoxGeometry(1.5, 9.188, 0.7);
    geoMarcoLatDer.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoLatDer.attributes.uv.array, 2));
    const marcoLatDer = new THREE.Mesh(geoMarcoLatDer, marcoHojaMat);
    marcoLatDer.position.set(-0.762, -0.008, -8.106);
    hojaIzqGroup.add(marcoLatDer);

    const geoCruzIzq = new THREE.BoxGeometry(1.5, 0.52, 7.159);
    geoCruzIzq.setAttribute('uv2', new THREE.BufferAttribute(geoCruzIzq.attributes.uv.array, 2));
    const cruzIzq = new THREE.Mesh(geoCruzIzq, marcoHojaMat);
    cruzIzq.position.set(-0.762, 0.258, -4.177);
    hojaIzqGroup.add(cruzIzq);

    wallGroup.add(hojaIzqGroup);

    // ==========================================
    // 3. LA HOJA MÓVIL DERECHA (Ventana que se abre)
    // ==========================================
    const hojaDerGroup = new THREE.Group();
    hojaDerGroup.name = "ventanaDerecha";
    hojaDerGroup.position.set(-45.384, 21.43, -50.584);

    const vidrioDer = new THREE.Mesh(new THREE.BoxGeometry(0.5, 9.288, 7.5), vidrioMat);
    vidrioDer.position.set(-0.75, 0.042, 4.386);
    hojaDerGroup.add(vidrioDer);

    const geoMarcoSupDer = new THREE.BoxGeometry(1.618, 0.52, 8.559);
    geoMarcoSupDer.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoSupDer.attributes.uv.array, 2));
    const marcoSupDer = new THREE.Mesh(geoMarcoSupDer, marcoHojaMat);
    marcoSupDer.position.set(-0.691, 4.862, 4.211);
    hojaDerGroup.add(marcoSupDer);

    const geoMarcoInfDer = new THREE.BoxGeometry(1.5, 0.52, 8.559);
    geoMarcoInfDer.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoInfDer.attributes.uv.array, 2));
    const marcoInfDer = new THREE.Mesh(geoMarcoInfDer, marcoHojaMat);
    marcoInfDer.position.set(-0.75, -4.862, 4.211);
    hojaDerGroup.add(marcoInfDer);

    const geoMarcoLatIzqDer = new THREE.BoxGeometry(1.5, 9.203, 0.7);
    geoMarcoLatIzqDer.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoLatIzqDer.attributes.uv.array, 2));
    const marcoLatIzqDer = new THREE.Mesh(geoMarcoLatIzqDer, marcoHojaMat);
    marcoLatIzqDer.position.set(-0.75, 0, 8.141);
    hojaDerGroup.add(marcoLatIzqDer);

    const geoMarcoLatDerDer = new THREE.BoxGeometry(1.5, 9.188, 0.7);
    geoMarcoLatDerDer.setAttribute('uv2', new THREE.BufferAttribute(geoMarcoLatDerDer.attributes.uv.array, 2));
    const marcoLatDerDer = new THREE.Mesh(geoMarcoLatDerDer, marcoHojaMat);
    marcoLatDerDer.position.set(-0.762, -0.008, 0.282);
    hojaDerGroup.add(marcoLatDerDer);

    const geoCruzDer = new THREE.BoxGeometry(1.5, 0.52, 7.159);
    geoCruzDer.setAttribute('uv2', new THREE.BufferAttribute(geoCruzDer.attributes.uv.array, 2));
    const cruzDer = new THREE.Mesh(geoCruzDer, marcoHojaMat);
    cruzDer.position.set(-0.762, 0.258, 4.211);
    hojaDerGroup.add(cruzDer);

    wallGroup.add(hojaDerGroup);

    return wallGroup;
}