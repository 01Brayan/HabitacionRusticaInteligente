//Codigo del piso
/*import * as THREE from 'three';

export function createFloor() {
    const floorGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();
    const sueloTextura = textureLoader.load('src/assets/wood_table_diff_4k.jpg');
    sueloTextura.wrapS = THREE.RepeatWrapping;
    sueloTextura.wrapT = THREE.RepeatWrapping;
    sueloTextura.repeat.set(7, 5);
    // Estructura de la cama (Cajas simples)
    const floorGeo = new THREE.BoxGeometry(59.5, 0.8, 100); // Ancho, alto, profundidad
    const floorMat = new THREE.MeshStandardMaterial({ map: sueloTextura, roughness: 0.8 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.2; // Para que quede al ras del suelo matemático
    floor.position.z = -6.5; // Para que quede al ras del suelo matemático

    floorGroup.add(floor);

    return floorGroup; // ¡MUY IMPORTANTE RETORNARLO!
}*/

// codigo del piso
import * as THREE from 'three';

export function createFloor() {
    const floorGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // --- Carga de los 4 mapas PBR (nombres exactos de tu carpeta wood_floor) ---
    const diffuseMap = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_diff_2k.jpg');
    const normalMap  = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_nor_gl_2k.jpg');
    const roughMap   = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_rough_2k.jpg');
    const aoMap      = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_ao_2k.jpg');

    // El diffuse necesita colorSpace correcto, los demás mapas NO
    diffuseMap.colorSpace = THREE.SRGBColorSpace;

    // Misma repetición que ya tenías (7, 5) para no perder el ajuste que habías calibrado
    [diffuseMap, normalMap, roughMap, aoMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1.5, 1.5);
    });

    // Estructura del piso (Cajas simples)
    const floorGeo = new THREE.BoxGeometry(91, 4, 116); // Ancho, alto, profundidad

    // uv2 es OBLIGATORIO para que el aoMap se vea, si no, Three.js lo ignora sin dar error
    floorGeo.setAttribute('uv2', new THREE.BufferAttribute(floorGeo.attributes.uv.array, 2));

    const floorMat = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        roughnessMap: roughMap,
        aoMap: aoMap,
        color: 0x3E2817, // <-- tu tinte de color definido para el piso
        roughness: 1.0,  // en 1.0 porque el roughMap ya trae la variación real
    });

    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -2.5; // Para que quede al ras del suelo matemático
    floor.position.z = 0; // Para que quede al ras del suelo matemático

    floor.receiveShadow = true; // para que reciba las sombras de camas/muebles/luces

    floorGroup.add(floor);

    return floorGroup; // ¡MUY IMPORTANTE RETORNARLO!
}