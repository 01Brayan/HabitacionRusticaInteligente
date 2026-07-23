import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export function createSofa() {
    const sofaGroup = new THREE.Group();
    sofaGroup.name = "sofaPrincipal";

    const textureLoader = new THREE.TextureLoader();

    const maderaDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 1);
    });

    // Variación de tono — piezas que sobresalen más claras, piezas hundidas más oscuras
    const maderaClaro = new THREE.MeshStandardMaterial({
        map: maderaDiffuse, normalMap: maderaNormal, roughnessMap: maderaRough,
        color: 0x2b1a10, roughness: 0.45,
    });
    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse, normalMap: maderaNormal, roughnessMap: maderaRough,
        color: 0x1a0f08, roughness: 0.5,
    });
    const maderaOscura = new THREE.MeshStandardMaterial({
        map: maderaDiffuse, normalMap: maderaNormal, roughnessMap: maderaRough,
        color: 0x100a05, roughness: 0.55,
    });

    // Tela del sofá — sin textura por ahora, solo color + rugosidad de tejido
    const telaMat = new THREE.MeshStandardMaterial({
        color: 0xb8b7b2, // gris claro, como tu referencia
        roughness: 0.9,
    });

    const telaMatSombra = new THREE.MeshStandardMaterial({
        color: 0x9a9994, // un tono más oscuro para las costuras/divisiones entre cojines
        roughness: 0.9,
    });

    // ---------------------------------------------------------------
    // 2. BASE / ESTRUCTURA DE MADERA
    // ---------------------------------------------------------------
    const baseGeo = new THREE.BoxGeometry(9.272, 1.039, 27.317); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const base = new THREE.Mesh(baseGeo, maderaMat);
    base.position.set(33.458, 4.055, -15.228); // <- AJUSTAR
    sofaGroup.add(base);
    //espaldero de madera 
    const espalderoGeo = new THREE.BoxGeometry(1.685, 7.563, 26.989); // Ancho(X), Alto(Y), Profundidad(Z) <- AJUSTAR
    const espaldero = new THREE.Mesh(espalderoGeo, maderaMat);
    espaldero.position.set(38.936, 7.477, -15.064); // <- AJUSTAR
    sofaGroup.add(espaldero);

    // Patas 
    const pataTraseraGeo = new THREE.BoxGeometry(1.685, 10.594, 2.06); // <- AJUSTAR
    
    const pataTraseraIzq = new THREE.Mesh(pataTraseraGeo, maderaOscura);
    pataTraseraIzq.position.set(38.936, 4.797, -29.589); // <- AJUSTAR
    const pataTraseraDer = new THREE.Mesh(pataTraseraGeo, maderaOscura);
    pataTraseraDer.position.set(38.936, 4.797, -0.539); // <- AJUSTAR
    sofaGroup.add(pataTraseraIzq, pataTraseraDer);
    //PATAS DELANTERAS CON DECORACION FRONTAL
    const pataDelanteraGeo = new THREE.BoxGeometry(1.873, 9.433, 1.873); // <- AJUSTAR, más angosta

    const pataDelanteraIzq = new THREE.Mesh(pataDelanteraGeo, maderaOscura);
    pataDelanteraIzq.position.set(28.728, 4.217, -29.495); // <- AJUSTAR
    const pataDelanteraDer = new THREE.Mesh(pataDelanteraGeo, maderaOscura);
    pataDelanteraDer.position.set(28.728, 4.217, -0.633); // <- AJUSTAR
    sofaGroup.add(pataDelanteraIzq,pataDelanteraDer );

    //marco inferior delante de la pata
    const marcoInferiorGeo = new THREE.BoxGeometry(0.281, 3.845, 1.873);
    const marcoInferiorIzqui = new THREE.Mesh(marcoInferiorGeo, maderaOscura);
    marcoInferiorIzqui.position.set(27.651, 1.423, -29.495);
    const marcoInferiorDer = new THREE.Mesh(marcoInferiorGeo, maderaOscura);
    marcoInferiorDer.position.set(27.651, 1.423, -0.633);
    sofaGroup.add(marcoInferiorIzqui,marcoInferiorDer );
    //madera central delantera de la pata
    const marcoCentralGeo = new THREE.BoxGeometry(0.281, 4.654, 1.212);
    const marcoCentralIzqui = new THREE.Mesh(marcoCentralGeo, maderaOscura);
    marcoCentralIzqui.position.set(27.651, 5.673, -29.495);
    const marcoCentralDer = new THREE.Mesh(marcoCentralGeo, maderaOscura);
    marcoCentralDer.position.set(27.651, 5.673, -0.633);
    sofaGroup.add(marcoCentralIzqui,marcoCentralDer );
    //marco superior delante de la pata
    const marcoSuperiorGeo = new THREE.BoxGeometry(0.281, 3.845, 1.873);
    const marcoSuperiorIzqui = new THREE.Mesh(marcoSuperiorGeo, maderaOscura);
    marcoSuperiorIzqui.position.set(27.651, 8.467, -29.495);
    const marcoSuperiorDer = new THREE.Mesh(marcoSuperiorGeo, maderaOscura);
    marcoSuperiorDer.position.set(27.651, 8.467, -0.633);
    sofaGroup.add(marcoSuperiorIzqui,marcoSuperiorDer );

    //marco laterales enumeradas del 1 al 4 de izquierda a derecha (tienen el mismo tamaño)
    const marcoLateralGeo = new THREE.BoxGeometry(0.281, 4.654, 0.331);
    const marcoLateral1 = new THREE.Mesh(marcoLateralGeo, maderaOscura);
    marcoLateral1.position.set(27.651, 5.673, -30.266);
    const marcoLateral2 = new THREE.Mesh(marcoLateralGeo, maderaOscura);
    marcoLateral2.position.set(27.651, 5.673, -28.724);
    const marcoLateral3 = new THREE.Mesh(marcoLateralGeo, maderaOscura);
    marcoLateral3.position.set(27.651, 5.673, -1.404);
    const marcoLateral4 = new THREE.Mesh(marcoLateralGeo, maderaOscura);
    marcoLateral4.position.set(27.651, 5.673, 0.138);
    sofaGroup.add(marcoLateral1,marcoLateral2,marcoLateral3,marcoLateral4 );

 // PARTE DELANTERA DEL SOFA (interada por un bloque de madera en el medio con un poco de profundidad) y 2 patas extra
    const pataDelanteraCentralGeo = new THREE.BoxGeometry(1.56, 2.578, 1.873); // <- AJUSTAR
    
    const pataDelanteraCentralIzq = new THREE.Mesh(pataDelanteraCentralGeo, maderaOscura);
    pataDelanteraCentralIzq.position.set(28.572, 0.789, -27.623); // <- AJUSTAR
    const pataDelanteraCentralDer = new THREE.Mesh(pataDelanteraCentralGeo, maderaOscura);
    pataDelanteraCentralDer.position.set(28.572, 0.789, -2.506); // <- AJUSTAR
    sofaGroup.add(pataDelanteraCentralIzq, pataDelanteraCentralDer);

    const zocaloFrenteSuperiorGeo = new THREE.BoxGeometry(1.311, 0.632, 26.99); // <- AJUSTAR
    const zocaloFrenteSuperior = new THREE.Mesh(zocaloFrenteSuperiorGeo, maderaOscura);
    zocaloFrenteSuperior.position.set(28.166, 4.151, -15.064); // <- AJUSTAR (borde delantero de la base)
    sofaGroup.add(zocaloFrenteSuperior);

    const zocaloFrenteCentralGeo = new THREE.BoxGeometry(1.311, 0.678, 26.99); // <- AJUSTAR
    const zocaloFrenteCentral = new THREE.Mesh(zocaloFrenteCentralGeo, maderaOscura);
    zocaloFrenteCentral.position.set(28.541, 3.496, -15.064); // <- AJUSTAR (borde delantero de la base)
    sofaGroup.add(zocaloFrenteCentral);

    const zocaloFrenteInferiorGeo = new THREE.BoxGeometry(0.749, 1.079, 26.99); // <- AJUSTAR
    const zocaloFrenteInferior = new THREE.Mesh(zocaloFrenteInferiorGeo, maderaOscura);
    zocaloFrenteInferior.position.set(28.166, 2.617, -15.064); // <- AJUSTAR (borde delantero de la base)
    sofaGroup.add(zocaloFrenteInferior);

    // ---------------------------------------------------------------
    // LATERAL DEL SOFA Y POSADOR DE BRAZOS
    // ---------------------------------------------------------------
