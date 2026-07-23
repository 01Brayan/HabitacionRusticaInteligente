import * as THREE from 'three';

const soporteMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a, // metal oscuro, como en tu referencia
    metalness: 0.6,
    roughness: 0.4,
});

const maderaMat = new THREE.MeshStandardMaterial({
    color: 0x3d2c1e,
    roughness: 0.6,
});

// ---------------------------------------------------------------
// REPISA SUPERIOR 
// ---------------------------------------------------------------
export function createRepisaSuperior() {
    const repisaGroup = new THREE.Group();
    repisaGroup.name = "repisaSuperior";

    // Tabla principal
    const tablaGeo = new THREE.BoxGeometry(19.7, 1, 4);
    const tabla = new THREE.Mesh(tablaGeo, maderaMat);
    tabla.position.set(-0.359, 31.945, 53.969);
    repisaGroup.add(tabla);

    // Tabla inferior (más delgada, remate debajo de la principal) — arreglado: usaba tablaGeo por error
    const tablainferiorGeo = new THREE.BoxGeometry(19.3, 0.31, 3.706);
    const tablainferior = new THREE.Mesh(tablainferiorGeo, maderaMat);
    tablainferior.position.set(-0.359, 31.29, 54.116);
    repisaGroup.add(tablainferior);

    // Soportes en L — izquierdo y derecho, coordenadas absolutas (copia las tuyas de Studio aquí)
    const brazoDiagonalGeo = new THREE.BoxGeometry(0.7, 0.7, 3.5); // rotado ~30° en X
    const brazoDiagonalIzqui = new THREE.Mesh(brazoDiagonalGeo, soporteMat);
    brazoDiagonalIzqui.position.set(6.605, 30.804, 54.034);
    brazoDiagonalIzqui.rotation.x = THREE.MathUtils.degToRad(30); // <- AJUSTAR si tu ángulo real es otro
    repisaGroup.add(brazoDiagonalIzqui);

    const brazoDiagonalDer = new THREE.Mesh(brazoDiagonalGeo, soporteMat);
    brazoDiagonalDer.position.set(-7.323, 30.804, 54.034);
    brazoDiagonalDer.rotation.x = THREE.MathUtils.degToRad(30); // <- AJUSTAR
    repisaGroup.add(brazoDiagonalDer);

    const brazoVertiGeo = new THREE.BoxGeometry(0.7, 1.982, 0.7);
    const brazoVertiIzqui = new THREE.Mesh(brazoVertiGeo, soporteMat);
    brazoVertiIzqui.position.set(6.605, 30.343, 55.619);
    repisaGroup.add(brazoVertiIzqui);

    const brazoVertiDer = new THREE.Mesh(brazoVertiGeo, soporteMat);
    brazoVertiDer.position.set(-7.323, 30.343, 55.619);
    repisaGroup.add(brazoVertiDer);

    return repisaGroup;
}

export function createRepisaInferior() {
    const repisaGroup = new THREE.Group();
    repisaGroup.name = "repisaInferior";

    const tablaGeo = new THREE.BoxGeometry(19.7, 1, 4); // <- AJUSTAR con tus medidas reales
    const tabla = new THREE.Mesh(tablaGeo, maderaMat);
    tabla.position.set(-0.359, 24.568, 53.969); // <- AJUSTAR (más abajo que la superior)
    repisaGroup.add(tabla);

    const tablainferiorGeo = new THREE.BoxGeometry(19.3, 0.31, 3.706); // <- AJUSTAR
    const tablainferior = new THREE.Mesh(tablainferiorGeo, maderaMat);
    tablainferior.position.set(-0.359, 23.913, 54.116); // <- AJUSTAR
    repisaGroup.add(tablainferior);

    const brazoDiagonalGeo = new THREE.BoxGeometry(0.7, 0.7, 3.5); // <- AJUSTAR
    const brazoDiagonalIzqui = new THREE.Mesh(brazoDiagonalGeo, soporteMat);
    brazoDiagonalIzqui.position.set(6.605, 23.428, 54.034); // <- AJUSTAR
    brazoDiagonalIzqui.rotation.x = THREE.MathUtils.degToRad(30); // <- AJUSTAR
    repisaGroup.add(brazoDiagonalIzqui);

    const brazoDiagonalDer = new THREE.Mesh(brazoDiagonalGeo, soporteMat);
    brazoDiagonalDer.position.set(-7.323, 23.428, 54.034); // <- AJUSTAR
    brazoDiagonalDer.rotation.x = THREE.MathUtils.degToRad(30); // <- AJUSTAR
    repisaGroup.add(brazoDiagonalDer);

    const brazoVertiGeo = new THREE.BoxGeometry(0.7, 1.982, 0.7); // <- AJUSTAR
    const brazoVertiIzqui = new THREE.Mesh(brazoVertiGeo, soporteMat);
    brazoVertiIzqui.position.set(6.605, 22.966, 55.619); // <- AJUSTAR
    repisaGroup.add(brazoVertiIzqui);

    const brazoVertiDer = new THREE.Mesh(brazoVertiGeo, soporteMat);
    brazoVertiDer.position.set(-7.323, 22.966, 55.619); // <- AJUSTAR
    repisaGroup.add(brazoVertiDer);

    return repisaGroup;
}