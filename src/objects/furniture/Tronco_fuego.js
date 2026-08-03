// ===============================================================
// TRONCOS 3D REALISTAS, FUEGO PBR Y CONTROL GSAP ON/OFF
// ===============================================================
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap';

/**
 * Textura procedural para las partículas de llamas y chispas
 */
function createFireParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');

    const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
    gradient.addColorStop(0.25, 'rgba(255, 210, 60, 0.95)');
    gradient.addColorStop(0.6, 'rgba(255, 80, 10, 0.7)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 64, 64);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}

export function createTroncoFuego() {
    const fuegoGroup = new THREE.Group();
    fuegoGroup.name = "TroncosYFuegoGroup";

    // Ubicación del piso interior de la chimenea
    const HOGAR_POS = new THREE.Vector3(-38.45, 1.85, -15.0);

    const textureLoader = new THREE.TextureLoader();

    // ---------------------------------------------------------------
    // 1. ESTADO ANIMABLE CON GSAP (Encendido y Apagado Progresivo)
    // ---------------------------------------------------------------
    const fireState = {
        isOn: true,
        embersIntensity: 1.0,
        flameSizeFactor: 1.0,
        lightIntensityFactor: 1.0
    };

    let activeTimeline = null;

    /**
     * Alterna suavemente el fuego encendido/apagado mediante secuencias GSAP
     */
    function toggleFire(isOn) {
        if (activeTimeline) activeTimeline.kill();
        activeTimeline = gsap.timeline();
        fireState.isOn = isOn;

        if (isOn) {
            // ENCENDIDO PROGRESIVO CÁLIDO (7.5s)
            // 1. Las brasas se iluminan lentamente (2s)
            activeTimeline.to(fireState, { embersIntensity: 1.0, duration: 2.0, ease: "power2.inOut" }, 0);
            // 2. Las llamas aparecen y crecen suavemente (3s)
            activeTimeline.to(fireState, { flameSizeFactor: 1.0, duration: 3.0, ease: "power2.out" }, 1.5);
            // 3. La luz de la habitación se calienta gradualmente (5s)
            activeTimeline.to(fireState, { lightIntensityFactor: 1.0, duration: 5.0, ease: "sine.inOut" }, 2.5);
        } else {
            // APAGADO PROGRESIVO SUAVE (6s)
            // 1. La luz de la habitación se enfría lentamente (4s)
            activeTimeline.to(fireState, { lightIntensityFactor: 0.0, duration: 4.0, ease: "sine.inOut" }, 0);
            // 2. Las llamas disminuyen de tamaño hasta desaparecer (3s)
            activeTimeline.to(fireState, { flameSizeFactor: 0.0, duration: 3.0, ease: "power2.in" }, 1.0);
            // 3. Las brasas permanecen tenue (como brasas vivas) durante un tiempo (4s)
            activeTimeline.to(fireState, { embersIntensity: 0.15, duration: 4.0, ease: "power1.out" }, 2.0);
        }
    }

    // ---------------------------------------------------------------
    // 2. CARGA DE TEXTURAS PBR REALISTAS
    // ---------------------------------------------------------------
    const logDiffuse = textureLoader.load('src/assets/textures/rough_wood/rough_wood_diff_2k.jpg');
    const logNormal  = textureLoader.load('src/assets/textures/rough_wood/rough_wood_nor_gl_2k.jpg');
    const logRough   = textureLoader.load('src/assets/textures/rough_wood/rough_wood_rough_2k.jpg');
    const logAO      = textureLoader.load('src/assets/textures/rough_wood/rough_wood_ao_2k.jpg');

    const endCutDiffuse = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Color_2K.jpg');
    const endCutNormal  = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Normal_2K.jpg');
    const endCutRough   = textureLoader.load('src/assets/textures/wood_dark_001/wood_dark_001_Roughness_2K.jpg');

    logDiffuse.colorSpace = THREE.SRGBColorSpace;
    endCutDiffuse.colorSpace = THREE.SRGBColorSpace;

    [logDiffuse, logNormal, logRough, logAO].forEach((tex) => {
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.RepeatWrapping;
        tex.repeat.set(2, 4);
    });

    // Material de corteza carbonizada PBR
    const logBarkMaterial = new THREE.MeshStandardMaterial({
        map: logDiffuse,
        normalMap: logNormal,
        normalScale: new THREE.Vector2(3.0, 3.0),
        roughnessMap: logRough,
        aoMap: logAO,
        aoMapIntensity: 2.0,
        roughness: 0.96,
        metalness: 0.05,
        color: 0x3d2719,
        emissive: 0xee3300,
        emissiveIntensity: 0.45
    });

    // Material de extremo cortado de tronco PBR
    const logEndCutMaterial = new THREE.MeshStandardMaterial({
        map: endCutDiffuse,
        normalMap: endCutNormal,
        roughnessMap: endCutRough,
        roughness: 0.85,
        color: 0x8a5b3a,
        emissive: 0xff4400,
        emissiveIntensity: 0.3
    });

    // Material de la malla del fuego en el GLB
    const fireMeshMaterial = new THREE.MeshStandardMaterial({
        color: 0xffaa00,
        emissive: 0xff5500,
        emissiveIntensity: 3.0,
        roughness: 0.1,
        metalness: 0.0,
        transparent: true,
        opacity: 0.95
    });

    let glbFireMesh = null;

    // ---------------------------------------------------------------
    // 3. APILADO 3D REALISTA DE TRONCOS EN CRUZ (FOTO DE REFERENCIA)
    // ---------------------------------------------------------------
    const logStackGroup = createRealisticFirewoodStack(HOGAR_POS, logBarkMaterial, logEndCutMaterial);
    fuegoGroup.add(logStackGroup);

    // Carga de modelo GLB si está disponible
    const loader = new GLTFLoader();
    const fireTexture = createFireParticleTexture();

    loader.load(
        'src/assets/models/Troncos_fuego.glb',
        (gltf) => {
            const model = gltf.scene;
            model.position.copy(HOGAR_POS);
            model.position.y += 0.05;
            model.scale.set(1.4, 1.4, 1.4);

            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    const matName = child.material ? child.material.name : '';
                    if (matName.includes('LightWood')) {
                        child.material = logEndCutMaterial;
                    } else if (matName.includes('Wood') || child.name.includes('Wood')) {
                        child.material = logBarkMaterial;
                    } else if (matName.includes('Fire') || child.name.includes('Fire')) {
                        child.visible = false; // Ocultar la pirámide sólida "cerro de fuego"
                    } else {
                        child.material = logBarkMaterial;
                    }
                }
            });
            fuegoGroup.add(model);
        },
        undefined,
        (error) => {
            // Log stack procedural activo
        }
    );

    // ---------------------------------------------------------------
    // 4. BASE DE BRASAS Y CARBÓN INCANDESCENTE
    // ---------------------------------------------------------------
    const brasasGeo = new THREE.PlaneGeometry(4.2, 2.8);
    const brasasMat = new THREE.MeshBasicMaterial({
        color: 0xff3300,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });
    const brasasMesh = new THREE.Mesh(brasasGeo, brasasMat);
    brasasMesh.rotation.x = -Math.PI / 2;
    brasasMesh.position.copy(HOGAR_POS);
    brasasMesh.position.y += 0.06;
    fuegoGroup.add(brasasMesh);

    // ---------------------------------------------------------------
    // 5. SISTEMA DE PARTÍCULAS DE LLAMAS (THREE.Points)
    // ---------------------------------------------------------------
    const countLlamas = 140;
    const posLlamas = new Float32Array(countLlamas * 3);
    const velLlamas = new Float32Array(countLlamas * 3);
    const lifeLlamas = new Float32Array(countLlamas);
    const maxLifeLlamas = new Float32Array(countLlamas);

    for (let i = 0; i < countLlamas; i++) {
        resetLlamaParticle(i, posLlamas, velLlamas, lifeLlamas, maxLifeLlamas, HOGAR_POS);
    }

    const llamaGeo = new THREE.BufferGeometry();
    llamaGeo.setAttribute('position', new THREE.BufferAttribute(posLlamas, 3));

    const llamaMat = new THREE.PointsMaterial({
        size: 2.3,
        map: fireTexture,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xffbb33
    });

    const llamaPoints = new THREE.Points(llamaGeo, llamaMat);
    fuegoGroup.add(llamaPoints);

    // ---------------------------------------------------------------
    // 6. SISTEMA DE CHISPAS Y EMBERS FLOTANTES
    // ---------------------------------------------------------------
    const countChispas = 65;
    const posChispas = new Float32Array(countChispas * 3);
    const velChispas = new Float32Array(countChispas * 3);
    const lifeChispas = new Float32Array(countChispas);

    for (let i = 0; i < countChispas; i++) {
        resetChispaParticle(i, posChispas, velChispas, lifeChispas, HOGAR_POS);
    }

    const chispaGeo = new THREE.BufferGeometry();
    chispaGeo.setAttribute('position', new THREE.BufferAttribute(posChispas, 3));

    const chispaMat = new THREE.PointsMaterial({
        size: 0.55,
        map: fireTexture,
        transparent: true,
        opacity: 1.0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        color: 0xffee66
    });

    const chispaPoints = new THREE.Points(chispaGeo, chispaMat);
    fuegoGroup.add(chispaPoints);

    // ---------------------------------------------------------------
    // 7. SISTEMA DE ILUMINACIÓN DE ALTA INTENSIDAD
    // ---------------------------------------------------------------
    const fuegoLuz = new THREE.PointLight(0xff6a00, 26.0, 80.0, 1.0);
    fuegoLuz.castShadow = true;
    fuegoLuz.shadow.mapSize.set(2048, 2048);
    fuegoLuz.shadow.bias = -0.001;
    fuegoLuz.position.set(HOGAR_POS.x + 2.5, HOGAR_POS.y + 2.0, HOGAR_POS.z);
    fuegoGroup.add(fuegoLuz);

    const fuegoSpotLight = new THREE.SpotLight(0xff5500, 35.0, 90.0, Math.PI / 2.2, 0.4, 1.0);
    fuegoSpotLight.castShadow = false;
    fuegoSpotLight.position.set(HOGAR_POS.x + 1.5, HOGAR_POS.y + 2.5, HOGAR_POS.z);

    const spotTarget = new THREE.Object3D();
    spotTarget.position.set(HOGAR_POS.x + 25.0, 1.0, HOGAR_POS.z);
    fuegoGroup.add(spotTarget);
    fuegoSpotLight.target = spotTarget;
    fuegoGroup.add(fuegoSpotLight);

    const fuegoHogarLuz = new THREE.PointLight(0xff2200, 14.0, 18.0, 1.0);
    fuegoHogarLuz.position.set(HOGAR_POS.x - 1.0, HOGAR_POS.y + 2.0, HOGAR_POS.z);
    fuegoGroup.add(fuegoHogarLuz);

    // ---------------------------------------------------------------
    // 8. RENDER LOOP CON MULTIPLICADORES GSAP DE ESTADO (60 FPS)
    // ---------------------------------------------------------------
    let clock = new THREE.Clock();

    function updateFuego() {
        const delta = clock.getDelta();
        const time = clock.getElapsedTime();

        // A. Actualizar Partículas de Llamas (Escaladas por fireState.flameSizeFactor)
        llamaMat.size = 2.3 * fireState.flameSizeFactor;
        llamaMat.opacity = 0.95 * fireState.flameSizeFactor;

        if (fireState.flameSizeFactor > 0.01) {
            const positions = llamaGeo.attributes.position.array;
            for (let i = 0; i < countLlamas; i++) {
                const idx = i * 3;
                lifeLlamas[i] += delta;

                if (lifeLlamas[i] >= maxLifeLlamas[i]) {
                    resetLlamaParticle(i, positions, velLlamas, lifeLlamas, maxLifeLlamas, HOGAR_POS);
                } else {
                    positions[idx] += velLlamas[idx] * delta + Math.sin(time * 9 + i) * 0.01;
                    positions[idx + 1] += velLlamas[idx + 1] * delta;
                    positions[idx + 2] += velLlamas[idx + 2] * delta + Math.cos(time * 7 + i) * 0.01;
                }
            }
            llamaGeo.attributes.position.needsUpdate = true;
        }

        // B. Actualizar Chispas
        chispaMat.opacity = 1.0 * fireState.flameSizeFactor;
        if (fireState.flameSizeFactor > 0.01) {
            const posC = chispaGeo.attributes.position.array;
            for (let i = 0; i < countChispas; i++) {
                const idx = i * 3;
                lifeChispas[i] += delta;

                if (lifeChispas[i] > 2.5) {
                    resetChispaParticle(i, posC, velChispas, lifeChispas, HOGAR_POS);
                } else {
                    posC[idx] += velChispas[idx] * delta + (Math.random() - 0.5) * 0.018;
                    posC[idx + 1] += velChispas[idx + 1] * delta;
                    posC[idx + 2] += velChispas[idx + 2] * delta + (Math.random() - 0.5) * 0.018;
                }
            }
            chispaGeo.attributes.position.needsUpdate = true;
        }

        // C. Parpadeo de Luz (Multiplicado por fireState.lightIntensityFactor)
        const flicker = Math.sin(time * 16) * 3.5 +
                        Math.sin(time * 26) * 2.2 +
                        (Math.random() - 0.5) * 3.0;

        fuegoLuz.intensity = THREE.MathUtils.clamp((26.0 + flicker) * fireState.lightIntensityFactor, 0.0, 40.0);
        fuegoSpotLight.intensity = THREE.MathUtils.clamp((35.0 + flicker * 1.2) * fireState.lightIntensityFactor, 0.0, 50.0);
        fuegoHogarLuz.intensity = THREE.MathUtils.clamp((14.0 + flicker * 0.4) * fireState.lightIntensityFactor, 0.0, 20.0);

        fuegoLuz.position.z = HOGAR_POS.z + Math.sin(time * 11) * 0.2;
        fuegoLuz.position.y = HOGAR_POS.y + 2.0 + Math.cos(time * 13) * 0.1;

        // D. Incandescencia de Madera y Brasas (Multiplicado por fireState.embersIntensity)
        const pulse = 0.35 + Math.sin(time * 12) * 0.18;
        logBarkMaterial.emissiveIntensity = (0.35 + pulse * 0.4) * fireState.embersIntensity;
        logEndCutMaterial.emissiveIntensity = (0.3 + pulse * 0.3) * fireState.embersIntensity;

        if (glbFireMesh) {
            glbFireMesh.material.emissiveIntensity = (2.6 + Math.sin(time * 18) * 0.6) * fireState.flameSizeFactor;
            glbFireMesh.material.opacity = 0.95 * fireState.flameSizeFactor;
        }
        brasasMat.opacity = (0.8 + Math.sin(time * 14) * 0.2) * fireState.embersIntensity;
    }

    return {
        group: fuegoGroup,
        update: updateFuego,
        light: fuegoLuz,
        toggle: toggleFire,
        state: fireState
    };
}

