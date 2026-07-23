import * as THREE from 'three';

export function createMesaCentro() {
    const mesaCentroGroup = new THREE.Group();
    mesaCentroGroup.name = "MesaDeCentro";

    const textureLoader = new THREE.TextureLoader();

    // =======================================================
    // 1. MATERIAL DE MADERA (PBR)
    // =======================================================
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
        roughnessMap: maderaRough,
        color: 0x3D2C1E, // Tinte oscuro para que haga contraste con el vidrio
        roughness: 0.6,
    });

    // =======================================================
    // 2. MATERIAL DE VIDRIO (Realista)
    // =======================================================
    const vidrioMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9, // Hace que el vidrio refracte la luz (cristal real)
        transparent: true,
        opacity: 1, // Se deja en 1 porque 'transmission' hace el trabajo de transparencia
        thickness: 0.5, // Grosor virtual para la refracción de la luz
    });

    // =======================================================
    // 3. ESTRUCTURA DE MADERA
    // =======================================================

    // --- PATAS (4 en total) ---
    const pataGeo = new THREE.BoxGeometry(1.936, 5.163, 1.936); // <- AJUSTAR (Más bajas que una mesa normal)

    const pataFI = new THREE.Mesh(pataGeo, maderaMat); // Frontal Izquierda
    pataFI.position.set(19.575, 2.082, -20.517); // <- AJUSTAR
    mesaCentroGroup.add(pataFI);

    const pataFD = new THREE.Mesh(pataGeo, maderaMat); // Frontal Derecha
    pataFD.position.set(8.603, 2.082, -20.517); // <- AJUSTAR
    mesaCentroGroup.add(pataFD);

    const pataTI = new THREE.Mesh(pataGeo, maderaMat); // Trasera Izquierda
    pataTI.position.set(19.575, 2.082, -9.545); // <- AJUSTAR
    mesaCentroGroup.add(pataTI);

    const pataTD = new THREE.Mesh(pataGeo, maderaMat); // Trasera Derecha
    pataTD.position.set(8.603, 2.082, -9.545); // <- AJUSTAR
    mesaCentroGroup.add(pataTD);

    // --- MARCO INFERIOR
    // Son 4 palos que conectan las patas por arriba formando un rectángulo hueco
    const marcoLargoGeo = new THREE.BoxGeometry(1.291, 1.291, 9.036); // sentido del sofa
    const marcoCortoGeo = new THREE.BoxGeometry(9.036, 1.291, 1.367); // 

    const marcoIFrente = new THREE.Mesh(marcoCortoGeo, maderaMat);
    marcoIFrente.position.set(14.089, 1.78, -20.585); // <- AJUSTAR
    mesaCentroGroup.add(marcoIFrente);

    const marcoIAtras = new THREE.Mesh(marcoCortoGeo, maderaMat);
    marcoIAtras.position.set(14.089, 1.78, -9.463); // <- AJUSTAR
    mesaCentroGroup.add(marcoIAtras);

    const marcoIIzq = new THREE.Mesh(marcoLargoGeo, maderaMat);
    marcoIIzq.position.set(19.695, 1.78, -15.031); // <- AJUSTAR
    mesaCentroGroup.add(marcoIIzq);

    const marcoIDer = new THREE.Mesh(marcoLargoGeo, maderaMat);
    marcoIDer.position.set(8.59, 1.78, -15.031); // <- AJUSTAR
    mesaCentroGroup.add(marcoIDer);

    // --- MARCO SUPERIOR
    const marcoSLargoGeo = new THREE.BoxGeometry(0.645, 1.291, 12.908); // <- AJUSTAR
    const marcoSAnchoGeo = new THREE.BoxGeometry(14.199, 1.291, 0.645); // <- AJUSTAR

    const marcoSFrente = new THREE.Mesh(marcoSAnchoGeo, maderaMat);
    marcoSFrente.position.set(14.089, 5.115, -21.808); // <- AJUSTAR
    mesaCentroGroup.add(marcoSFrente);

    const marcoSAtras = new THREE.Mesh(marcoSAnchoGeo, maderaMat);
    marcoSAtras.position.set(14.089, 5.115, -8.254); // <- AJUSTAR
    mesaCentroGroup.add(marcoSAtras);

    const marcoSIzq = new THREE.Mesh(marcoSLargoGeo, maderaMat);
    marcoSIzq.position.set(20.866, 5.115, -15.031); // <- AJUSTAR
    mesaCentroGroup.add(marcoSIzq);

    const marcoSDer = new THREE.Mesh(marcoSLargoGeo, maderaMat);
    marcoSDer.position.set(7.312, 5.115, -15.031); // <- AJUSTAR
    mesaCentroGroup.add(marcoSDer);


    // =======================================================
    // 4. EL VIDRIO SUPERIOR
    // =======================================================
    // El vidrio va encajado dentro o justo sobre el marco superior
    const vidrioGeo = new THREE.BoxGeometry(12.908, 0.3, 12.908); // <- AJUSTAR
    const vidrio = new THREE.Mesh(vidrioGeo, vidrioMat);
    
    // Lo posicionamos un poquito más arriba que el centro del marco o al ras
    vidrio.position.set(14.089, 5.611, -15.031); // <- AJUSTAR
    
    // IMPORTANTE: Para que la luz y las sombras de la casa interactúen bien con el vidrio
    vidrio.castShadow = false; // El vidrio no suele proyectar sombra sólida
    vidrio.receiveShadow = true;

    mesaCentroGroup.add(vidrio);

    return mesaCentroGroup;
}