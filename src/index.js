import { createScene } from './core/SceneManager.js';
import { createCamera } from './core/CameraManager.js';
import { createRenderer, applyEnvironment } from './core/RendererManager.js';
import { createLights } from './lights/Lights.js';
import { createTimeGUI } from './ui/TimeGUI.js';
import { createCameraController } from './ui/CameraController.js';

import { setupResize } from './utils/ResizeHandler.js';
import { startAnimation } from './animations/AnimationLoop.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// crear cama
import { createBed } from './objects/furniture/Bed.js';
// crear piso
import { createFloor } from './objects/Floor.js';
// importar paredes
import { createWallBack } from './objects/walls/WallBack.js';
import { createWallRight } from './objects/walls/WallRight.js';
import { createWallLeft } from './objects/walls/WallLeft.js';
import { createWallWindow } from './objects/walls/WallWindow.js';
import { createWallFront } from './objects/walls/WallFront.js';
import * as THREE from 'three';

// importar techo
import { createRoof } from './objects/Roof.js';

// importar clima
import { createClimaFrio } from './climates/ClimaFrio.js';

// exterior
import { createCesped } from './objects/exterior/Cesped.js';
import { createTerraza } from './objects/exterior/Terraza.js';

// importacion de objetos
import { createMesaDeNoche } from './objects/furniture/MesaDeNoche.js';
import { createRopero } from './objects/furniture/ropero.js';
import { createEstanteria } from './objects/furniture/Estanteria.js';
import { createComoda } from './objects/furniture/Comoda.js';
import { createChimenea } from './objects/furniture/Chimenea.js';
import { createMesaCentro } from './objects/furniture/MesaDeCentro.js';
import { createSofa } from './objects/furniture/Sofa.js';
import { createTapeteBlanco } from './objects/furniture/TapeteBlanco.js';
import { createTapeteRojo } from './objects/furniture/TapeteRojo.js';
import { createCaja } from './objects/furniture/Caja.js';
import { createBarril } from './objects/furniture/Barril.js';
import { createRepisaInferior, createRepisaSuperior } from './objects/furniture/Repisa.js';

// import de las decoraciones
import { createDecorations } from './objects/decorations/Decorations.js';
import { applyLayout } from './utils/LayoutLoader.js';
import { createAllCortinas } from './objects/furniture/Cortinas_tela.js';

// sistema de luces interiores (lámparas + candelabro)
import { InteriorLightsManager, hourToDarkness } from './lights/InteriorLightsManager.js';

// CONTENEDOR
const container = document.getElementById('container');

// ESCENA
const scene = createScene();

// CAMARA
const camera = createCamera();

// RENDERER
const renderer = createRenderer(container);
applyEnvironment(scene, renderer);
// CONTROLES
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

// CÁMARAS FIJAS (controlador con 4 cámaras + vista libre)
const camController = createCameraController({ camera, controls });
document.body.appendChild(camController.element);

// AGREGAR PISO
const floor = createFloor();
scene.add(floor);

// AGREGAR CAMA
const bed = createBed();
bed.position.set(0, 0, -1);
scene.add(bed);

const mesaDeNoche = createMesaDeNoche();
mesaDeNoche.position.set(0, 0, -1);
scene.add(mesaDeNoche);

const mesaDeNoche2 = createMesaDeNoche();
mesaDeNoche2.position.set(-34.5, 0, -1);
scene.add(mesaDeNoche2);

const ropero = createRopero();
ropero.position.set(0, 0, 0);
scene.add(ropero);

const estanteria = createEstanteria();
estanteria.position.set(0, 0, 0);
scene.add(estanteria);

const comoda = createComoda();
comoda.position.set(0, 0, 0);
scene.add(comoda);

const chiminea = createChimenea();
chiminea.position.set(0, 0, 0);
scene.add(chiminea);

const mesacentro = createMesaCentro();
mesacentro.position.set(0, 0, 0);
scene.add(mesacentro);

const sofa = createSofa();
sofa.position.set(0, 0, 0);
scene.add(sofa);

const tapeteblanco = createTapeteBlanco();
tapeteblanco.position.set(0, 0, 0);
scene.add(tapeteblanco);

const tapeterojo = createTapeteRojo();
tapeterojo.position.set(0, 0, 0);
scene.add(tapeterojo);

const cajademadera = createCaja();
cajademadera.position.set(0, 0, 0);
scene.add(cajademadera);

