import * as THREE from 'three';

export function createRopero() {
    const roperoGroup = new THREE.Group();
    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // TEXTURA DE MADERA (misma que el buró, wood_dark_001)
    // ---------------------------------------------------------------
    const maderaDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const maderaNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const maderaRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    maderaDiffuse.colorSpace = THREE.SRGBColorSpace;
    [maderaDiffuse, maderaNormal, maderaRough].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(1, 2); // el ropero es más alto que el buró, un poco más de repetición vertical
    });

    const maderaMat = new THREE.MeshStandardMaterial({
        map: maderaDiffuse,
        normalMap: maderaNormal,
        normalScale: new THREE.Vector2(0.3, 0.3),
        roughnessMap: maderaRough,
        color: 0x2E2418, // más claro que negro puro, para que se vea el grano (antes ~0x1A1408)
        roughness: 0.6,
    });

    // Metal de las manijas -> bronce oscuro, NO gris claro (antes muy contrastante)
    const manijaMat = new THREE.MeshStandardMaterial({
        color: 0x7A6248,
        metalness: 0.8,
        roughness: 0.35,
    });



    // --- TAPA SUPERIOR 
    const tapaGeoSup = new THREE.BoxGeometry(7.2, 1.511, 19.2); // más ancha/profunda que el cuerpo <- AJUSTAR
    const tapaSuperior = new THREE.Mesh(tapaGeoSup, maderaMat);
    tapaSuperior.position.set(-41.102, 26.745, 39.124); // <- AJUSTAR
    roperoGroup.add(tapaSuperior);

    // --- TAPA INFERIOR 
    const tapaGeoInf = new THREE.BoxGeometry(7.2, 1.3, 17.759); // más ancha/profunda que el cuerpo <- AJUSTAR
    const tapaInferior = new THREE.Mesh(tapaGeoInf, maderaMat);
    tapaInferior.position.set(-41.102, 1.255, 39.73); // <- AJUSTAR
    roperoGroup.add(tapaInferior);

    // --- TAPA TRASERA 
    const tapaGeoTrasera = new THREE.BoxGeometry(0.744, 24.084, 14.4); // más ancha/profunda que el cuerpo <- AJUSTAR
    const tapaTrasera = new THREE.Mesh(tapaGeoTrasera, maderaMat);
    tapaTrasera.position.set(-44.33, 13.947, 39.124); // <- AJUSTAR
    roperoGroup.add(tapaTrasera);

    // --- TAPA IZQUIERDA 
    const tapaGeoIzq = new THREE.BoxGeometry(2.4, 25.301, 0.502); // más ancha/profunda que el cuerpo <- AJUSTAR
    const tapaIzquierda = new THREE.Mesh(tapaGeoIzq, maderaMat);
    tapaIzquierda.position.set(-41.102, 13.338, 48.473); // <- AJUSTAR
    roperoGroup.add(tapaIzquierda);

    // --- TAPA DERECHA 
    const tapaGeoDer = new THREE.BoxGeometry(2.4, 25.689, 0.502); // más ancha/profunda que el cuerpo <- AJUSTAR
    const tapaDerecha = new THREE.Mesh(tapaGeoDer, maderaMat);
    tapaDerecha.position.set(-41.102, 13.532, 29.775); // <- AJUSTAR
    roperoGroup.add(tapaDerecha);

    // --- PUERTA
    const puertaGeo = new THREE.BoxGeometry(0.358, 24.084, 12); // <- AJUSTAR
    const puerta = new THREE.Mesh(puertaGeo, maderaMat);
    puerta.position.set(-38.215, 13.947, 39.124); // <- AJUSTAR
    roperoGroup.add(puerta);

    // --- PANEL HUNDIDO  ---
    const panelHundidoVerticalGeo = new THREE.BoxGeometry(0.372, 24.084, 1.2); // más chico que la puerta, sobresale poco en Z <- AJUSTAR
    const panelHundidoHorizontalGeo = new THREE.BoxGeometry(6.128, 1.3, 4.713); // más chico que la puerta, sobresale poco en Y <- AJUSTAR
    //PANEL HUNDIDO EN EL LADO IZQUIERDO DEL ROPERO
    const panelHundidoIzq = new THREE.Mesh(panelHundidoVerticalGeo, maderaMat);
    panelHundidoIzq.position.set(-38.016, 13.947, 45.724); // <- AJUSTAR
    roperoGroup.add(panelHundidoIzq);

    const panelHundidoDer = new THREE.Mesh(panelHundidoVerticalGeo, maderaMat);
    panelHundidoDer.position.set(-38.016, 13.947, 39.811); // <- AJUSTAR
    roperoGroup.add(panelHundidoDer);

    const panelHundidoHorizontalSup = new THREE.Mesh(panelHundidoHorizontalGeo, maderaMat);
    panelHundidoHorizontalSup.position.set(-40.894, 25.339, 42.768);
    roperoGroup.add(panelHundidoHorizontalSup);

    const panelHundidoHorizontalInf = new THREE.Mesh(panelHundidoHorizontalGeo, maderaMat);
    panelHundidoHorizontalInf.position.set(-40.894, 2.555, 42.768);
    roperoGroup.add(panelHundidoHorizontalInf);

    // --- MANIJA IZQUIERDA (cilindro VERTICAL, no rotado como el del buró) ---
    const manijaIzqGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 12); // radio, radio, largo, segmentos <- AJUSTAR
    const manijaIzq = new THREE.Mesh(manijaIzqGeo, manijaMat);
    // sin rotación: el cilindro por defecto ya es vertical (eje Y), correcto para manija de puerta
    manijaIzq.position.set(-37.502, 12.911, 39.68); // <- AJUSTAR, cerca del borde central de la puerta
    roperoGroup.add(manijaIzq);

    //PANEL HUNDIDO EN EL LADO DERECHO DEL ROPERO
    const panelHundidoIzqDer = new THREE.Mesh(panelHundidoVerticalGeo, maderaMat);
    panelHundidoIzqDer.position.set(-38.016, 13.947, 38.511); // <- AJUSTAR
    roperoGroup.add(panelHundidoIzqDer);

    const panelHundidoDerDer = new THREE.Mesh(panelHundidoVerticalGeo, maderaMat);
    panelHundidoDerDer.position.set(-38.016, 13.947, 32.524); // <- AJUSTAR
    roperoGroup.add(panelHundidoDerDer);

    const panelHundidoHorizontalSupDer = new THREE.Mesh(panelHundidoHorizontalGeo, maderaMat);
    panelHundidoHorizontalSupDer.position.set(-40.894, 25.339, 35.518);
    roperoGroup.add(panelHundidoHorizontalSupDer);

    const panelHundidoHorizontalInfDer = new THREE.Mesh(panelHundidoHorizontalGeo, maderaMat);
    panelHundidoHorizontalInfDer.position.set(-40.894, 2.555, 35.518);
    roperoGroup.add(panelHundidoHorizontalInfDer);

    // --- MANIJA DERECHA ---
    const manijaDerGeo = new THREE.CylinderGeometry(0.2, 0.2, 4, 12); // <- AJUSTAR
    const manijaDer = new THREE.Mesh(manijaDerGeo, manijaMat);
    manijaDer.position.set(-37.502, 12.911, 38.516); // <- AJUSTAR
    roperoGroup.add(manijaDer);

    // --- PIES (4, más chicos que las patas del buró, este mueble es más pesado/estático) ---
    const pieTraseroGeo = new THREE.BoxGeometry(2.4, 28, 2.4); // <- AJUSTAR
    const pieTraseroIzquierdo = new THREE.Mesh(pieTraseroGeo, maderaMat);
    pieTraseroIzquierdo.position.set(-43.502, 13.5, 47.524);
    roperoGroup.add(pieTraseroIzquierdo);

    const pieTraseroDerecho = new THREE.Mesh(pieTraseroGeo, maderaMat);
    pieTraseroDerecho.position.set(-43.502, 13.5, 30.724);
    roperoGroup.add(pieTraseroDerecho);

    const pieFrontalGeo = new THREE.BoxGeometry(2.4, 28, 1.2); // <- AJUSTAR
    const pieFrontalIzquierdo = new THREE.Mesh(pieFrontalGeo, maderaMat);
    pieFrontalIzquierdo.position.set(-38.702, 13.5, 48.124);
    roperoGroup.add(pieFrontalIzquierdo);
    const pieFrontalDerecho = new THREE.Mesh(pieFrontalGeo, maderaMat);
    pieFrontalDerecho.position.set(-38.702, 13.5, 30.124);
    roperoGroup.add(pieFrontalDerecho);

    const pieFrontalDelgado = new THREE.BoxGeometry(0.7, 26.489, 1.2);
    const pieFrontalDelgadoIzquierdo = new THREE.Mesh(pieFrontalDelgado, maderaMat);
    pieFrontalDelgadoIzquierdo.position.set(-37.852, 12.745, 46.924);
    roperoGroup.add(pieFrontalDelgadoIzquierdo);
    const pieFrontalDelgadoDerecho = new THREE.Mesh(pieFrontalDelgado, maderaMat);
    pieFrontalDelgadoDerecho.position.set(-37.852, 12.745, 31.324);
    roperoGroup.add(pieFrontalDelgadoDerecho);

    return roperoGroup; // ¡MUY IMPORTANTE RETORNARLO!
}