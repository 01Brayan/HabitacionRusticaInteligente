// ===============================================================
// REPISAS DE PARED (SUPERIOR E INFERIOR)
// ===============================================================
import * as THREE from 'three';

// ---------------------------------------------------------------
// MATERIALES COMPARTIDOS (Madera PBR + soporte)
// ---------------------------------------------------------------
    const textureLoader = new THREE.TextureLoader();
    const maderaDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 2); 
    });
    const soporteMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.55, 0.55), // --esto fue modificado: agregado normalScale para el relieve
        roughnessMap: maderaRough,
        color: 0x6E5A3E, 
        roughness: 0.6,
    });

    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.55, 0.55), // --esto fue modificado: agregado normalScale para el relieve
        roughnessMap: maderaRough,
        color: 0x2E2418, 
        roughness: 0.6,
    });


// Geometrías reusables
const tablaGeo = new THREE.BoxGeometry(19.7, 1, 4);
const tablainferiorGeo = new THREE.BoxGeometry(19.3, 0.31, 3.706);
const brazoDiagonalGeo = new THREE.BoxGeometry(0.7, 0.7, 3.5);
const brazoVertiGeo = new THREE.BoxGeometry(0.7, 1.982, 0.7);

// Función auxiliar para construir una repisa dada su altura e Y
function buildRepisaGroup(name, yTabla, yInf, yDiag, yVert) {
    const group = new THREE.Group();
    group.name = name;

    // Tabla Principal
    const tabla = new THREE.Mesh(tablaGeo, maderaMat);
    tabla.position.set(-0.359, yTabla, 53.969);

    // Remate Inferior
    const tablainferior = new THREE.Mesh(tablainferiorGeo, maderaMat);
    tablainferior.position.set(-0.359, yInf, 54.116);

    group.add(tabla, tablainferior);

    // Brazos Diagonales de Metal (Izquierda y Derecha)
    const posDiagonales = [
        [6.605, yDiag, 54.034], // Brazo Diagonal Izquierdo
        [-7.323, yDiag, 54.034]  // Brazo Diagonal Derecho
    ];
    posDiagonales.forEach(([x, y, z]) => {
        const brazo = new THREE.Mesh(brazoDiagonalGeo, soporteMat);
        brazo.position.set(x, y, z);
        brazo.rotation.x = THREE.MathUtils.degToRad(30);
        group.add(brazo);
    });

    // Brazos Verticales de Metal (Izquierda y Derecha)
    const posVerticales = [
        [6.605, yVert, 55.619], // Brazo Vertical Izquierdo
        [-7.323, yVert, 55.619]  // Brazo Vertical Derecho
    ];
    posVerticales.forEach(([x, y, z]) => {
        const brazo = new THREE.Mesh(brazoVertiGeo, soporteMat);
        brazo.position.set(x, y, z);
        group.add(brazo);
    });

    // Recorrido para activar sombras en todas las piezas de la repisa
    group.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return group;
}

// ---------------------------------------------------------------
// REPISA SUPERIOR
// ---------------------------------------------------------------
export function createRepisaSuperior() {
    return buildRepisaGroup("repisaSuperior", 31.945, 31.29, 30.804, 30.343);
}

// ---------------------------------------------------------------
// REPISA INFERIOR
// ---------------------------------------------------------------
export function createRepisaInferior() {
    return buildRepisaGroup("repisaInferior", 24.568, 23.913, 23.428, 22.966);
}