const barril = createBarril();
barril.position.set(0, 0, 0);
scene.add(barril);

const repisa = createRepisaSuperior();
repisa.position.set(0, 0, -1);
scene.add(repisa);

const repisainf = createRepisaInferior();
repisainf.position.set(0, 0, -1);
scene.add(repisainf);

// AGREGAR PARED TRASERA
const wallBack = createWallBack();
wallBack.position.set(0, 0, -1);
scene.add(wallBack);
// AGREGAR PARED IZQUIERDA
const wallLeft = createWallLeft();
wallLeft.position.set(0, 0, 0);
scene.add(wallLeft);
// AGREGAR PARED DERECHA
const wallRight = createWallRight();
wallRight.position.set(0, 0, 0);
scene.add(wallRight);
//AGREGAR PARED FRONTAL
const wallFront = createWallFront();
wallFront.position.set(0, 0, 0);
scene.add(wallFront);
//AGREGAR TERRENO EXTERIOR (cesped)
const cesped = createCesped();
scene.add(cesped.group);
//AGREGAR TERRAZA EXTERIOR (frente a la puerta)
const terraza = createTerraza();
scene.add(terraza);

// AGREGAR TECHO
const roof = createRoof();
roof.position.set(0, 0, 0);
scene.add(roof);

// LUCES (sol/luna/cielo — sistema de tu compañero)
const lights = createLights(scene);

// GUI de hora del dia
let horaActual = 7;   // Brayan: usado por ventanas, cortinas y camaras
let currentHour = 7;  // Waldimar: usado por la chimenea automatica

// Determinar si la chimenea debe encenderse automáticamente según la hora
// (5:00 AM a antes de las 8:00 AM  Y  5:30 PM [17.5] en adelante)
function isFireplaceTime(hour) {
    return (hour >= 5.0 && hour < 8.0) || (hour >= 17.5);
}

let lastFireplaceAutoState = isFireplaceTime(currentHour);

// CONTROL INTERACTIVO FUEGO CHIMENEA (GSAP)
const fuegoLabel = document.createElement('label');
fuegoLabel.style.cssText = 'position:absolute;bottom:70px;left:20px;color:#fff;font-family:Arial;font-size:1rem;background:rgba(180, 70, 20, 0.9);padding:10px 16px;border-radius:8px;z-index:1000;display:flex;align-items:center;gap:10px;cursor:pointer;user-select:none;box-shadow: 0 4px 15px rgba(255, 100, 0, 0.3);transition: all 0.3s ease;';

const fuegoCheck = document.createElement('input');
fuegoCheck.type = 'checkbox';
fuegoCheck.checked = isFireplaceTime(currentHour);
fuegoCheck.style.width = '18px';
fuegoCheck.style.height = '18px';
fuegoCheck.style.cursor = 'pointer';

if (!fuegoCheck.checked) {
    fuegoLabel.style.background = 'rgba(18, 18, 28, 0.85)';
    fuegoLabel.style.boxShadow = 'none';
}

if (typeof chiminea.userData?.toggleFuego === 'function') {
    chiminea.userData.toggleFuego(fuegoCheck.checked);
}

fuegoCheck.addEventListener('change', () => {
    const isChecked = fuegoCheck.checked;
    if (typeof chiminea.userData?.toggleFuego === 'function') {
        chiminea.userData.toggleFuego(isChecked);
    }
    if (isChecked) {
        fuegoLabel.style.background = 'rgba(180, 70, 20, 0.9)';
        fuegoLabel.style.boxShadow = '0 4px 15px rgba(255, 100, 0, 0.3)';
    } else {
        fuegoLabel.style.background = 'rgba(18, 18, 28, 0.85)';
        fuegoLabel.style.boxShadow = 'none';
    }
});

const fuegoText = document.createElement('span');
fuegoText.textContent = '🔥 Encender Chimenea';

fuegoLabel.appendChild(fuegoCheck);
fuegoLabel.appendChild(fuegoText);
document.body.appendChild(fuegoLabel);

const gui = createTimeGUI({
    min: 5,
    max: 20,
    initial: 7,
    onChange: (hour) => {
        horaActual = hour;
        currentHour = hour;
        lights.setTime(hour);

        // Control automático de la chimenea según horario (5:00 AM - 8:00 AM y 5:30 PM+)
        const shouldBeOn = isFireplaceTime(hour);
        if (shouldBeOn !== lastFireplaceAutoState) {
            lastFireplaceAutoState = shouldBeOn;
            if (fuegoCheck.checked !== shouldBeOn) {
                fuegoCheck.checked = shouldBeOn;
                fuegoCheck.dispatchEvent(new Event('change'));
            }
        }
    },
});
document.body.appendChild(gui.element);


