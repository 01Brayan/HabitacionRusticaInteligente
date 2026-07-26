// ===============================================================
// MESA DE NOCHE
// ===============================================================
import * as THREE from 'three';

export function createMesaDeNoche() {
    const mesaGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // MATERIALES (Madera PBR + Manijas Metálicas)
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
        normalScale: new THREE.Vector2(0.55, 0.55), // --esto fue modificado: se agregó normalScale para el relieve de la mesa de noche
        roughnessMap: maderaRough,
        color: 0x3D2C1E,
        roughness: 0.55,
    });

    const manijaMat = new THREE.MeshStandardMaterial({
        color: 0xB8B8B0,
        metalness: 0.95,
        roughness: 0.2, 
    });

    // ---------------------------------------------------------------
    // ESTRUCTURA Y TAPA
    // ---------------------------------------------------------------
    // Tapa Superior
    const tapaGeo = new THREE.BoxGeometry(9, 0.8, 6); 
    const tapa = new THREE.Mesh(tapaGeo, maderaMat);
    tapa.position.set(16.891, 8.848, 51.969); 

    // Cuerpo Principal del Mueble
    const cuerpoGeo = new THREE.BoxGeometry(8.484, 7.431, 5.357);
    const cuerpo = new THREE.Mesh(cuerpoGeo, maderaMat);
    cuerpo.position.set(16.89, 4.732, 52.048); 

    // Zócalo (Falda Inferior)
    const zocaloGeo = new THREE.BoxGeometry(8.617, 1.2, 5.524);
    const zocalo = new THREE.Mesh(zocaloGeo, maderaMat);
    zocalo.position.set(16.865, 1.616, 51.957);

    mesaGroup.add(tapa, cuerpo, zocalo);

    // ---------------------------------------------------------------
    // CAJONES (Marcos de relieve)
    // ---------------------------------------------------------------
    const marcoCajonGeo = new THREE.BoxGeometry(6.8, 2.8, 0.3);
    const posMarcosCajones = [
        [16.715, 6.81, 49.119], // Marco Cajón Superior
        [16.754, 3.84, 49.119]  // Marco Cajón Inferior
    ];
    posMarcosCajones.forEach(([x, y, z]) => {
        const marco = new THREE.Mesh(marcoCajonGeo, maderaMat);
        marco.position.set(x, y, z);
        mesaGroup.add(marco);
    });

    // ---------------------------------------------------------------
    // MANIJAS DE LOS CAJONES (Cilindros horizontales)
    // ---------------------------------------------------------------
    const manijaGeo = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 12);
    const posManijas = [
        [16.715, 6.81, 48.969],  // Manija Superior
        [16.715, 3.854, 48.969]  // Manija Inferior
    ];
    posManijas.forEach(([x, y, z]) => {
        const manija = new THREE.Mesh(manijaGeo, manijaMat);
        manija.rotation.z = Math.PI / 2;
        manija.position.set(x, y, z);
        mesaGroup.add(manija);
    });

    // ---------------------------------------------------------------
    // PATAS DE LA MESA DE NOCHE (4 patas)
    // ---------------------------------------------------------------
    const pataGeo = new THREE.BoxGeometry(0.6, 9, 0.6);
    const posPatas = [
        [20.995, 4, 49.519], // Frontal Izquierda
        [12.691, 4, 49.519], // Frontal Derecha
        [20.995, 4, 54.669], // Trasera Izquierda
        [12.691, 4, 54.669]  // Trasera Derecha
    ];
    posPatas.forEach(([x, y, z]) => {
        const pata = new THREE.Mesh(pataGeo, maderaMat);
        pata.position.set(x, y, z);
        mesaGroup.add(pata);
    });

    //Recorrido para activar sombras en la mesa de noche
    mesaGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return mesaGroup;
}