// Auxiliares
function resetLlamaParticle(i, positions, velocities, life, maxLife, basePos) {
    const idx = i * 3;
    positions[idx] = basePos.x + (Math.random() - 0.5) * 1.8;
    positions[idx + 1] = basePos.y + Math.random() * 0.2;
    positions[idx + 2] = basePos.z + (Math.random() - 0.5) * 2.8;

    velocities[idx] = (Math.random() - 0.5) * 0.2;
    velocities[idx + 1] = 1.4 + Math.random() * 1.8;
    velocities[idx + 2] = (Math.random() - 0.5) * 0.2;

    life[i] = 0;
    maxLife[i] = 0.5 + Math.random() * 0.7;
}

function resetChispaParticle(i, positions, velocities, life, basePos) {
    const idx = i * 3;
    positions[idx] = basePos.x + (Math.random() - 0.5) * 1.5;
    positions[idx + 1] = basePos.y + 0.5;
    positions[idx + 2] = basePos.z + (Math.random() - 0.5) * 2.2;

    velocities[idx] = (Math.random() - 0.5) * 0.6;
    velocities[idx + 1] = 2.0 + Math.random() * 2.5;
    velocities[idx + 2] = (Math.random() - 0.5) * 0.6;

    life[i] = Math.random() * 2.0;
}