//  crear 6 maderas 4 centrales de un color y los otros de sus laterales con otro color (parte inferior del posador de brazos)
// bloque superior e inferior
    const maderaLateralGeo = new THREE.BoxGeometry(8.429, 0.859, 1.685); // <- AJUSTAR
    const maderaLateralSuperiorIzquierda = new THREE.Mesh(maderaLateralGeo, maderaOscura);
    maderaLateralSuperiorIzquierda.position.set(33.879, 8.504, -29.401); // <- AJUSTAR (borde delantero de la base)
    const maderaLateralSuperiorDer = new THREE.Mesh(maderaLateralGeo, maderaOscura);
    maderaLateralSuperiorDer.position.set(33.879, 8.504, -0.727);
    sofaGroup.add(maderaLateralSuperiorIzquierda, maderaLateralSuperiorDer);

    const maderaLateralInferiorIzquierda = new THREE.Mesh(maderaLateralGeo, maderaOscura);
    maderaLateralInferiorIzquierda.position.set(33.879, 1.802, -29.401); // <- AJUSTAR (borde delantero de la base)
    const maderaLateralInferiorDerecha = new THREE.Mesh(maderaLateralGeo, maderaOscura);
    maderaLateralInferiorDerecha.position.set(33.879, 1.802, -0.727);
    sofaGroup.add(maderaLateralInferiorIzquierda, maderaLateralInferiorDerecha);
