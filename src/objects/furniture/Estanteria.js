// ===============================================================
// ESTANTERÍA PRINCIPAL
// ===============================================================
import * as THREE from 'three';

export function createEstanteria() {
    const estanteriaGroup = new THREE.Group();
    estanteriaGroup.name = "EstanteriaPrincipal"; 

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // MATERIALES (Madera PBR + Manijas)
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
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: maderaRough,
        color: 0x2E2418, 
        roughness: 1,
    });

    const manijaMat = new THREE.MeshStandardMaterial({
        color: 0x7A6248, // Simular el Bronce
        metalness: 0.95, 
        roughness: 0.2, 
    });

    // ---------------------------------------------------------------
    // ESTRUCTURA PRINCIPAL (Laterales, Tapa, Base, Fondo y Respaldo)
    // Lateral Izquierdo y Derecho
    const lateralGeo = new THREE.BoxGeometry(4, 28.5, 0.5);
    const posLaterales = [
        [40.988, 14.227, 29.642], // Lateral Izquierdo
        [40.988, 14.227, 47.504]  // Lateral Derecho
    ];
    posLaterales.forEach(([x, y, z]) => {
        const lateral = new THREE.Mesh(lateralGeo, maderaMat);
        lateral.position.set(x, y, z);
        estanteriaGroup.add(lateral);
    });

    // Tapa Superior y Base Inferior
    const horizontalGeo = new THREE.BoxGeometry(6, 1, 18.562);
    const posTapaBase = [
        [40.988, 28.151, 38.573], // Tapa Superior
        [40.988, 4.977, 38.573],  // Base
        [40.938, 0.377, 38.573]   // Fondo al ras del suelo
    ];
    posTapaBase.forEach(([x, y, z]) => {
        const elemento = new THREE.Mesh(horizontalGeo, maderaMat);
        elemento.position.set(x, y, z);
        estanteriaGroup.add(elemento);
    });

    // Respaldo Trasero
    const respaldoGeo = new THREE.BoxGeometry(0.145, 22.374, 16.562);
    const respaldo = new THREE.Mesh(respaldoGeo, maderaMat);
    respaldo.position.set(43.916, 16.464, 38.573);
    estanteriaGroup.add(respaldo);

    // ---------------------------------------------------------------
    // SECCIÓN INFERIOR DE CAJONES

    // Palos Fijos Laterales de Cajones
    const paloFijoGeo = new THREE.BoxGeometry(6, 3.7, 0.8);
    const posPalosFijos = [
        [40.988, 2.627, 30.692], // Palo Fijo Izquierdo
        [40.968, 2.627, 46.454]  // Palo Fijo Derecho
    ];
    posPalosFijos.forEach(([x, y, z]) => {
        const palo = new THREE.Mesh(paloFijoGeo, maderaMat);
        palo.position.set(x, y, z);
        estanteriaGroup.add(palo);
    });

    // Palos Verticales del Marco de Cajones
    const paloVerticalGeo = new THREE.BoxGeometry(6, 2.7, 0.5);
    const posPalosVert = [
        [40.968, 2.627, 31.342],
        [40.968, 2.627, 38.342],
        [40.968, 2.627, 38.842],
        [40.988, 2.568, 45.804]
    ];
    posPalosVert.forEach(([x, y, z]) => {
        const palo = new THREE.Mesh(paloVerticalGeo, maderaMat);
        palo.position.set(x, y, z);
        estanteriaGroup.add(palo);
    });

    // Palos Horizontales del Marco de Cajones
    const paloHorizontalGeo = new THREE.BoxGeometry(6, 0.5, 7.75);
    const posPalosHoriz = [
        [40.968, 4.227, 34.967], // Superior Izquierdo
        [40.968, 1.027, 34.842], // Inferior Izquierdo
        [40.968, 4.227, 42.448], // Superior Derecho
        [40.968, 1.027, 42.342]  // Inferior Derecho
    ];
    posPalosHoriz.forEach(([x, y, z]) => {
        const palo = new THREE.Mesh(paloHorizontalGeo, maderaMat);
        palo.position.set(x, y, z);
        estanteriaGroup.add(palo);
    });

    // Cajones (Izquierdo y Derecho)
    const cajonGeo = new THREE.BoxGeometry(5.902, 2.818, 6.5);
    const posCajones = [
        [41.037, 2.568, 34.842], // Cajón Izquierdo
        [41.037, 2.568, 42.342]  // Cajón Derecho
    ];
    posCajones.forEach(([x, y, z]) => {
        const cajon = new THREE.Mesh(cajonGeo, maderaMat);
        cajon.position.set(x, y, z);
        estanteriaGroup.add(cajon);
    });

    // ---------------------------------------------------------------
    // REPISAS INTERNAS (3 niveles)
    // ---------------------------------------------------------------
    const repisaGeo = new THREE.BoxGeometry(5.855, 0.8, 16.562);
    const posRepisas = [
        [40.916, 22.425, 38.573], // Repisa Nivel 1 (Superior)
        [40.916, 16.477, 38.573], // Repisa Nivel 2 (Media)
        [40.916, 10.677, 38.573]  // Repisa Nivel 3 (Inferior)
    ];
    posRepisas.forEach(([x, y, z]) => {
        const repisa = new THREE.Mesh(repisaGeo, maderaMat);
        repisa.position.set(x, y, z);
        estanteriaGroup.add(repisa);
    });

    // ---------------------------------------------------------------
    // PATAS DE LA ESTANTERÍA (4 patas)
    // ---------------------------------------------------------------
    const pataGeo = new THREE.BoxGeometry(1, 28.977, 1);
    const posPatas = [
        [38.438, 13.989, 29.792], // Frontal Izquierda
        [38.438, 13.989, 47.354], // Frontal Derecha
        [43.488, 13.989, 29.792], // Trasera Izquierda
        [43.488, 13.989, 47.354]  // Trasera Derecha
    ];
    posPatas.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(pataGeo, maderaMat);
        pata.position.set(x, y, z);
        estanteriaGroup.add(pata);
    });

    // ---------------------------------------------------------------
    // MANIJAS DE LOS CAJONES
    // ---------------------------------------------------------------
    const manijaGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.638, 12);
    const posManijas = [
        [38.086, 2.678, 34.832], // Manija Izquierda
        [38.086, 2.678, 42.578]  // Manija Derecha
    ];
    posManijas.forEach(([x, y, z]) => {
        const manija = new THREE.Mesh(manijaGeo, manijaMat);
        manija.rotation.x = Math.PI / 2;
        manija.position.set(x, y, z);
        estanteriaGroup.add(manija);
    });

    //Recorrido para activar sombras proyectadas y recibidas en la estantería
    estanteriaGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return estanteriaGroup;
}