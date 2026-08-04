import * as THREE from 'three';

/**
 * Carga e instancia las cortinas 3D (Cortinas_tela.glb) con animación procedimental de pliegues y arrugas en 3D.
 */
export function createCortinaInstance(config = {}) {
    const cortinaGroup = new THREE.Group();
    cortinaGroup.name = config.name || "CortinaModelo";

    const textureLoader = new THREE.TextureLoader();

    // Textura de tela (linen) - misma receta que las cortinas de WallBack
    const diffuseMap = textureLoader.load('src/assets/textures/linen/linen_diff_2k.jpg');
    const normalMap  = textureLoader.load('src/assets/textures/linen/linen_nor_gl_2k.jpg');
    const roughMap   = textureLoader.load('src/assets/textures/linen/linen_rough_2k.jpg');
    const aoMap      = textureLoader.load('src/assets/textures/linen/linen_ao_2k.jpg');

    diffuseMap.colorSpace = THREE.SRGBColorSpace;
    [diffuseMap, normalMap, roughMap, aoMap].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 2);
    });

    // En lugar de usar el GLB, creamos la geometría de forma procedimental
    // para evitar capas extra y mejorar el rendimiento.
    const meshEntries = [];
    let animProgress = 0.0; // 0.0 = Cerrada, 1.0 = Abierta
    let targetProgress = 0.0;
    let isOpen = false;

    const targetWidth = config.targetWidth || 18.0;
    const targetHeight = config.targetHeight || 12.2;
    
    const material = new THREE.MeshStandardMaterial({
        map: diffuseMap,
        normalMap: normalMap,
        roughnessMap: roughMap,
        aoMap: aoMap,
        color: 0xD9CFB8,      // tono crema/lino, como WallBack
        roughness: 0.9,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
    });

    const modelWrapper = new THREE.Group();

    // Panel Izquierdo (x de -1 a 0)
    const geoIzq = new THREE.PlaneGeometry(1, 2, 32, 16);
    geoIzq.translate(-0.5, 0, 0); // Vértices irán de -1 a 0
    const uvIzq = geoIzq.attributes.uv;
    for (let i = 0; i < uvIzq.count; i++) {
        uvIzq.setX(i, uvIzq.getX(i) * 0.5); // 0 a 0.5
    }
    const meshIzq = new THREE.Mesh(geoIzq, material);
    meshIzq.castShadow = true;
    meshIzq.receiveShadow = true;
    if (meshIzq.geometry.attributes.uv && !meshIzq.geometry.attributes.uv2) {
        meshIzq.geometry.setAttribute('uv2', meshIzq.geometry.attributes.uv);
    }
    
    // Panel Derecho (x de 0 a 1)
    const geoDer = new THREE.PlaneGeometry(1, 2, 32, 16);
    geoDer.translate(0.5, 0, 0); // Vértices irán de 0 a 1
    const uvDer = geoDer.attributes.uv;
    for (let i = 0; i < uvDer.count; i++) {
        uvDer.setX(i, 0.5 + uvDer.getX(i) * 0.5); // 0.5 a 1.0
    }
    const meshDer = new THREE.Mesh(geoDer, material);
    meshDer.castShadow = true;
    meshDer.receiveShadow = true;
    if (meshDer.geometry.attributes.uv && !meshDer.geometry.attributes.uv2) {
        meshDer.geometry.setAttribute('uv2', meshDer.geometry.attributes.uv);
    }

    modelWrapper.add(meshIzq);
    modelWrapper.add(meshDer);

    meshEntries.push({
        mesh: meshIzq,
        origPositions: new Float32Array(meshIzq.geometry.attributes.position.array),
        isLeft: true
    });
    meshEntries.push({
        mesh: meshDer,
        origPositions: new Float32Array(meshDer.geometry.attributes.position.array),
        isLeft: false
    });

    const scaleX = config.scaleX || (targetWidth / 2.0);
    const scaleY = config.scaleY || (targetHeight / 2.0);
    const scaleZ = config.scaleZ || scaleX;

    modelWrapper.scale.set(scaleX, scaleY, scaleZ);
    cortinaGroup.add(modelWrapper);

    if (config.position) {
        cortinaGroup.position.set(config.position.x, config.position.y, config.position.z);
    }
    if (config.rotation) {
        cortinaGroup.rotation.set(config.rotation.x || 0, config.rotation.y || 0, config.rotation.z || 0);
    }

    function updateWrinkleDeformation(delta) {
        if (meshEntries.length === 0) return;

        if (animProgress !== targetProgress) {
            const speed = 1.4; // Transición fluida en ~0.7 segundos
            if (animProgress < targetProgress) {
                animProgress = Math.min(targetProgress, animProgress + delta * speed);
            } else {
                animProgress = Math.max(targetProgress, animProgress - delta * speed);
            }

            // Suavizado EaseInOutCubic
            const t = animProgress < 0.5
                ? 4 * animProgress * animProgress * animProgress
                : 1 - Math.pow(-2 * animProgress + 2, 3) / 2;

            const compressedWidth = 1.0 - 0.85 * t;

            for (const entry of meshEntries) {
                const mesh = entry.mesh;
                const origPositions = entry.origPositions;
                const posAttr = mesh.geometry.attributes.position;
                const positions = posAttr.array;
                const count = posAttr.count;

                for (let i = 0; i < count; i++) {
                    const x0 = origPositions[i * 3];
                    const y0 = origPositions[i * 3 + 1];
                    const z0 = origPositions[i * 3 + 2];

                    // Deformación de tela y pliegues
                    const vFactor = Math.min(1.0, Math.max(0.0, (z0 + 0.93) / 0.4));
                    const wave1 = Math.sin((x0 + 1.0) * Math.PI * 10);
                    const wave2 = Math.sin((x0 + 1.0) * Math.PI * 20) * 0.35;
                    const wrinkleZ = (wave1 + wave2) * 0.15 * vFactor * (0.3 + 0.7 * t);

                    if (entry.isLeft) {
                        // Panel Izquierdo: se recoge hacia la izquierda (-1.0) formando pliegues
                        const pushX = Math.cos((x0 + 1.0) * Math.PI * 10) * 0.04 * vFactor * t;
                        positions[i * 3]     = -1.0 + (x0 + 1.0) * compressedWidth + pushX;
                        positions[i * 3 + 1] = y0 + (wave1 * 0.03 * vFactor * t);
                        positions[i * 3 + 2] = z0 - wrinkleZ;
                    } else {
                        // Panel Derecho: se recoge hacia la derecha (+1.0) formando pliegues
                        const pushX = Math.cos((1.0 - x0) * Math.PI * 10) * 0.04 * vFactor * t;
                        positions[i * 3]     = 1.0 - (1.0 - x0) * compressedWidth - pushX;
                        positions[i * 3 + 1] = y0 + (wave1 * 0.03 * vFactor * t);
                        positions[i * 3 + 2] = z0 - wrinkleZ;
                    }
                }

                posAttr.needsUpdate = true;
                mesh.geometry.computeVertexNormals();
            }
        }
    }

    return {
        group: cortinaGroup,
        update: (delta) => {
            updateWrinkleDeformation(delta);
        },
        toggle: () => {
            isOpen = !isOpen;
            targetProgress = isOpen ? 1.0 : 0.0;
            return isOpen;
        },
        open: () => {
            isOpen = true;
            targetProgress = 1.0;
            return isOpen;
        },
        close: () => {
            isOpen = false;
            targetProgress = 0.0;
            return isOpen;
        },
        getState: () => isOpen
    };
}

