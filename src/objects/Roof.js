import * as THREE from 'three';

export function createRoof() {
    const roofGroup = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. TEXTURA DE VIGAS (diagonales y horizontales) -> beam_wood
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



    // ---------------------------------------------------------------
    // 2. TEXTURA DEL PANEL DE TECHO (la superficie inclinada) -> plank_wall
    //    (mismo tipo de madera que la pared, pero tablones más finos = más repeat)
    // ---------------------------------------------------------------
    const techoDiffuse = textureLoader.load('src/assets/textures/plank_wall/plank_wall_diff_2k.jpg');
    const techoNormal  = textureLoader.load('src/assets/textures/plank_wall/plank_wall_nor_gl_2k.jpg');
    const techoRough   = textureLoader.load('src/assets/textures/plank_wall/plank_wall_rough_2k.jpg');
    const techoAO      = textureLoader.load('src/assets/textures/plank_wall/plank_wall_ao_2k.jpg');

    techoDiffuse.colorSpace = THREE.SRGBColorSpace;
    [techoDiffuse, techoNormal, techoRough, techoAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(0, 3); // panel largo (104 de profundidad), necesita bastante repetición
    });

    // ---------------------------------------------------------------
    // MATERIALES
    // ---------------------------------------------------------------
    const roofMat = new THREE.MeshStandardMaterial({
        map: techoDiffuse,
        normalMap: techoNormal,
        roughnessMap: techoRough,
        aoMap: techoAO,
        color: 0x6B4A30, // el techo es la superficie MÁS OSCURA de toda la casa
        roughness: 1.0,
    });

const vigasDiagonalesMat = new THREE.MeshStandardMaterial({
    map: vigaDiffuse,
    normalMap: vigaNormal,
    normalScale: new THREE.Vector2(0.4, 0.4),
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
        color: 0x4A3220, // mismo tono que las diagonales
        roughness: 1.0,
    });

    const roofGeo = new THREE.BoxGeometry(5, 66.5, 117);
    const vigasDiagonalesGeo = new THREE.BoxGeometry(6, 66.5, 6);
    const vigasHorizontalesGeo = new THREE.BoxGeometry(5, 35, 5.5);

    // uv2 es OBLIGATORIO en cada geometría para que el aoMap funcione
    [roofGeo, vigasDiagonalesGeo, vigasHorizontalesGeo].forEach((geo) => {
        geo.setAttribute('uv2', new THREE.BufferAttribute(geo.attributes.uv.array, 2));
    });

    //LADO DERECHO
    //techo
    const roofMeshDerecho = new THREE.Mesh(roofGeo, roofMat);
    roofMeshDerecho.position.set(-24.434, 51.885, 0.03);
    roofMeshDerecho.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    roofGroup.add(roofMeshDerecho);

    //vigas diagonales derecha
    const vigasDiagonales1 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales1.position.set(-21.593, 48.196, 54.521);
    vigasDiagonales1.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    roofGroup.add(vigasDiagonales1);

    const vigasDiagonales2 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales2.position.set(-21.014, 47.575, 25.54);
    vigasDiagonales2.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    roofGroup.add(vigasDiagonales2);

    const vigasDiagonales3 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales3.position.set(-21.014, 47.575, -1.46);
    vigasDiagonales3.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    roofGroup.add(vigasDiagonales3);

    const vigasDiagonales4 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales4.position.set(-21.014, 47.575, -28.46);
    vigasDiagonales4.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    roofGroup.add(vigasDiagonales4);

    const vigasDiagonales5 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales5.position.set(-21.014, 47.575, -55.46);
    vigasDiagonales5.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    roofGroup.add(vigasDiagonales5);

    //TECHO LADO IZQUIERDO
    //techo
    const roofMeshIzquierdo = new THREE.Mesh(roofGeo, roofMat);
    roofMeshIzquierdo.position.set(23.376, 51.275, 0.031);
    roofMeshIzquierdo.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    roofGroup.add(roofMeshIzquierdo);

    //Vigas Diagonales desde el fondo al frente 
    const vigasDiagonales6 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales6.position.set(20.983, 48.196, 54.521); 
    vigasDiagonales6.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    roofGroup.add(vigasDiagonales6);

    const vigasDiagonales7 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales7.position.set(20.271, 47.575, 25.54); 
    vigasDiagonales7.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    roofGroup.add(vigasDiagonales7);

    const vigasDiagonales8 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales8.position.set(20.271, 47.575, -1.46); 
    vigasDiagonales8.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    roofGroup.add(vigasDiagonales8);

    const vigasDiagonales9 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales9.position.set(20.271, 47.575, -28.46); 
    vigasDiagonales9.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    roofGroup.add(vigasDiagonales9);

    const vigasDiagonales10 = new THREE.Mesh(vigasDiagonalesGeo, vigasDiagonalesMat);
    vigasDiagonales10.position.set(20.271, 47.575, -55.46); 
    vigasDiagonales10.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    roofGroup.add(vigasDiagonales10);

    // vigas horizontales
    const vigasHorizontales1 = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
    const vigasHorizontales2 = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
    const vigasHorizontales3 = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);
    const vigasHorizontales4 = new THREE.Mesh(vigasHorizontalesGeo, vigasHorizontalesMat);

    vigasHorizontales1.position.set(-0.271, 49.157, 25.513);
    vigasHorizontales1.rotation.set(0, 0, THREE.MathUtils.degToRad(90));
    roofGroup.add(vigasHorizontales1);

    vigasHorizontales2.position.set(-0.271, 49.157, -1.487);
    vigasHorizontales2.rotation.set(0, 0, THREE.MathUtils.degToRad(90));
    roofGroup.add(vigasHorizontales2);

    vigasHorizontales3.position.set(-0.271, 49.157, -28.487);
    vigasHorizontales3.rotation.set(0,0, THREE.MathUtils.degToRad(90));
    roofGroup.add(vigasHorizontales3);

    vigasHorizontales4.position.set(-0.271, 49.157, -55.487);
    vigasHorizontales4.rotation.set(0, 0, THREE.MathUtils.degToRad(90));
    roofGroup.add(vigasHorizontales4);

    return roofGroup; // ¡MUY IMPORTANTE RETORNARLO!
}