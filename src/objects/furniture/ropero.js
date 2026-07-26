// ===============================================================
// ROPERO DE MADERA
// ===============================================================
import * as THREE from 'three';

export function createRopero() {
    const roperoGroup = new THREE.Group();
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
        tex.repeat.set(1, 2); // Repetición vertical para mueble alto
    });

    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.55, 0.55), // --esto fue modificado: agregado normalScale para el relieve del ropero
        roughnessMap: maderaRough,
        color: 0x2E2418,
        roughness: 0.6,
    });

    const manijaMat = new THREE.MeshStandardMaterial({
        color: 0x7A6248, // Bronce oscuro
        metalness: 0.95, // --esto fue modificado: aumentado a 0.95 para metal real
        roughness: 0.2,  // --esto fue modificado: disminuido a 0.2 para reflejo brillante pulido
    });

    // ---------------------------------------------------------------
    // TAPAS Y ESTRUCTURA DEL MUEBLE
    // ---------------------------------------------------------------
    // Tapa Superior
    const tapaGeoSup = new THREE.BoxGeometry(7.2, 1.511, 19.2);
    const tapaSuperior = new THREE.Mesh(tapaGeoSup, maderaMat);
    tapaSuperior.position.set(-41.102, 26.745, 39.124);

    // Tapa Inferior
    const tapaGeoInf = new THREE.BoxGeometry(7.2, 1.3, 17.759);
    const tapaInferior = new THREE.Mesh(tapaGeoInf, maderaMat);
    tapaInferior.position.set(-41.102, 1.255, 39.73);

    // Tapa Trasera (Respaldo)
    const tapaGeoTrasera = new THREE.BoxGeometry(0.744, 24.084, 14.4);
    const tapaTrasera = new THREE.Mesh(tapaGeoTrasera, maderaMat);
    tapaTrasera.position.set(-44.33, 13.947, 39.124);

    // Tapas Laterales (Izquierda y Derecha)
    const posLaterales = [
        { geo: new THREE.BoxGeometry(2.4, 25.301, 0.502), pos: [-41.102, 13.338, 48.473] }, // Tapa Izquierda
        { geo: new THREE.BoxGeometry(2.4, 25.689, 0.502), pos: [-41.102, 13.532, 29.775] }  // Tapa Derecha
    ];
    posLaterales.forEach(({ geo, pos: [x, y, z] }) => {
        const tapa = new THREE.Mesh(geo, maderaMat);
        tapa.position.set(x, y, z);
        roperoGroup.add(tapa);
    });

    // Puerta Principal
    const puertaGeo = new THREE.BoxGeometry(0.358, 24.084, 12);
    const puerta = new THREE.Mesh(puertaGeo, maderaMat);
    puerta.position.set(-38.215, 13.947, 39.124);

    roperoGroup.add(tapaSuperior, tapaInferior, tapaTrasera, puerta);

    // ---------------------------------------------------------------
    // PANELES HUNDIDOS DE DECORACIÓN (Verticales y Horizontales)
    // ---------------------------------------------------------------
    // Paneles Verticales (Lado Izquierdo y Lado Derecho)
    const panelVerticalGeo = new THREE.BoxGeometry(0.372, 24.084, 1.2);
    const posPanelesVert = [
        [-38.016, 13.947, 45.724], // Izquierda - Panel Izq
        [-38.016, 13.947, 39.811], // Izquierda - Panel Der
        [-38.016, 13.947, 38.511], // Derecha - Panel Izq
        [-38.016, 13.947, 32.524]  // Derecha - Panel Der
    ];
    posPanelesVert.forEach(([x, y, z]) => {
        const panel = new THREE.Mesh(panelVerticalGeo, maderaMat);
        panel.position.set(x, y, z);
        roperoGroup.add(panel);
    });

    // Paneles Horizontales (Superiores e Inferiores)
    const panelHorizontalGeo = new THREE.BoxGeometry(6.128, 1.3, 4.713);
    const posPanelesHoriz = [
        [-40.894, 25.339, 42.768], // Izquierda - Superior
        [-40.894, 2.555, 42.768],  // Izquierda - Inferior
        [-40.894, 25.339, 35.518], // Derecha - Superior
        [-40.894, 2.555, 35.518]   // Derecha - Inferior
    ];
    posPanelesHoriz.forEach(([x, y, z]) => {
        const panel = new THREE.Mesh(panelHorizontalGeo, maderaMat);
        panel.position.set(x, y, z);
        roperoGroup.add(panel);
    });

    // ---------------------------------------------------------------
    // MANIJAS DE LAS PUERTAS (Cilindros verticales)
    // ---------------------------------------------------------------
    const manijaGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 12);
    const posManijas = [
        [-37.502, 12.911, 39.68], // Manija Izquierda
        [-37.502, 12.911, 38.516] // Manija Derecha
    ];
    posManijas.forEach(([x, y, z]) => {
        const manija = new THREE.Mesh(manijaGeo, manijaMat);
        manija.position.set(x, y, z);
        roperoGroup.add(manija);
    });

    // ---------------------------------------------------------------
    // PIES / PATAS DEL ROPERO
    // ---------------------------------------------------------------
    // Patas Traseras
    const pieTraseroGeo = new THREE.BoxGeometry(2.4, 28, 2.4);
    const posPiesTraseros = [
        [-43.502, 13.5, 47.524], // Pie Trasero Izquierdo
        [-43.502, 13.5, 30.724]  // Pie Trasero Derecho
    ];
    posPiesTraseros.forEach(([x, y, z]) => {
        const pie = new THREE.Mesh(pieTraseroGeo, maderaMat);
        pie.position.set(x, y, z);
        roperoGroup.add(pie);
    });

    // Patas Frontales
    const pieFrontalGeo = new THREE.BoxGeometry(2.4, 28, 1.2);
    const posPiesFrontales = [
        [-38.702, 13.5, 48.124], // Pie Frontal Izquierdo
        [-38.702, 13.5, 30.124]  // Pie Frontal Derecho
    ];
    posPiesFrontales.forEach(([x, y, z]) => {
        const pie = new THREE.Mesh(pieFrontalGeo, maderaMat);
        pie.position.set(x, y, z);
        roperoGroup.add(pie);
    });

    // Patas Frontales Delgadas (Detalle extra)
    const pieDelgadoGeo = new THREE.BoxGeometry(0.7, 26.489, 1.2);
    const posPiesDelgados = [
        [-37.852, 12.745, 46.924], // Pie Delgado Izquierdo
        [-37.852, 12.745, 31.324]  // Pie Delgado Derecho
    ];
    posPiesDelgados.forEach(([x, y, z]) => {
        const pie = new THREE.Mesh(pieDelgadoGeo, maderaMat);
        pie.position.set(x, y, z);
        roperoGroup.add(pie);
    });

    // Recorrido para activar sombras proyectadas y recibidas en el ropero
    roperoGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return roperoGroup;
}