function createRealisticFirewoodStack(basePos, logBarkMaterial, logEndCutMaterial) {
    const stackGroup = new THREE.Group();
    stackGroup.name = "FirewoodStackGroup";

    const logMaterials = [logBarkMaterial, logEndCutMaterial, logEndCutMaterial];

    const logsConfig = [
        { rTop: 0.28, rBot: 0.32, len: 3.4, pos: [-0.3, 0.25, -0.8], rotZ: Math.PI / 2, rotY: 0.15 },
        { rTop: 0.26, rBot: 0.30, len: 3.4, pos: [-0.3, 0.25, 0.8], rotZ: Math.PI / 2, rotY: -0.15 },
        { rTop: 0.32, rBot: 0.36, len: 3.8, pos: [0.1, 0.65, 0.0], rotZ: Math.PI / 2.3, rotY: 0.85 },
        { rTop: 0.24, rBot: 0.28, len: 3.0, pos: [-0.1, 0.55, -0.6], rotZ: Math.PI / 1.9, rotY: -0.75 },
        { rTop: 0.20, rBot: 0.24, len: 2.6, pos: [0.4, 0.35, 0.4], rotZ: Math.PI / 2.1, rotY: 0.3 }
    ];

    logsConfig.forEach(({ rTop, rBot, len, pos: [dx, dy, dz], rotZ, rotY }) => {
        const geo = new THREE.CylinderGeometry(rTop, rBot, len, 16);

        const posAttr = geo.attributes.position;
        for (let i = 0; i < posAttr.count; i++) {
            const vy = posAttr.getY(i);
            const noise = (Math.sin(vy * 8) + Math.cos(vy * 12)) * 0.035;
            posAttr.setX(i, posAttr.getX(i) + noise);
            posAttr.setZ(i, posAttr.getZ(i) + noise);
        }
        geo.computeVertexNormals();

        const logMesh = new THREE.Mesh(geo, logMaterials);
        logMesh.castShadow = true;
        logMesh.receiveShadow = true;

        logMesh.rotation.z = rotZ;
        logMesh.rotation.y = rotY;
        logMesh.position.set(basePos.x + dx, basePos.y + dy, basePos.z + dz);

        stackGroup.add(logMesh);
    });

    return stackGroup;
}
