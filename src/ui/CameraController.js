import * as THREE from 'three';

// ============================================================
// CONTROLADOR DE CÁMARAS FIJAS
// ============================================================
// Hay 4 cámaras fijas + vista LIBRE (con el mouse).
// Todas apuntan al MISMO punto fijo (el centro de la escena).
//
// CÓMO AJUSTAR TÚ MISMO:
//   - CAMARAS: cambia las coordenadas "pos" y el "fov" de cada cámara
//   - PUNTO_FIJO: el punto al que todas miran
//   - sway: true/false para que la cámara "respire" suavemente
// ============================================================

// Punto al que TODAS las cámaras miran
const PUNTO_FIJO = new THREE.Vector3(-0.042, 16.66, 7.525);

// Configuración de cada cámara
const CAMARAS = {
    exterior: {
        pos: [74.467, -4.183, -148.601],  // afuera, frente a la puerta
        fov: 50,                            // más amplio (exterior)
        sway: true,                         // con movimiento suave
    },
    interior1: {
        pos: [-0.397, 23.925, -56.762],   // cerca de la puerta
        fov: 55,
        sway: true,
    },
    interior2: {
        pos: [-36.679, 16.457, 52.156],     // lado derecho de la casa
        fov: 55,
        sway: true,
    },
    interior3: {
        pos: [22.092, 13.428, 53.509],    // lado izquierdo de la casa
        fov: 65,
        sway: true,
    },
};

export function createCameraController({ camera, controls }) {
    // ---- Estado interno ----
    let camaraActiva = null;        // null = vista libre
    const posicionObjetivo = new THREE.Vector3();
    const posicionBase = new THREE.Vector3();
    let fovObjetivo = 40;
    const lookAt = new THREE.Vector3();
    let tiempo = 0;

    // ============================================================
    // CREAR LA INTERFAZ (botones 1-4 + LIBRE)
    // ============================================================
    const panel = document.createElement('div');
    panel.className = 'cam-panel';

    const titulo = document.createElement('div');
    titulo.className = 'cam-panel__title';
    titulo.textContent = 'Cámaras';

    const botonesCont = document.createElement('div');
    botonesCont.className = 'cam-panel__buttons';

    // Lista de botones: cada uno tiene clave, texto y clase especial
    const listaBotones = [
        { clave: 'exterior',  texto: 'Exterior',   clase: '' },
        { clave: 'interior1', texto: 'Interior 1', clase: '' },
        { clave: 'interior2', texto: 'Interior 2', clase: '' },
        { clave: 'interior3', texto: 'Interior 3', clase: '' },
        { clave: 'libre',     texto: 'LIBRE',      clase: 'cam-btn--libre' },
    ];

    const botones = {};

    listaBotones.forEach(({ clave, texto, clase }) => {
        const btn = document.createElement('button');
        btn.className = `cam-btn ${clase}`;
        btn.textContent = texto;
        btn.addEventListener('click', () => {
            if (clave === 'libre') {
                activarLibre();
            } else {
                seleccionarCamara(clave);
            }
            actualizarEstilos();
        });
        botonesCont.appendChild(btn);
        botones[clave] = btn;
    });

    panel.appendChild(titulo);
    panel.appendChild(botonesCont);

    // ============================================================
    // SELECCIONAR UNA CÁMARA FIJA
    // ============================================================
    function seleccionarCamara(clave) {
        const config = CAMARAS[clave];
        if (!config) return;

        camaraActiva = clave;
        posicionObjetivo.fromArray(config.pos);
        posicionBase.copy(camera.position);
        fovObjetivo = config.fov;

        // La vista libre se desactiva al elegir cámara fija
        controls.enabled = false;
    }

    // ============================================================
    // VISTA LIBRE (con el mouse)
    // ============================================================
    function activarLibre() {
        camaraActiva = null;
        controls.enabled = true;
    }

    // ============================================================
    // ACTUALIZAR LOS ESTILOS DE LOS BOTONES
    // ============================================================
    function actualizarEstilos() {
        Object.keys(botones).forEach((clave) => {
            const activo = (clave === camaraActiva) || (clave === 'libre' && camaraActiva === null);
            botones[clave].classList.toggle('cam-btn--active', activo);
        });
    }

    // ============================================================
    // ACTUALIZAR CADA FRAME (llamado desde el bucle de animación)
    // ============================================================
    function update() {
        if (camaraActiva === null) return; // vista libre, no hacemos nada

        // 1. Interpolar suavemente hacia la posición objetivo (lerp)
        posicionBase.lerp(posicionObjetivo, 0.05);

        // 2. Ajustar el zoom (fov) suavemente
        camera.fov = THREE.MathUtils.lerp(camera.fov, fovObjetivo, 0.05);
        camera.updateProjectionMatrix();

        // 3. Aplicar posición base + movimiento "sway" (respiración)
        camera.position.copy(posicionBase);
        const config = CAMARAS[camaraActiva];
        if (config.sway) {
            tiempo += 0.01;
            const amp = 0.15;
            camera.position.x += Math.sin(tiempo * 0.5) * amp * 0.3;
            camera.position.y += Math.sin(tiempo * 0.8) * amp * 0.5;
            camera.position.z += Math.cos(tiempo * 0.4) * amp * 0.2;
        }

        // 4. Siempre mirar al punto fijo
        lookAt.copy(PUNTO_FIJO);
        camera.lookAt(lookAt);
    }

    // ============================================================
    // INICIALIZAR
    // ============================================================
    // Cámara por defecto: Exterior (sin animación de entrada)
    seleccionarCamara('exterior');
    camera.position.copy(posicionObjetivo);
    camera.fov = fovObjetivo;
    camera.updateProjectionMatrix();
    camera.lookAt(PUNTO_FIJO);
    actualizarEstilos();

    return {
        element: panel,
        update,
    };
}
