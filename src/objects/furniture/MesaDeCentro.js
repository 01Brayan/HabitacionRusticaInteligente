// ===============================================================
// MESA DE CENTRO CON VIDRIO
// ===============================================================
import * as THREE from 'three';

export function createMesaCentro() {
    const mesaCentroGroup = new THREE.Group();
    mesaCentroGroup.name = "MesaDeCentro";

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // MATERIAL DE MADERA (PBR) Y VIDRIO

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
        normalScale: new THREE.Vector2(0.55, 0.55), // --esto fue modificado: se agregó normalScale para dar volumen real al relieve de la mesa
        roughnessMap: maderaRough,
        color: 0x3D2C1E,
        roughness: 0.6,
    });

    const vidrioMat = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 0.9,
        transparent: true,
        opacity: 1,
        thickness: 0.5,
    });

    // ---------------------------------------------------------------
    // PATAS (4 patas iguales)
    const pataGeo = new THREE.BoxGeometry(1.936, 5.163, 1.936);
    const posPatas = [
        [19.575, 2.082, -20.517], // Frontal Izquierda
        [8.603, 2.082, -20.517],  // Frontal Derecha
        [19.575, 2.082, -9.545],  // Trasera Izquierda
        [8.603, 2.082, -9.545]   // Trasera Derecha
    ];
    posPatas.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(pataGeo, maderaMat);
        pata.position.set(x, y, z);
        mesaCentroGroup.add(pata);
    });

    // ---------------------------------------------------------------
    // MARCO INFERIOR (Conecta las patas por abajo)
    const marcoLargoGeo = new THREE.BoxGeometry(1.291, 1.291, 9.036);
    const marcoCortoGeo = new THREE.BoxGeometry(9.036, 1.291, 1.367);

    // Palos Cortos Inferiores (Frente y Atrás)
    const posMarcoICorto = [
        [14.089, 1.78, -20.585], // Marco Inferior Frente
        [14.089, 1.78, -9.463]   // Marco Inferior Atrás
    ];
    posMarcoICorto.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoCortoGeo, maderaMat);
        marco.position.set(x, y, z);
        mesaCentroGroup.add(marco);
    });

    // Palos Largos Inferiores (Izquierda y Derecha)
    const posMarcoILargo = [
        [19.695, 1.78, -15.031], // Marco Inferior Izquierdo
        [8.59, 1.78, -15.031]    // Marco Inferior Derecho
    ];
    posMarcoILargo.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoLargoGeo, maderaMat);
        marco.position.set(x, y, z);
        mesaCentroGroup.add(marco);
    });

    // ---------------------------------------------------------------
    // MARCO SUPERIOR (Soporte de la tapa de vidrio)
    const marcoSLargoGeo = new THREE.BoxGeometry(0.645, 1.291, 12.908);
    const marcoSAnchoGeo = new THREE.BoxGeometry(14.199, 1.291, 0.645);

    // Palos Anchos Superiores (Frente y Atrás)
    const posMarcoSAncho = [
        [14.089, 5.115, -21.808], // Marco Superior Frente
        [14.089, 5.115, -8.254]   // Marco Superior Atrás
    ];
    posMarcoSAncho.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoSAnchoGeo, maderaMat);
        marco.position.set(x, y, z);
        mesaCentroGroup.add(marco);
    });

    // Palos Largos Superiores (Izquierda y Derecha)
    const posMarcoSLargo = [
        [20.866, 5.115, -15.031], // Marco Superior Izquierdo
        [7.312, 5.115, -15.031]   // Marco Superior Derecho
    ];
    posMarcoSLargo.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoSLargoGeo, maderaMat);
        marco.position.set(x, y, z);
        mesaCentroGroup.add(marco);
    });

    // ---------------------------------------------------------------
    // VIDRIO SUPERIOR
    // ---------------------------------------------------------------
    const vidrioGeo = new THREE.BoxGeometry(12.908, 0.3, 12.908);
    const vidrio = new THREE.Mesh(vidrioGeo, vidrioMat);
    vidrio.position.set(14.089, 5.611, -15.031);
    vidrio.castShadow = false;
    vidrio.receiveShadow = true;
    mesaCentroGroup.add(vidrio);

    // Recorrido para activar sombras en las partes de madera, manteniendo el vidrio sin proyectar sombra dura
    mesaCentroGroup.traverse((child) => {
        if (child.isMesh) {
            child.receiveShadow = true;
            if (child !== vidrio) {
                child.castShadow = true;
            }
        }
    });

    return mesaCentroGroup;
}