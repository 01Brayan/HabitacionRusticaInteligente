//PARED FRONTAL (VENTANAS, PAREDES, COLUMNAS Y PUERTA)
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createWallFront() {
    const wallGroup = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // CARGA DE TEXTURAS (Madera)
    // ---------------------------------------------------------------
    //PARED
    const paredDiffuse = textureLoader.load('src/assets/textures/plank_wall/plank_wall_diff_2k.jpg');
    const paredNormal  = textureLoader.load('src/assets/textures/plank_wall/plank_wall_nor_gl_2k.jpg');
    const paredRough   = textureLoader.load('src/assets/textures/plank_wall/plank_wall_rough_2k.jpg');
    const paredAO      = textureLoader.load('src/assets/textures/plank_wall/plank_wall_ao_2k.jpg');

    paredDiffuse.colorSpace = THREE.SRGBColorSpace;
    [paredDiffuse, paredNormal, paredRough, paredAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 3);
    });
    // COLUMNAS
    const maderaDiffuse = textureLoader.load('src/assets/textures/rough_wood/rough_wood_diff_2k.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/rough_wood/rough_wood_nor_gl_2k.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/rough_wood/rough_wood_rough_2k.jpg');
    const maderaAO      = textureLoader.load('src/assets/textures/rough_wood/rough_wood_ao_2k.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough, maderaAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
        tex.center.set(0.5, 0.5);
    });
    //TECHO
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
    const wallMat = new THREE.MeshStandardMaterial({
        map: paredDiffuse,
        normalMap: paredNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: paredRough,
        aoMap: paredAO,
        color: 0x5C4530,
        roughness: 1.0,
    });

    const maderaOscuraMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(1.0, 1.0),
        roughnessMap: maderaRough,
        aoMap: maderaAO,
        color: 0x3A2718,
        roughness: 1.0,
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
    const vidrioMat = new THREE.MeshPhysicalMaterial({
        color: 0xBFD9E8,
        transparent: true,
        opacity: 0.25,
        roughness: 0.05,
        metalness: 0,
        depthWrite: false,
    });
    //PILARES
    const pilarGeo = new THREE.BoxGeometry(4, 33.402, 4.575);
    const pilarIzquierdo = new THREE.Mesh(pilarGeo, maderaOscuraMat);
    pilarIzquierdo.position.set(44.988, 15.318, -60.287);
    const pilarDerecho = new THREE.Mesh(pilarGeo, maderaOscuraMat);
    pilarDerecho.position.set(-45.737, 15.318, -60.287);
    wallGroup.add(pilarIzquierdo, pilarDerecho);
    //PAREDES
    const paredInferiorGeo = new THREE.BoxGeometry(2.5, 10.685, 23.098);
    const paredInferiorIzquierdo = new THREE.Mesh(paredInferiorGeo, wallMat);
    paredInferiorIzquierdo.position.set(26.005, 4.842, -59.479);
    paredInferiorIzquierdo.rotation.y = THREE.MathUtils.degToRad(90);
    const paredInferiorDerecho = new THREE.Mesh(paredInferiorGeo, wallMat);
    paredInferiorDerecho.position.set(-26.378, 4.842, -59.479);
    paredInferiorDerecho.rotation.y = THREE.MathUtils.degToRad(90);
    wallGroup.add(paredInferiorIzquierdo, paredInferiorDerecho);
    //--pared cercana a la puerta
    const paredDelgadaGeo = new THREE.BoxGeometry(2.5, 32.018, 5.507);
    const paredDelgadaIzquierda = new THREE.Mesh(paredDelgadaGeo, wallMat);
    paredDelgadaIzquierda.position.set(11.703, 15.509, -59.479);
    paredDelgadaIzquierda.rotation.y = THREE.MathUtils.degToRad(90);
    const paredDelgadaDerecha = new THREE.Mesh(paredDelgadaGeo, wallMat);
    paredDelgadaDerecha.position.set(-12.076, 15.509, -59.479);
    paredDelgadaDerecha.rotation.y = THREE.MathUtils.degToRad(90);
    wallGroup.add(paredDelgadaIzquierda, paredDelgadaDerecha);
    //--pared lejana a la puerta
    const paredGruesaGeo = new THREE.BoxGeometry(2.5, 33.629, 5.434);
    const paredGruesaIzquierda = new THREE.Mesh(paredGruesaGeo, wallMat);
    paredGruesaIzquierda.position.set(40.271, 16.315, -59.479);
    paredGruesaIzquierda.rotation.y = THREE.MathUtils.degToRad(90);
    const paredGruesaDerecha = new THREE.Mesh(paredGruesaGeo, wallMat);
    paredGruesaDerecha.position.set(-40.911, 16.687, -59.479);
    paredGruesaDerecha.rotation.y = THREE.MathUtils.degToRad(90);
    wallGroup.add(paredGruesaIzquierda, paredGruesaDerecha);
    //pared superior a la puerta
    const paredSuperiorGeo = new THREE.BoxGeometry(2.5, 9.36, 29.285);
    const paredSuperior = new THREE.Mesh(paredSuperiorGeo, wallMat);
    paredSuperior.position.set(-0.186, 36.198, -59.479);
    paredSuperior.rotation.y = THREE.MathUtils.degToRad(90);
    wallGroup.add(paredSuperior);
    //pared diagonal izquierda
    const paredDiagonaGeo = new THREE.BoxGeometry(2.66, 63.889, 2.5);
    const paredDiagonalIzquierda = new THREE.Mesh(paredDiagonaGeo, wallMat);
    paredDiagonalIzquierda.position.set(19.879, 49.139, -59.479);
    paredDiagonalIzquierda.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    const paredDiagonalDerecha = new THREE.Mesh(paredDiagonaGeo, wallMat);
    paredDiagonalDerecha.position.set(-22.401, 48.59, -59.479);
    paredDiagonalDerecha.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    wallGroup.add(paredDiagonalIzquierda,paredDiagonalDerecha);
    //TECHOSUPERIOR
    const techoSuperiorGeo = new THREE.BoxGeometry(3.03, 67.632, 12.961);
    const techoSuperiorIzquierdo = new THREE.Mesh(techoSuperiorGeo, roofMat);
    techoSuperiorIzquierdo.position.set(25.717, 50.596, -62.109);
    techoSuperiorIzquierdo.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    const techoSuperiorDerecho = new THREE.Mesh(techoSuperiorGeo, roofMat);
    techoSuperiorDerecho.position.set(-25.624, 52.181, -62.109);
    techoSuperiorDerecho.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    wallGroup.add(techoSuperiorIzquierdo, techoSuperiorDerecho);
    //TECHO INFERIOR
    const techoInferiorGeo = new THREE.BoxGeometry(2.024, 66.5, 8.759);
    const techoInferiorIzquierdo = new THREE.Mesh(techoInferiorGeo, maderaOscuraMat);
    techoInferiorIzquierdo.position.set(22.385, 50.094, -63.41);
    techoInferiorIzquierdo.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    const techoInferiorDerecho = new THREE.Mesh(techoInferiorGeo, maderaOscuraMat);
    techoInferiorDerecho.position.set(-23.566, 50.609, -63.41);
    techoInferiorDerecho.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    wallGroup.add(techoInferiorIzquierdo, techoInferiorDerecho);
    //PUERTA
    //pilarVertical
    const pilarVerticalGeo = new THREE.BoxGeometry(2, 30.42, 3.85);
    const pilarVerticalIzquierdo = new THREE.Mesh(pilarVerticalGeo, maderaOscuraMat);
    pilarVerticalIzquierdo.position.set(8.45, 14.279, -60.154);
    const pilarVerticalDerecho = new THREE.Mesh(pilarVerticalGeo, maderaOscuraMat);
    pilarVerticalDerecho.position.set(-8.322, 14.279, -60.154);
    wallGroup.add(pilarVerticalIzquierdo, pilarVerticalDerecho);
    //marcoHorizontalPuerta
    const marcoHorizontalPuertaGeo = new THREE.BoxGeometry(20.351, 2.029, 4.079);
    const marcoHorizontalPuerta = new THREE.Mesh(marcoHorizontalPuertaGeo, maderaOscuraMat);
    marcoHorizontalPuerta.position.set(-0.03, 30.504, -60.039);
    wallGroup.add(marcoHorizontalPuerta);

    //ventanas inferiores
    const marcoVeticalExteriorCortoGeo = new THREE.BoxGeometry(1.911, 21.843, 1.5);
    const marcoVerticalExteriorCortoIzquierdo = new THREE.Mesh(marcoVeticalExteriorCortoGeo, maderaOscuraMat);
    marcoVerticalExteriorCortoIzquierdo.position.set(36.599, 22.208, -59.657);
    const marcoVerticalExteriorCortoDerecho = new THREE.Mesh(marcoVeticalExteriorCortoGeo, maderaOscuraMat);
    marcoVerticalExteriorCortoDerecho.position.set(-36.972, 22.47, -59.657);
    wallGroup.add(marcoVerticalExteriorCortoIzquierdo, marcoVerticalExteriorCortoDerecho);

    const marcoVeticalExteriorLargoGeo = new THREE.BoxGeometry(1.993, 29.592, 1.5);
    const marcoVerticalExteriorLargoIzquierdo = new THREE.Mesh(marcoVeticalExteriorLargoGeo, maderaOscuraMat);
    marcoVerticalExteriorLargoIzquierdo.position.set(15.453, 26.082, -59.657);
    const marcoVerticalExteriorLargoDerecho = new THREE.Mesh(marcoVeticalExteriorLargoGeo, maderaOscuraMat);
    marcoVerticalExteriorLargoDerecho.position.set(-15.826, 26.082, -59.657);
    wallGroup.add(marcoVerticalExteriorLargoIzquierdo, marcoVerticalExteriorLargoDerecho);

    const marcoHorizontalExteriorGeo = new THREE.BoxGeometry(24.039, 1.5, 3);
    const marcoHorizontalExteriorIzquierdo = new THREE.Mesh(marcoHorizontalExteriorGeo, maderaOscuraMat);
    marcoHorizontalExteriorIzquierdo.position.set(25.969, 10.935, -59.579);
    const marcoHorizontalExteriorDerecho = new THREE.Mesh(marcoHorizontalExteriorGeo, maderaOscuraMat);
    marcoHorizontalExteriorDerecho.position.set(-26.36, 10.935, -59.579);
    wallGroup.add(marcoHorizontalExteriorIzquierdo, marcoHorizontalExteriorDerecho);

    const marcoHorizontalInteriorGruesoGeo = new THREE.BoxGeometry(19.194, 1.5, 1.5);
    const marcoHorizontalInteriorGruesoIzquierdo = new THREE.Mesh(marcoHorizontalInteriorGruesoGeo, maderaOscuraMat);
    marcoHorizontalInteriorGruesoIzquierdo.position.set(26.046, 12.036, -59.683);
    const marcoHorizontalInteriorGruesoDerecho = new THREE.Mesh(marcoHorizontalInteriorGruesoGeo, maderaOscuraMat);
    marcoHorizontalInteriorGruesoDerecho.position.set(-26.419, 12.036, -59.683);
    wallGroup.add(marcoHorizontalInteriorGruesoIzquierdo, marcoHorizontalInteriorGruesoDerecho);

    const marcoHorizontalInteriorGruesoSuperiorGeo = new THREE.BoxGeometry(9, 1.5, 1.5);
    const marcoHorizontalInteriorGruesoSuperiorIzquierdo = new THREE.Mesh(marcoHorizontalInteriorGruesoSuperiorGeo, maderaOscuraMat);
    marcoHorizontalInteriorGruesoSuperiorIzquierdo.position.set(20.95, 40.128, -59.683);
    const marcoHorizontalInteriorGruesoSuperiorDerecho = new THREE.Mesh(marcoHorizontalInteriorGruesoSuperiorGeo, maderaOscuraMat);
    marcoHorizontalInteriorGruesoSuperiorDerecho.position.set(-21.322, 40.128, -59.683);
    wallGroup.add(marcoHorizontalInteriorGruesoSuperiorIzquierdo, marcoHorizontalInteriorGruesoSuperiorDerecho);

    const marcoVerticalInteriorGruesoGeo = new THREE.BoxGeometry(1.5, 28.037, 2);
    const marcoVerticalInteriorGruesoIzquierdo = new THREE.Mesh(marcoVerticalInteriorGruesoGeo, maderaOscuraMat);
    marcoVerticalInteriorGruesoIzquierdo.position.set(25.893, 26.805, -59.46);
    const marcoVerticalInteriorGruesoDerecho = new THREE.Mesh(marcoVerticalInteriorGruesoGeo, maderaOscuraMat);
    marcoVerticalInteriorGruesoDerecho.position.set(-26.572, 26.805, -59.46);
    wallGroup.add(marcoVerticalInteriorGruesoIzquierdo, marcoVerticalInteriorGruesoDerecho);

    const marcoHorizontalInteriorDelgadoGeo = new THREE.BoxGeometry(19.194, 1, 1);
    const marcoHorizontalInteriorDelgadoIzquierdo = new THREE.Mesh(marcoHorizontalInteriorDelgadoGeo, maderaOscuraMat);
    marcoHorizontalInteriorDelgadoIzquierdo.position.set(26.046, 26.286, -59.683);
    const marcoHorizontalInteriorDelgadoDerecho = new THREE.Mesh(marcoHorizontalInteriorDelgadoGeo, maderaOscuraMat);
    marcoHorizontalInteriorDelgadoDerecho.position.set(-26.419, 26.286, -59.683);
    wallGroup.add(marcoHorizontalInteriorDelgadoIzquierdo, marcoHorizontalInteriorDelgadoDerecho);

    const marcoVerticalInteriorDelgadoGeo = new THREE.BoxGeometry(0.5, 26.591, 0.4);
    const marcoVerticalInteriorDelgado1 = new THREE.Mesh(marcoVerticalInteriorDelgadoGeo, maderaOscuraMat);
    marcoVerticalInteriorDelgado1.position.set(30.893, 26.082, -59.683);
    const marcoVerticalInteriorDelgado2 = new THREE.Mesh(marcoVerticalInteriorDelgadoGeo, maderaOscuraMat);
    marcoVerticalInteriorDelgado2.position.set(20.699, 26.082, -59.683);
    const marcoVerticalInteriorDelgado3 = new THREE.Mesh(marcoVerticalInteriorDelgadoGeo, maderaOscuraMat);
    marcoVerticalInteriorDelgado3.position.set(-21.072, 26.082, -59.683);
    const marcoVerticalInteriorDelgado4 = new THREE.Mesh(marcoVerticalInteriorDelgadoGeo, maderaOscuraMat);
    marcoVerticalInteriorDelgado4.position.set(-31.266, 26.082, -59.683);
    wallGroup.add(marcoVerticalInteriorDelgado1, marcoVerticalInteriorDelgado2, marcoVerticalInteriorDelgado3, marcoVerticalInteriorDelgado4);

    const marcoHorizontalInteriorMuyDelgadoGeo = new THREE.BoxGeometry(19.194, 0.5, 0.5);
    const marcoHorizontalInteriorMuyDelgadoSuperiorIzquierdo = new THREE.Mesh(marcoHorizontalInteriorMuyDelgadoGeo, maderaOscuraMat);
    marcoHorizontalInteriorMuyDelgadoSuperiorIzquierdo.position.set(26.046, 33.036, -59.683);
    const marcoHorizontalInteriorMuyDelgadoSuperiorDerecho = new THREE.Mesh(marcoHorizontalInteriorMuyDelgadoGeo, maderaOscuraMat);
    marcoHorizontalInteriorMuyDelgadoSuperiorDerecho.position.set(-26.419, 33.036, -59.683);
    wallGroup.add(marcoHorizontalInteriorMuyDelgadoSuperiorIzquierdo, marcoHorizontalInteriorMuyDelgadoSuperiorDerecho);
    const marcoHorizontalInteriorMuyDelgadoInferiorIzquierdo = new THREE.Mesh(marcoHorizontalInteriorMuyDelgadoGeo, maderaOscuraMat);
    marcoHorizontalInteriorMuyDelgadoInferiorIzquierdo.position.set(26.046, 19.286, -59.683);
    const marcoHorizontalInteriorMuyDelgadoInferiorDerecho = new THREE.Mesh(marcoHorizontalInteriorMuyDelgadoGeo, maderaOscuraMat);
    marcoHorizontalInteriorMuyDelgadoInferiorDerecho.position.set(-26.419, 19.286, -59.683);
    wallGroup.add(marcoHorizontalInteriorMuyDelgadoInferiorIzquierdo, marcoHorizontalInteriorMuyDelgadoInferiorDerecho);
    const vidrioGeo = new THREE.BoxGeometry(19.194, 27.518, 0.1);
    const vidrioIzquierdo = new THREE.Mesh(vidrioGeo, vidrioMat);
    vidrioIzquierdo.position.set(26.046, 26.546, -59.608);
    const vidrioDerecho = new THREE.Mesh(vidrioGeo, vidrioMat);
    vidrioDerecho.position.set(-26.419, 26.546, -59.608);
    wallGroup.add(vidrioIzquierdo, vidrioDerecho);

    //viga superior gruesa
    const vigaSuperiorGruesaGeo = new THREE.BoxGeometry(3, 3.348, 68.609);
    const vigaSuperiorGruesa = new THREE.Mesh(vigaSuperiorGruesaGeo, maderaOscuraMat);
    vigaSuperiorGruesa.position.set(-0.897, 42.552, -58.916);
    vigaSuperiorGruesa.rotation.y = THREE.MathUtils.degToRad(90); // estaba a 90° en Y
    wallGroup.add(vigaSuperiorGruesa);

    //ventana superior
    const marcoVerticalSuperiorGruesoGeo = new THREE.BoxGeometry(3, 19, 2);
    const marcoVerticalSuperiorGrueso = new THREE.Mesh(marcoVerticalSuperiorGruesoGeo, maderaOscuraMat);
    marcoVerticalSuperiorGrueso.position.set(-0.446, 53.726, -58.96);
    marcoVerticalSuperiorGrueso.rotation.y = THREE.MathUtils.degToRad(90); // estaba a 90° en Y
    wallGroup.add(marcoVerticalSuperiorGrueso);

    const marcoHorizontalInferiorLargoGeo = new THREE.BoxGeometry(2.01, 1, 22.06);
    const marcoHorizontalInferiorLargoIzquierdo = new THREE.Mesh(marcoHorizontalInferiorLargoGeo, maderaOscuraMat);
    marcoHorizontalInferiorLargoIzquierdo.position.set(11.584, 44.726, -58.911);
    marcoHorizontalInferiorLargoIzquierdo.rotation.y = THREE.MathUtils.degToRad(90);
    const marcoHorizontalInferiorLargoDerecho = new THREE.Mesh(marcoHorizontalInferiorLargoGeo, maderaOscuraMat);
    marcoHorizontalInferiorLargoDerecho.position.set(-12.476, 44.726, -58.911);
    marcoHorizontalInferiorLargoDerecho.rotation.y = THREE.MathUtils.degToRad(90);
    wallGroup.add(marcoHorizontalInferiorLargoIzquierdo, marcoHorizontalInferiorLargoDerecho);

    const marcoHorizontalSuperiorCortoGeo = new THREE.BoxGeometry(2.01, 1, 22.963);
    const marcoHorizontalSuperiorCorto = new THREE.Mesh(marcoHorizontalSuperiorCortoGeo, maderaOscuraMat);
    marcoHorizontalSuperiorCorto.position.set(-0.446, 54.226, -58.911);
    marcoHorizontalSuperiorCorto.rotation.y = THREE.MathUtils.degToRad(90); // estaba a 90° en Y
    wallGroup.add(marcoHorizontalSuperiorCorto);

    const marcoVerticalSuperiorCortoGeo = new THREE.BoxGeometry(2, 8.5, 1);
    const marcoVerticalSuperiorCortoIzquierdo = new THREE.Mesh(marcoVerticalSuperiorCortoGeo, maderaOscuraMat);
    marcoVerticalSuperiorCortoIzquierdo.position.set(10.535, 49.476, -58.906);
    const marcoVerticalSuperiorCortoDerecho = new THREE.Mesh(marcoVerticalSuperiorCortoGeo, maderaOscuraMat);
    marcoVerticalSuperiorCortoDerecho.position.set(-11.428, 49.476, -58.906);
    wallGroup.add(marcoVerticalSuperiorCortoIzquierdo, marcoVerticalSuperiorCortoDerecho);

    const marcoVerticalSuperiorLargoGeo = new THREE.BoxGeometry(2, 17.765, 1);
    const marcoVerticalSuperiorLargoIzquierdo = new THREE.Mesh(marcoVerticalSuperiorLargoGeo, maderaOscuraMat);
    marcoVerticalSuperiorLargoIzquierdo.position.set(-1.946, 54.108, -58.906);
    const marcoVerticalSuperiorLargoDerecho = new THREE.Mesh(marcoVerticalSuperiorLargoGeo, maderaOscuraMat);
    marcoVerticalSuperiorLargoDerecho.position.set(1.054, 53.924, -58.906);
    wallGroup.add(marcoVerticalSuperiorLargoIzquierdo, marcoVerticalSuperiorLargoDerecho);

    const vidrioSuperiorLargoGeo = new THREE.BoxGeometry(44.987, 8.5, 0.1);
    const vidrioSuperiorLargo = new THREE.Mesh(vidrioSuperiorLargoGeo, vidrioMat);
    vidrioSuperiorLargo.position.set(-1.903, 49.476, -58.743);
    wallGroup.add(vidrioSuperiorLargo);

    const vidrioSuperiorCortoGeo = new THREE.BoxGeometry(22.154, 8.5, 0.1);
    const vidrioSuperiorCorto = new THREE.Mesh(vidrioSuperiorCortoGeo, vidrioMat);
    vidrioSuperiorCorto.position.set(-0.851, 58.976, -58.743);
    wallGroup.add(vidrioSuperiorCorto);

    const diagonalSuperiorDelgadoGeo = new THREE.BoxGeometry(1.5, 49.046, 3.544);
    const diagonalSuperiorDelgadoIzquierdo = new THREE.Mesh(diagonalSuperiorDelgadoGeo, maderaOscuraMat);
    diagonalSuperiorDelgadoIzquierdo.position.set(17.717, 48.273, -58.688);
    diagonalSuperiorDelgadoIzquierdo.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(-50));
    const diagonalSuperiorDelgadoDerecho = new THREE.Mesh(diagonalSuperiorDelgadoGeo, maderaOscuraMat);
    diagonalSuperiorDelgadoDerecho.position.set(-19.256, 48.558, -58.688);
    diagonalSuperiorDelgadoDerecho.rotation.set(0, THREE.MathUtils.degToRad(180), THREE.MathUtils.degToRad(50));
    wallGroup.add(diagonalSuperiorDelgadoIzquierdo, diagonalSuperiorDelgadoDerecho);

    //Importar puerta desde archivo GLB
    const loader = new GLTFLoader();
    loader.load('src/assets/models/Puerta.glb', function (gltf) {
        const Puerta = gltf.scene;
        Puerta.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        Puerta.scale.set(1, 1, 1);
        Puerta.position.set(0, 0, 0);
        wallGroup.add(Puerta);
    }, undefined, function (error) {
        console.error('Error cargando la puerta:', error);
    });

    // Sombras: la pared proyecta sombras, el vidrio no
    wallGroup.traverse((child) => {
        if (child.isMesh) {
            if (child.material === vidrioMat) {
                child.castShadow = false;
            } else {
                child.castShadow = true;
            }
            child.receiveShadow = true;
        }
    });

    return wallGroup;
}