//maderas centrales (1 arriba y 4 abajo)
    const maderaCentralGeo = new THREE.BoxGeometry(8.429, 1.404, 1.077); // <- AJUSTAR
    const maderaCentralIzq1 = new THREE.Mesh(maderaCentralGeo, maderaOscura);
    maderaCentralIzq1.position.set(33.879, 7.372, -29.425); // <- AJUSTAR (borde delantero de la base)
    const maderaCentralIzq2 = new THREE.Mesh(maderaCentralGeo, maderaOscura);
    maderaCentralIzq2.position.set(33.879, 5.893, -29.425); 
    const maderaCentralIzq3 = new THREE.Mesh(maderaCentralGeo, maderaOscura);
    maderaCentralIzq3.position.set(33.879, 4.413, -29.425); // <- AJUSTAR (borde delantero de la base)
    const maderaCentralIzq4 = new THREE.Mesh(maderaCentralGeo, maderaOscura);
    maderaCentralIzq4.position.set(33.879, 2.934, -29.425); 
    sofaGroup.add(maderaCentralIzq1, maderaCentralIzq2,maderaCentralIzq3,maderaCentralIzq4);

    const maderaCentralDer1 = new THREE.Mesh(maderaCentralGeo, maderaOscura);
    maderaCentralDer1.position.set(33.879, 7.372, -0.824); // <- AJUSTAR (borde delantero de la base)
    const maderaCentralDer2 = new THREE.Mesh(maderaCentralGeo, maderaOscura);
    maderaCentralDer2.position.set(33.879, 5.893, -0.824); 
    const maderaCentralDer3 = new THREE.Mesh(maderaCentralGeo, maderaOscura);
    maderaCentralDer3.position.set(33.879, 4.413, -0.824); // <- AJUSTAR (borde delantero de la base)
    const maderaCentralDer4 = new THREE.Mesh(maderaCentralGeo, maderaOscura);
    maderaCentralDer4.position.set(33.879, 2.934, -0.824); 
    sofaGroup.add(maderaCentralDer1, maderaCentralDer2,maderaCentralDer3,maderaCentralDer4);

