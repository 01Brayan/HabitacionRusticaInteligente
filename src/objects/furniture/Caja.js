// ===============================================================
// CAJA DE MADERA
import * as THREE from 'three';

export function createCaja() {
    const cajaGroup = new THREE.Group();
    cajaGroup.name = "CajaMadera";

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // MATERIAL DE MADERA
    const maderaDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.65, 0.65),
        roughnessMap: maderaRough,
        color: 0x3D2C1E,
        roughness: 0.68,
    });

    const refuerzoMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.65, 0.65),
        roughnessMap: maderaRough,
        color: 0x6E5A3E, 
        roughness: 0.45,
    });

    // ---------------------------------------------------------------
    // CUERPO PRINCIPAL
    const cuerpoGeo = new THREE.BoxGeometry(6.125, 6.125, 6.125);
    const cuerpo = new THREE.Mesh(cuerpoGeo, maderaMat);
    cuerpo.position.set(-39.276, 2.764, -45.462);
    cajaGroup.add(cuerpo);

    // ---------------------------------------------------------------
    // REFUERZOS Y PALOS EN LAS ESQUINAS
    // Palos Verticales en las 4 esquinas
    const palosVertiGeo = new THREE.BoxGeometry(0.875, 4.851, 0.875);
    const posPalosVerti = [
        [-36.214, 2.785, -42.399], // Frontal Izquierdo
        [-36.214, 2.785, -48.496], // Frontal Derecho
        [-42.339, 2.785, -42.399], // Trasero Izquierdo
        [-42.339, 2.785, -48.496]  // Trasero Derecho
    ];
    posPalosVerti.forEach(([x, y, z]) => {
        const palo = new THREE.Mesh(palosVertiGeo, refuerzoMat);
        palo.position.set(x, y, z);
        cajaGroup.add(palo);
    });

    // Palos Horizontales Cortos (Frente y Atrás, Superior e Inferior)
    const palosHorzCortoGeo = new THREE.BoxGeometry(0.82, 0.875, 5.221);
    const posPalosCortos = [
        [-36.187, 5.625, -45.447],  // Frontal Superior
        [-36.214, -0.063, -45.447], // Frontal Inferior
        [-42.366, 5.625, -45.447],  // Trasera Superior
        [-42.366, -0.063, -45.447]  // Trasera Inferior
    ];
    posPalosCortos.forEach(([x, y, z]) => {
        const palo = new THREE.Mesh(palosHorzCortoGeo, refuerzoMat);
        palo.position.set(x, y, z);
        cajaGroup.add(palo);
    });

    // Palos Horizontales Largos (Laterales, Superior e Inferior)
    const palosHorzLargoGeo = new THREE.BoxGeometry(7, 0.875, 0.875);
    const posPalosLargos = [
        [-39.276, 5.625, -42.399],  // Lateral Sup Izquierdo
        [-39.276, 5.625, -48.496],  // Lateral Sup Derecho
        [-39.276, -0.063, -42.399], // Lateral Inf Izquierdo
        [-39.276, -0.063, -48.496]  // Lateral Inf Derecho
    ];
    posPalosLargos.forEach(([x, y, z]) => {
        const palo = new THREE.Mesh(palosHorzLargoGeo, refuerzoMat);
        palo.position.set(x, y, z);
        cajaGroup.add(palo);
    });

    // ---------------------------------------------------------------
    // CRUCES DE MADERA EN LAS 4 CARAS
    const cruzTablonGeo = new THREE.BoxGeometry(0.7, 7.685, 0.35);
    const crucesConfig = [
        // Cara Frontal
        { rot: [0, -90, 45],  pos: [-36.039, 2.884, -45.333] },
        { rot: [0, -90, -45], pos: [-36.039, 2.706, -45.407] },
        // Cara Trasera
        { rot: [0, -90, 45],  pos: [-42.339, 2.706, -45.407] },
        { rot: [0, -90, -45], pos: [-42.339, 2.884, -45.333] },
        // Cara Lateral Izquierda
        { rot: [0, 0, 45],   pos: [-39.184, 2.866, -42.224] },
        { rot: [0, 0, -45],  pos: [-39.365, 2.934, -42.224] },
        // Cara Lateral Derecha
        { rot: [0, 0, 45],   pos: [-39.184, 2.866, -48.61] },
        { rot: [0, 0, -45],  pos: [-39.365, 2.934, -48.61] }
    ];

    crucesConfig.forEach(({ rot: [rx, ry, rz], pos: [x, y, z] }) => {
        const cruz = new THREE.Mesh(cruzTablonGeo, refuerzoMat);
        cruz.rotation.set(
            THREE.MathUtils.degToRad(rx),
            THREE.MathUtils.degToRad(ry),
            THREE.MathUtils.degToRad(rz)
        );
        cruz.position.set(x, y, z);
        cajaGroup.add(cruz);
    });

    // Recorrido para activar sombras proyectadas y recibidas en la caja de madera
    cajaGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return cajaGroup;
}