/**
 * Crea las cortinas posicionadas en las 3 ventanas laterales.
 * Excluye la ventana grande trasera del tejado.
 */
export function createAllCortinas() {
    const mainGroup = new THREE.Group();
    mainGroup.name = "GrupoCortinasTodas";

    // Ventana 1 Pared Izquierda (Frente)
    const cortinaIzq1 = createCortinaInstance({
        name: "Cortina_Izq_Frente",
        position: { x: -44.3, y: 21.43, z: -42.031 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        targetWidth: 18.0,
        targetHeight: 12.2
    });

    // Ventana 2 Pared Izquierda (Fondo)
    const cortinaIzq2 = createCortinaInstance({
        name: "Cortina_Izq_Fondo",
        position: { x: -44.3, y: 21.43, z: 11.969 },
        rotation: { x: 0, y: Math.PI / 2, z: 0 },
        targetWidth: 18.0,
        targetHeight: 12.2
    });

    // Ventana Pared Derecha (Fija)
    const cortinaDer1 = createCortinaInstance({
        name: "Cortina_Der_Fija",
        position: { x: 43.7, y: 21.43, z: -14.979 },
        rotation: { x: 0, y: -Math.PI / 2, z: 0 },
        targetWidth: 18.0,
        targetHeight: 12.2
    });

    const instances = [cortinaIzq1, cortinaIzq2, cortinaDer1];

    instances.forEach(inst => {
        mainGroup.add(inst.group);
    });

    let allOpen = false;

    return {
        group: mainGroup,
        instances: instances,
        update: (delta) => {
            instances.forEach(inst => inst.update(delta));
        },
        toggleAll: () => {
            allOpen = !allOpen;
            instances.forEach(inst => {
                if (allOpen) {
                    inst.open();
                } else {
                    inst.close();
                }
            });
            return allOpen;
        },
        closeAll: () => {
            allOpen = false;
            instances.forEach(inst => inst.close());
            return allOpen;
        },
        openAll: () => {
            allOpen = true;
            instances.forEach(inst => inst.open());
            return allOpen;
        },
        isOpen: () => allOpen
    };
}