//POSADOR DE BRAZOS (contituido por 4 bloques 2 delgadas arriba, luego uno ancho y uno inferior delgado)
    const posadorInferiorGeo = new THREE.BoxGeometry(10.684, 0.266, 2.247); // <- AJUSTAR
    const posadorInferiorIzq = new THREE.Mesh(posadorInferiorGeo, maderaOscura);
    posadorInferiorIzq.position.set(32.751, 9.066, -29.495); // <- AJUSTAR (borde delantero de la base)
    const posadorInferiorDer = new THREE.Mesh(posadorInferiorGeo, maderaOscura);
    posadorInferiorDer.position.set(32.751, 9.066, -0.446);
    sofaGroup.add(posadorInferiorIzq, posadorInferiorDer );

    const posadorCentralGeo = new THREE.BoxGeometry(10.308, 0.561, 1.498); // <- AJUSTAR
    const posadorCentralIzq = new THREE.Mesh(posadorCentralGeo, maderaOscura);
    posadorCentralIzq.position.set(32.939, 9.479, -29.495); // <- AJUSTAR (borde delantero de la base)
    const posadorCentralDer = new THREE.Mesh(posadorCentralGeo, maderaOscura);
    posadorCentralDer.position.set(32.939, 9.479, -0.446);
    sofaGroup.add(posadorCentralIzq, posadorCentralDer );
//posador superior tiene 2 uno largo y otro abajo del largo que es mas corto.. 
    const posadorSuperiorLargoGeo = new THREE.BoxGeometry(12.23, 0.266, 2.06); // <- AJUSTAR
    const posadorSuperiorLargoIzqui = new THREE.Mesh(posadorSuperiorLargoGeo, maderaOscura);
    posadorSuperiorLargoIzqui.position.set(33.664, 10.159, -29.495); // <- AJUSTAR (borde delantero de la base)
    const posadorSuperiorLargoDer = new THREE.Mesh(posadorSuperiorLargoGeo, maderaOscura);
    posadorSuperiorLargoDer.position.set(33.664, 10.159, -0.446);
    sofaGroup.add(posadorSuperiorLargoIzqui, posadorSuperiorLargoDer );

    const posadorSuperiorCortoGeo = new THREE.BoxGeometry(10.426, 0.266, 1.817); // <- AJUSTAR
    const posadorSuperiorCortoIzqui = new THREE.Mesh(posadorSuperiorCortoGeo, maderaOscura);
    posadorSuperiorCortoIzqui.position.set(32.88, 9.893, -29.495); // <- AJUSTAR (borde delantero de la base)
    const posadorSuperiorCortoDer = new THREE.Mesh(posadorSuperiorCortoGeo, maderaOscura);
    posadorSuperiorCortoDer.position.set(32.88, 9.893, -0.446);
    sofaGroup.add(posadorSuperiorCortoIzqui, posadorSuperiorCortoDer );
//falta cogines de asiento y de respaldo 

const loader = new GLTFLoader();
loader.load('src/assets/models/Sofa.glb', function (gltf) {
    const cojinesImportados = gltf.scene;

    cojinesImportados.traverse((child) => {
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });

    cojinesImportados.scale.set(1, 1, 1); // <- AJUSTAR
    cojinesImportados.position.set(0, 0, 0); // <- AJUSTAR, para que calcen sobre tu marco de madera

    sofaGroup.add(cojinesImportados);
}, undefined, function (error) {
    console.error('Error cargando los cojines del sofá:', error);
});

    return sofaGroup;
}