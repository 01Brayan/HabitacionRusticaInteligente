// ===============================================================
// PARTE: TECHO Y VIGAS ESTRUCTURALES
// ===============================================================
import * as THREE from 'three';

export function createRoof() {
    const roofGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. CARGA DE TEXTURAS (Vigas de Madera Rústica y Paneles de Techo)
    // ---------------------------------------------------------------
    const vigaDiffuse = textureLoader.load('src/assets/textures/rough_wood/rough_wood_diff_2k.jpg');
    const vigaNormal  = textureLoader.load('src/assets/textures/rough_wood/rough_wood_nor_gl_2k.jpg');
    const vigaRough   = textureLoader.load('src/assets/textures/rough_wood/rough_wood_rough_2k.jpg');
    const vigaAO      = textureLoader.load('src/assets/textures/rough_wood/rough_wood_ao_2k.jpg');

    [vigaDiffuse, vigaNormal, vigaRough, vigaAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
        tex.rotation = Math.PI / 2;
        tex.center.set(0.5, 0.5);
    });

    const techoDiffuse = textureLoader.load('src/assets/textures/plank_wall/plank_wall_diff_2k.jpg');
    const techoNormal  = textureLoader.load('src/assets/textures/plank_wall/plank_wall_nor_gl_2k.jpg');
    const techoRough   = textureLoader.load('src/assets/textures/plank_wall/plank_wall_rough_2k.jpg');
    const techoAO      = textureLoader.load('src/assets/textures/plank_wall/plank_wall_ao_2k.jpg');

    techoDiffuse.colorSpace = THREE.SRGBColorSpace;
    [techoDiffuse, techoNormal, techoRough, techoAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(0, 3); 
    });

    // Materiales
    const roofMat = new THREE.MeshStandardMaterial({
        map: techoDiffuse,
        normalMap: techoNormal,
        roughnessMap: techoRough,
        aoMap: techoAO,
        color: 0x6B4A30, 
        roughness: 1.0,
    });

    const vigasDiagonalesMat = new THREE.MeshStandardMaterial({
        map: vigaDiffuse,
        normalMap: vigaNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: vigaRough,
        aoMap: vigaAO,
        color: 0x4A3220,
        roughness: 1.0,
    });

    const vigasHorizontalesMat = new THREE.MeshStandardMaterial({
        map: vigaDiffuse,
        normalMap: vigaNormal,
        roughnessMap: vigaRough,
        aoMap: vigaAO,
        color: 0x4A3220, 
        roughness: 1.0,
    });

    // Geometrías
    const roofGeo = new THREE.BoxGeometry(5, 66.5, 117);
    const vigasDiagonalesGeo = new THREE.BoxGeometry(6, 66.5, 6);
    const vigasHorizontalesGeo = new THREE.BoxGeometry(5, 35, 5.5);

    // Activación del mapa de oclusión ambiental (uv2)
    [roofGeo, vigasDiagonalesGeo, vigasHorizontalesGeo].forEach((geo) => {
        geo.setAttribute('uv2', new THREE.BufferAttribute(geo.attributes.uv.array, 2));
    });

    // ---------------------------------------------------------------
    // 2. TECHO - LADO DERECHO (Plancha e inclinación)
    // ---------------------------------------------------------------
    const roofMeshDerecho = new THREE.Mesh(roofGeo, roofMat);
    roofMeshDerecho.position.set(-24.434, 51.885, 0.03);
    roofMeshDerecho.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    roofGroup.add(roofMeshDerecho);

    // ---------------------------------------------------------------
    // 3. VIGAS DIAGONALES - LADO DERECHO (5 vigas)
    // ---------------------------------------------------------------
    const posVigasDiagDer = [
        [-21.593, 48.196, 54.521], // Viga Frente (Z positivo)
        [-21.014, 47.575, 25.54],  // Viga Medio-Frente
        [-21.014, 47.575, -1.46],  // Viga Centro
        [-21.014, 47.575, -28.46], // Viga Medio-Atrás
        [-21.014, 47.575, -55.46]  // Viga Atrás (Z negativo)
    ];
    posVigasDiagDer.forEach(([x, y, z]) => {
        const viga = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
        viga.position.set(x, y, z);
        viga.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
        roofGroup.add(viga);
    });

    // ---------------------------------------------------------------
    // 4. TECHO - LADO IZQUIERDO (Plancha e inclinación)
    // ---------------------------------------------------------------
    const roofMeshIzquierdo = new THREE.Mesh(roofGeo, roofMat);
    roofMeshIzquierdo.position.set(23.376, 51.275, 0.031);
    roofMeshIzquierdo.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    roofGroup.add(roofMeshIzquierdo);

    // ---------------------------------------------------------------
    // 5. VIGAS DIAGONALES - LADO IZQUIERDO (5 vigas)
    // ---------------------------------------------------------------
    const posVigasDiagIzq = [
        [20.983, 48.196, 54.521], // Viga Frente (Z positivo)
        [20.271, 47.575, 25.54],  // Viga Medio-Frente
        [20.271, 47.575, -1.46],  // Viga Centro
        [20.271, 47.575, -28.46], // Viga Medio-Atrás
        [20.271, 47.575, -55.46]  // Viga Atrás (Z negativo)
    ];
    posVigasDiagIzq.forEach(([x, y, z]) => {
        const viga = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
        viga.position.set(x, y, z);
        viga.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
        roofGroup.add(viga);
    });

    // ---------------------------------------------------------------
    // 6. VIGAS HORIZONTALES CENTRALES (4 vigas de amarre)
    // ---------------------------------------------------------------
    const posVigasHoriz = [
        [-0.271, 49.157, 25.513],  // Viga Horizontal 1
        [-0.271, 49.157, -1.487],  // Viga Horizontal 2
        [-0.271, 49.157, -28.487], // Viga Horizontal 3
        [-0.271, 49.157, -55.487]  // Viga Horizontal 4
    ];
    posVigasHoriz.forEach(([x, y, z]) => {
        const viga = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
        viga.position.set(x, y, z);
        viga.rotation.set(0, 0, THREE.MathUtils.degToRad(90));
        roofGroup.add(viga);
    });

    // Recorrido para activar sombras en las vigas y paneles del techo
    roofGroup.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    return roofGroup;
}