// CLIMA: MODO FRIO Y ANIMACIONES DE OBJETOS
const climaFrio = createClimaFrio(scene, lights.hemiLight, lights.fillLight, cesped.material);
const climaUpdaters = [
    climaFrio.update,
    camController.update,
    chiminea.userData?.updateFuego
].filter(Boolean);


// ===========================================
// VENTANAS AUTOMATICAS (se abren con calor)
// ===========================================
const ANGULO_ABIERTA = THREE.MathUtils.degToRad(120); // 120° abierta
const HORA_INICIO_CALOR = 10;
const HORA_FIN_CALOR = 16;

// Recolectar las 2 ventanas modulares de la pared izquierda
const ventanas = [];
wallLeft.traverse((child) => {
    if (child.userData && typeof child.userData.setApertura === 'function') {
        ventanas.push(child);
    }
});

function updateVentanas() {
    // Si hace calor (10-16h) y NO esta el modo frio activo → abrir
    const haceCalor = horaActual >= HORA_INICIO_CALOR && horaActual <= HORA_FIN_CALOR && !climaFrio.state.activo;
    const objetivo = haceCalor ? ANGULO_ABIERTA : 0;

    ventanas.forEach(win => {
        win.userData.setApertura(objetivo); // fija el objetivo
        win.userData.actualizar();          // anima suavemente hacia el
    });
}

// Agregar al bucle de animacion
climaUpdaters.push(updateVentanas);
// ===========================================

// ===========================================
// CORTINAS AUTOMATICAS (se cierran de noche o con frio)
// ===========================================
const ESCALA_CORTINA_ABIERTA = 0.35; // recogida arriba
const ESCALA_CORTINA_CERRADA = 1;    // estirada, cubre la ventana

// Recolectar las cortinas de la pared trasera (Brayan: automaticas de noche/frio)
const cortinasWallBack = [];
wallBack.traverse((child) => {
    if (child.userData && typeof child.userData.setCortina === 'function') {
        cortinasWallBack.push(child);
    }
});

function updateCortinas() {
    // Cerrar cortinas de noche (19h a 7h) o si hace frio
    const esDeNoche = horaActual >= 19 || horaActual <= 7;
    const cerrar = esDeNoche || climaFrio.state.activo;
    const objetivo = cerrar ? ESCALA_CORTINA_CERRADA : ESCALA_CORTINA_ABIERTA;

    cortinasWallBack.forEach(c => {
        c.userData.setCortina(objetivo); // fija el objetivo
        c.userData.actualizarCortina();  // anima suavemente hacia el
    });
}

climaUpdaters.push(updateCortinas);
// ===========================================

// RESPONSIVE
setupResize(camera, renderer);

// Asignar nombres para que layout.json pueda ubicar cada objeto
bed.name = 'bed';
mesaDeNoche.name = 'mesaDeNoche';
mesaDeNoche2.name = 'mesaDeNoche2';
ropero.name = 'ropero';
estanteria.name = 'estanteria';
comoda.name = 'comoda';
chiminea.name = 'chiminea';
mesacentro.name = 'mesacentro';
sofa.name = 'sofa';
tapeteblanco.name = 'tapeteblanco';
tapeterojo.name = 'tapeterojo';
cajademadera.name = 'cajademadera';
barril.name = 'barril';
repisa.name = 'repisa';
repisainf.name = 'repisainf';

// AGREGAR DECORACIONES (objetos importados de Blender)
const decorations = await createDecorations();

// Ocultar / remover absolutamente todas las cortinas y paneles antiguos (cortina, pplane, plane, polysurface) de Decorations.glb
const oldCurtainObjects = [];
decorations.traverse((child) => {
    const nameLower = (child.name || '').toLowerCase();
    if (
        nameLower.includes('cortina') || 
        nameLower.includes('pplane') || 
        nameLower.includes('plane') || 
        nameLower.includes('polysurface')
    ) {
        oldCurtainObjects.push(child);
    }
});
oldCurtainObjects.forEach((child) => {
    child.visible = false;
    if (child.parent) {
        child.removeFromParent();
    }
});

