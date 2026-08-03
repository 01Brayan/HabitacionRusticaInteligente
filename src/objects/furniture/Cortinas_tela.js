import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/**
 * Carga e instancia las cortinas 3D (Cortinas_tela.glb) con animación nativa de apertura y cierre mediante pivotes laterales.
 */
export function createCortinaInstance(config = {}) {
    const cortinaGroup = new THREE.Group();
    cortinaGroup.name = config.name || "CortinaModelo";

    const textureLoader = new THREE.TextureLoader();

    // Cargar únicamente la textura de difuso disponible
    const diffuseMap = textureLoader.load('src/assets/textures/curtains/difuse/difuse_2k.jpg');
    diffuseMap.colorSpace = THREE.SRGBColorSpace;
    diffuseMap.wrapS = THREE.RepeatWrapping;
    diffuseMap.wrapT = THREE.RepeatWrapping;

    const targetWidth = config.targetWidth || 18.0;
    const targetHeight = config.targetHeight || 12.2;
    const halfWidth = targetWidth / 2.0;

    // Crear pivotes izquierdo y derecho para abrir desde el centro hacia los bordes
    const leftPivot = new THREE.Group();
    leftPivot.name = "LeftPivot";
    leftPivot.position.set(-halfWidth, 0, 0);

    const rightPivot = new THREE.Group();
    rightPivot.name = "RightPivot";
    rightPivot.position.set(halfWidth, 0, 0);

    cortinaGroup.add(leftPivot);
    cortinaGroup.add(rightPivot);

    let animProgress = 0.0; // 0.0 = Cerrada, 1.0 = Abierta
    let targetProgress = 0.0;
    let isOpen = false;

    const loader = new GLTFLoader();

    loader.load(
        'src/assets/models/Cortinas_tela.glb',
        (gltf) => {
            const baseModel = gltf.scene;

            // Calcular bounding box para centrar el modelo base
            const bbox = new THREE.Box3().setFromObject(baseModel);
            const center = bbox.getCenter(new THREE.Vector3());
            const size = bbox.getSize(new THREE.Vector3());

            baseModel.position.set(-center.x, -center.y, -center.z);

            baseModel.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;

                    if (child.geometry.attributes.uv && !child.geometry.attributes.uv2) {
                        child.geometry.setAttribute('uv2', child.geometry.attributes.uv);
                    }

                    child.material = new THREE.MeshStandardMaterial({
                        map: diffuseMap,
                        roughness: 0.85,
                        metalness: 0.05,
                        side: THREE.DoubleSide,
                    });
                }
            });

            const currentWidth = size.x > 0 ? size.x : 2.0;
            const currentHeight = size.y > 0 ? size.y : 2.0;

            const scaleX = (halfWidth / currentWidth) * 1.02; // Leve solapamiento en el centro
            const scaleY = targetHeight / currentHeight;
            const scaleZ = scaleX;

            // Panel Izquierdo
            const leftModel = baseModel.clone(true);
            const leftWrapper = new THREE.Group();
            leftWrapper.add(leftModel);
            leftWrapper.scale.set(scaleX, scaleY, scaleZ);
            leftWrapper.position.set(halfWidth / 2.0, 0, 0);
            leftPivot.add(leftWrapper);

            // Panel Derecho
            const rightModel = baseModel.clone(true);
            const rightWrapper = new THREE.Group();
            rightWrapper.add(rightModel);
            rightWrapper.scale.set(scaleX, scaleY, scaleZ);
            rightWrapper.position.set(-halfWidth / 2.0, 0, 0);
            rightPivot.add(rightWrapper);
        },
        undefined,
        (error) => {
            console.error('Error al cargar Cortinas_tela.glb:', error);
        }
    );

    if (config.position) {
        cortinaGroup.position.set(config.position.x, config.position.y, config.position.z);
    }
    if (config.rotation) {
        cortinaGroup.rotation.set(config.rotation.x || 0, config.rotation.y || 0, config.rotation.z || 0);
    }

    function updateAnimation(delta) {
        if (animProgress !== targetProgress) {
            const speed = 2.0; // Transición ágil en 0.5s
            if (animProgress < targetProgress) {
                animProgress = Math.min(targetProgress, animProgress + delta * speed);
            } else {
                animProgress = Math.max(targetProgress, animProgress - delta * speed);
            }

            // Suavizado EaseInOutCubic
            const t = animProgress < 0.5
                ? 4 * animProgress * animProgress * animProgress
                : 1 - Math.pow(-2 * animProgress + 2, 3) / 2;

            // Al abrir (t=1), la cortina se pliega al 20% de su ancho contra cada lateral
            const currentScaleX = 1.0 - 0.80 * t;

            leftPivot.scale.x = currentScaleX;
            rightPivot.scale.x = currentScaleX;
        }
    }

    return {
        group: cortinaGroup,
        update: (delta) => {
            updateAnimation(delta);
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
