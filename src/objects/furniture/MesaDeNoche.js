import * as THREE from 'three';

export function createMesaDeNoche() {
    const mesaGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // TEXTURA DE MADERA (wood_dark_001)
    // ---------------------------------------------------------------
    const maderaDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
    });

    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.3, 0.3),
        roughnessMap: maderaRough,
        color: 0x3D2C1E,
        roughness: 0.55,
    });

    // Metal de las manijas (cilindros rotados)
    const manijaMat = new THREE.MeshStandardMaterial({
        color: 0xB8B8B0,
        metalness: 0.85,
        roughness: 0.35,
    });


    // --- TAPA 
    const tapaGeo = new THREE.BoxGeometry(9, 0.8, 6); 
    const tapa = new THREE.Mesh(tapaGeo, maderaMat);
    tapa.position.set(16.891, 8.848, 51.969); 
    mesaGroup.add(tapa);

    // --- CUERPO PRINCIPAL ---
    const cuerpoGeo = new THREE.BoxGeometry(8.484, 7.431, 5.357); // <- AJUSTAR
    const cuerpo = new THREE.Mesh(cuerpoGeo, maderaMat);
    cuerpo.position.set(16.89, 4.732, 52.048); // <- AJUSTAR
    mesaGroup.add(cuerpo);

    // --- MARCO DEL CAJÓN SUPERIOR (el relieve alrededor) ---
    const marcoSupGeo = new THREE.BoxGeometry(6.8, 2.8, 0.3); // <- AJUSTAR
    const marcoSup = new THREE.Mesh(marcoSupGeo, maderaMat);
    marcoSup.position.set(16.715, 6.81, 49.119); // <- AJUSTAR
    mesaGroup.add(marcoSup);

    // --- MARCO DEL CAJÓN INFERIOR ---
    const marcoInfGeo = new THREE.BoxGeometry(6.8, 2.8, 0.3); // <- AJUSTAR
    const marcoInf = new THREE.Mesh(marcoInfGeo, maderaMat);
    marcoInf.position.set(16.754, 3.84, 49.119); // <- AJUSTAR
    mesaGroup.add(marcoInf);

    // --- MANIJA SUPERIOR (cilindro rotado) ---
    const manijaSupGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 12); // radio, radio, largo, segmentos <- AJUSTAR
    const manijaSup = new THREE.Mesh(manijaSupGeo, manijaMat);
    manijaSup.rotation.z = Math.PI / 2;
    manijaSup.position.set(16.715, 6.81, 48.969); // <- AJUSTAR
    mesaGroup.add(manijaSup);

    // --- MANIJA INFERIOR (cilindro rotado) ---
    const manijaInfGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 12); // <- AJUSTAR
    const manijaInf = new THREE.Mesh(manijaInfGeo, manijaMat);
    manijaInf.rotation.z = Math.PI / 2;
    manijaInf.position.set(16.715, 3.854, 48.969); // <- AJUSTAR
    mesaGroup.add(manijaInf);

    // --- ZÓCALO (la "falda" entre el cajón inferior y las patas) ---
    const zocaloGeo = new THREE.BoxGeometry(8.617, 1.2, 5.524); // <- AJUSTAR
    const zocalo = new THREE.Mesh(zocaloGeo, maderaMat);
    zocalo.position.set(16.865, 1.616, 51.957); // <- AJUSTAR
    mesaGroup.add(zocalo);

    // --- PATAS (4 en total) ---
    const pataGeo = new THREE.BoxGeometry(0.6, 9, 0.6); // <- AJUSTAR

    const pataFrontalIzq = new THREE.Mesh(pataGeo, maderaMat);
    pataFrontalIzq.position.set(20.995, 4, 49.519); // <- AJUSTAR
    mesaGroup.add(pataFrontalIzq);

    const pataFrontalDer = new THREE.Mesh(pataGeo, maderaMat);
    pataFrontalDer.position.set(12.691, 4, 49.519); // <- AJUSTAR
    mesaGroup.add(pataFrontalDer);

    const pataTraseraIzq = new THREE.Mesh(pataGeo, maderaMat);
    pataTraseraIzq.position.set(20.995, 4, 54.669); // <- AJUSTAR
    mesaGroup.add(pataTraseraIzq);

    const pataTraseraDer = new THREE.Mesh(pataGeo, maderaMat);
    pataTraseraDer.position.set(12.691, 4, 54.669); // <- AJUSTAR
    mesaGroup.add(pataTraseraDer);

    return mesaGroup; // ¡MUY IMPORTANTE RETORNARLO!
}