scene.add(decorations);

// Lista de todos los objetos que pueden tener layout guardado y/o luz interior
const allObjects = [
    bed, mesaDeNoche, mesaDeNoche2, ropero, estanteria, comoda,
    chiminea, mesacentro, sofa, tapeteblanco, tapeterojo,
    cajademadera, barril, repisa, repisainf,
    ...decorations.children
];
// Crear el manager de luces interiores ANTES de applyLayout
// (así los duplicados heredan su propia luz al clonarse)
const interiorLights = new InteriorLightsManager(allObjects);

// Aplicar posiciones guardadas (aquí se recrean los duplicados)
await applyLayout('src/assets/layout.json', allObjects, scene);

// Registrar las luces de los duplicados recién creados
interiorLights.refresh(allObjects);

// AGREGAR CORTINAS 3D EN LAS VENTANAS LATERALES
const cortinas = createAllCortinas();
scene.add(cortinas.group);
climaUpdaters.push(cortinas.update);

// PANEL DE CONTROLES INFERIOR IZQUIERDA (UI)
const controlsUI = document.createElement('div');
controlsUI.style.cssText = 'position:fixed;bottom:20px;left:20px;z-index:10000;display:flex;align-items:center;gap:12px;user-select:none;';

// 2. Botón Abrir / Cerrar Cortinas
const cortinasBtn = document.createElement('button');
cortinasBtn.style.cssText = 'color:#fff;font-family:Arial,sans-serif;font-size:0.95rem;font-weight:600;background:rgba(18,18,28,0.85);padding:10px 18px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.4);transition:all 0.3s;display:flex;align-items:center;gap:8px;';
cortinasBtn.innerHTML = '<span>🪟</span><span id="btnCortinasText">ABRIR CORTINAS</span>';

const updateBtnState = (isOpen) => {
    const textEl = cortinasBtn.querySelector('#btnCortinasText');
    if (textEl) textEl.textContent = isOpen ? 'CERRAR CORTINAS' : 'ABRIR CORTINAS';
    cortinasBtn.style.background = isOpen ? 'rgba(120, 70, 160, 0.9)' : 'rgba(18, 18, 28, 0.85)';
};

// 1. Control Clima Frío
const frioLabel = document.createElement('label');
frioLabel.style.cssText = 'color:#fff;font-family:Arial,sans-serif;font-size:0.95rem;font-weight:600;background:rgba(18,18,28,0.85);padding:10px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.4);transition:all 0.3s;';

const frioCheck = document.createElement('input');
frioCheck.type = 'checkbox';
frioCheck.style.width = '18px';
frioCheck.style.height = '18px';
frioCheck.style.cursor = 'pointer';

frioCheck.addEventListener('change', () => {
    climaFrio.toggle();
    if (climaFrio.state.activo) {
        frioLabel.style.background = 'rgba(58, 100, 150, 0.9)';
        // Al activar el modo FRIO, encender automáticamente el fuego de la chimenea si estaba apagado
        if (!fuegoCheck.checked) {
            fuegoCheck.checked = true;
            fuegoCheck.dispatchEvent(new Event('change'));
        }
        // Al activar el modo FRÍO, cerrar las cortinas automáticamente solo si están abiertas
        if (cortinas.isOpen()) {
            cortinas.closeAll();
            updateBtnState(false);
        }
    } else {
        frioLabel.style.background = 'rgba(18, 18, 28, 0.85)';
    }
});

const frioText = document.createElement('span');
frioText.textContent = 'FRÍO';
frioLabel.appendChild(frioCheck);
frioLabel.appendChild(frioText);
controlsUI.appendChild(frioLabel);

cortinasBtn.addEventListener('click', () => {
    const isOpen = cortinas.toggleAll();
    updateBtnState(isOpen);
});
controlsUI.appendChild(cortinasBtn);
document.body.appendChild(controlsUI);

// Raycaster para interactuar al hacer clic directamente sobre cualquier cortina 3D
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
window.addEventListener('click', (event) => {
    if (event.target.tagName !== 'CANVAS') return;
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(cortinas.group.children, true);
    if (intersects.length > 0) {
        const isOpen = cortinas.toggleAll();
        updateBtnState(isOpen);
    }
});

// ANIMACION
startAnimation(
    renderer,
    scene,
    camera,
    controls,
    climaUpdaters,
    interiorLights,
    () => hourToDarkness(currentHour)
);