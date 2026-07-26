// ===============================================================
// CÓMODA PRINCIPAL
// ===============================================================
import * as THREE from 'three';

export function createComoda() {
    const comodaGroup = new THREE.Group();
    comodaGroup.name = "comodaPrincipal"; 

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // MATERIALES (Madera PBR + Manijas de Bronce)
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
        normalScale: new THREE.Vector2(1.0, 1.0), // relieve marcado para madera rústica
        roughnessMap: maderaRough,
        color: 0x2E2418, 
        roughness: 1,
    });

    const manijaMat = new THREE.MeshStandardMaterial({
        color: 0x7A6248, // Bronce oscuro
        metalness: 0.95, // --esto fue modificado: subido a 0.95 para que se comporte como metal conductor real
        roughness: 0.2,  // --esto fue modificado: bajado a 0.2 para que refleje el brillo de la habitación de forma pulida
    });

    // ---------------------------------------------------------------
    // ESTRUCTURA BASE (Tapa, Base, Tablas laterales y Caja interior)
    // ---------------------------------------------------------------
    // Tapa Superior
    const tapaSuperiorGeo = new THREE.BoxGeometry(6.58, 0.8, 20.5);
    const tapaSuperior = new THREE.Mesh(tapaSuperiorGeo, maderaMat);
    tapaSuperior.position.set(-41.397, 14.164, 12.029);

    // Base Inferior
    const baseInferiorGeo = new THREE.BoxGeometry(6.5, 1, 20);
    const baseInferior = new THREE.Mesh(baseInferiorGeo, maderaMat);
    baseInferior.position.set(-41.357, 1, 12.029);

    // Tablas Laterales (Izquierda y Derecha)
    const tablaLateralGeo = new THREE.BoxGeometry(5.18, 12.264, 0.156);
    const posicionesLaterales = [
        [-41.397, 7.632, 21.857], // Lateral Izquierdo
        [-41.397, 7.632, 2.201]   // Lateral Derecho
    ];
    posicionesLaterales.forEach(([x, y, z]) => {
        const tabla = new THREE.Mesh(tablaLateralGeo, maderaMat);
        tabla.position.set(x, y, z);
        comodaGroup.add(tabla);
    });

    // Caja Interior del Mueble
    const cajaGeo = new THREE.BoxGeometry(6.014, 10.664, 17);
    const caja = new THREE.Mesh(cajaGeo, maderaMat);
    caja.position.set(-41.49, 7.632, 12.029);

    comodaGroup.add(tapaSuperior, baseInferior, caja);

    // ---------------------------------------------------------------
    // PATAS DE LA CÓMODA (4 esquinas)
    // Reutilizamos la misma geometría para las 4 patas
    // ---------------------------------------------------------------
    const patasGeo = new THREE.BoxGeometry(0.7, 14.264, 0.7);
    const posicionesPatas = [
        [-44.337, 6.632, 21.679], // Trasera Izquierda
        [-44.337, 6.632, 2.379],  // Trasera Derecha
        [-38.457, 6.632, 21.679], // Delantera Izquierda
        [-38.457, 6.632, 2.379]   // Delantera Derecha
    ];
    posicionesPatas.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(patasGeo, maderaMat);
        pata.position.set(x, y, z);
        comodaGroup.add(pata);
    });

    // ---------------------------------------------------------------
    // MARCOS DE BORDES Y PALOS EXTREMOS
    // ---------------------------------------------------------------
    // Marcos Horizontales de la Estructura (Superior e Inferior)
    const marcoHorizGeo = new THREE.BoxGeometry(6.2, 0.8, 19.5);
    const posicionesMarcoHoriz = [
        [-41.397, 13.364, 12.029], // Marco Superior
        [-41.397, 1.9, 12.029]     // Marco Inferior
    ];
    posicionesMarcoHoriz.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoHorizGeo, maderaMat);
        marco.position.set(x, y, z);
        comodaGroup.add(marco);
    });

    // Marcos Verticales de la Estructura (Izquierdo y Derecho)
    const marcoVetiGeo = new THREE.BoxGeometry(6.2, 10.664, 0.8);
    const posicionesMarcoVerti = [
        [-41.397, 7.632, 20.929], // Marco Vertical Izquierdo
        [-41.397, 7.632, 3.129]   // Marco Vertical Derecho
    ];
    posicionesMarcoVerti.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoVetiGeo, maderaMat);
        marco.position.set(x, y, z);
        comodaGroup.add(marco);
    });

    // Palos Extremos Horizontales (Superior e Inferior)
    const paloGeo = new THREE.BoxGeometry(0.296, 0.2, 17);
    const posicionesPalos = [
        [-38.335, 12.964, 12.029], // Palo Superior
        [-38.335, 2.3, 12.029]     // Palo Inferior
    ];
    posicionesPalos.forEach(([x, y, z]) => {
        const palo = new THREE.Mesh(paloGeo, maderaMat);
        palo.position.set(x, y, z);
        comodaGroup.add(palo);
    });

    // ---------------------------------------------------------------
    // CAJONES (6 Cajones ordenados de Izquierda a Derecha / Arriba a Abajo)
    // ---------------------------------------------------------------
    const cajonesGeo = new THREE.BoxGeometry(0.296, 2.8, 7.65);
    const posicionesCajones = [
        [-38.307, 11, 16.254],  // Cajón 1: Superior Izquierdo
        [-38.307, 7.6, 16.254], // Cajón 2: Medio Izquierdo
        [-38.307, 4.2, 16.254], // Cajón 3: Inferior Izquierdo
        [-38.307, 11, 7.804],   // Cajón 4: Superior Derecho
        [-38.307, 7.6, 7.804],  // Cajón 5: Medio Derecho
        [-38.307, 4.2, 7.804]   // Cajón 6: Inferior Derecho
    ];
    posicionesCajones.forEach(([x, y, z]) => {
        const cajon = new THREE.Mesh(cajonesGeo, maderaMat);
        cajon.position.set(x, y, z);
        comodaGroup.add(cajon);
    });

    // ---------------------------------------------------------------
    // DETALLES DE MARCOS DE CAJONES
    // ---------------------------------------------------------------
    // Marcos Horizontales de Cajones (12 marcos)
    const marcoHorizCajonGeo = new THREE.BoxGeometry(0.3, 0.2, 8.25);
    const posMarcoHorizCajon = [
        [-38.309, 12.5, 16.254], [-38.309, 9.5, 16.254], [-38.309, 9.1, 16.254],
        [-38.309, 6.1, 16.254],  [-38.309, 5.7, 16.254], [-38.309, 2.7, 16.254],
        [-38.309, 12.5, 7.804],  [-38.309, 9.5, 7.804],  [-38.309, 9.1, 7.804],
        [-38.309, 6.1, 7.804],   [-38.309, 5.7, 7.804],  [-38.309, 2.7, 7.804]
    ];
    posMarcoHorizCajon.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoHorizCajonGeo, maderaMat);
        marco.position.set(x, y, z);
        comodaGroup.add(marco);
    });

    // Marcos Verticales de Cajones (12 marcos)
    const marcoVertiCajonGeo = new THREE.BoxGeometry(0.3, 2.8, 0.3);
    const posMarcoVertiCajon = [
        [-38.309, 11, 20.229],  [-38.309, 11, 12.279],
        [-38.309, 7.6, 20.229], [-38.309, 7.6, 12.279],
        [-38.309, 4.2, 20.229], [-38.309, 4.2, 12.279],
        [-38.309, 11, 11.779],  [-38.309, 11, 3.829],
        [-38.309, 7.6, 11.779],  [-38.309, 7.6, 3.829],
        [-38.309, 4.2, 11.779],  [-38.309, 4.2, 3.829]
    ];
    posMarcoVertiCajon.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoVertiCajonGeo, maderaMat);
        marco.position.set(x, y, z);
        comodaGroup.add(marco);
    });

    // ---------------------------------------------------------------
    // MANIJAS DE CAJONES (6 manijas en total)
    // ---------------------------------------------------------------
    const manijaGeo = new THREE.CylinderGeometry(0.1405, 0.1405, 1.871, 16);
    const posicionesManijas = [
        [-38.159, 11, 16.254],    // Manija Cajón 1
        [-38.159, 7.563, 16.254], // Manija Cajón 2
        [-38.159, 4.131, 16.254], // Manija Cajón 3
        [-38.159, 11, 7.561],     // Manija Cajón 4
        [-38.159, 7.563, 7.561],  // Manija Cajón 5
        [-38.159, 4.131, 7.561]   // Manija Cajón 6
    ];
    posicionesManijas.forEach(([x, y, z]) => {
        const manija = new THREE.Mesh(manijaGeo, manijaMat);
        manija.rotation.x = Math.PI / 2; // Orientación horizontal
        manija.position.set(x, y, z);
        comodaGroup.add(manija);
    });

    // Recorrido para que todo el mueble y sus piezas proyecten y reciban sombras
    comodaGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return comodaGroup;
}