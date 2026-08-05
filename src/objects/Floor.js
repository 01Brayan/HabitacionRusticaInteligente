// codigo del piso
import * as THREE from 'three';

export function createFloor() {
    const floorGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // --- Texturas de piso ---
    const diffuseMap = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_diff_2k.jpg');
    const normalMap  = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_nor_gl_2k.jpg');
    const roughMap   = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_rough_2k.jpg');
    const aoMap      = textureLoader.load('src/assets/textures/wood_floor/old_wood_floor_ao_2k.jpg');

    diffuseMap.colorSpace = THREE.SRGBColorSpace;

    [diffuseMap, normalMap, roughMap, aoMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1.5, 1.5);
    });

    // --- Texturas de Piedra ---
    const piedraDiffuse = textureLoader.load('src/assets/textures/stone/stone_diff_2k.jpg');
    const piedraNormal  = textureLoader.load('src/assets/textures/stone/stone_nor_gl_2k.jpg');
    const piedraRough   = textureLoader.load('src/assets/textures/stone/stone_rough_2k.jpg');
    const piedraAO      = textureLoader.load('src/assets/textures/stone/stone_ao_2k.jpg');

    piedraDiffuse.colorSpace = THREE.SRGBColorSpace;
    [piedraDiffuse, piedraNormal, piedraRough, piedraAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(4, 1);
    });


    // Estructura del piso (Cajas simples)
    const floorGeo = new THREE.BoxGeometry(94.534, 4, 116); // Ancho, alto, profundidad

    // uv2 es OBLIGATORIO para que el aoMap se vea, si no, Three.js lo ignora sin dar error
    floorGeo.setAttribute('uv2', new THREE.BufferAttribute(floorGeo.attributes.uv.array, 2));

    const floorMat = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        roughnessMap: roughMap,
        aoMap: aoMap,
        color: 0x5C4033, // <-- tu tinte de color definido para el piso
        roughness: 1.0,  // en 1.0 porque el roughMap ya trae la variación real
    });

    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.x = -0.272;
    floor.position.y = -2.5; // Para que quede al ras del suelo matemático
    floor.position.z = 0; // Para que quede al ras del suelo matemático

    floor.receiveShadow = true; // para que reciba las sombras de camas/muebles/luces

    floorGroup.add(floor);

    // =============================================
    // PISO BASE DE LADRILLO (debajo de la madera)
    // El piso de madera termina en Y = -4.5, el de
    // ladrillo empieza justo ahí y baja.
    // =============================================
    const ladrilloMat = new THREE.MeshStandardMaterial({
        map: piedraDiffuse,
        normalMap: piedraNormal,
        roughnessMap: piedraRough,
        aoMap: piedraAO,
        color: 0x6E6259,
        roughness: 1.0,
    });

    const pisoBaseLadrilloGeo = new THREE.BoxGeometry(95, 8, 117);
    pisoBaseLadrilloGeo.setAttribute('uv2', new THREE.BufferAttribute(pisoBaseLadrilloGeo.attributes.uv.array, 2));
    const pisoBaseLadrillo = new THREE.Mesh(pisoBaseLadrilloGeo, ladrilloMat);
    // Centro del ladrillo en Y = -8.5 → va de -4.5 a -12.5 (justo debajo de la madera)
    pisoBaseLadrillo.position.set(-0.349, -8.5, -0.015);
    pisoBaseLadrillo.receiveShadow = true;

    floorGroup.add(pisoBaseLadrillo);

    return floorGroup; // ¡MUY IMPORTANTE RETORNARLO!
}
