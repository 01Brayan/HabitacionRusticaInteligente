import { createScene } from './core/SceneManager.js' ;
import { createCamera } from './core/CameraManager.js';
import { createRenderer , applyEnvironment} from './core/RendererManager.js';
import { createLights } from './lights/Lights.js';
import { createTimeGUI } from './ui/TimeGUI.js';

import { setupResize } from './utils/ResizeHandler.js';
import { startAnimation } from './animations/AnimationLoop.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//crear cama
import {createBed} from './objects/furniture/Bed.js';
//crear piso
import { createFloor } from './objects/Floor.js';
//importar paredes
import { createWallBack } from './objects/walls/WallBack.js';
import { createWallRight } from './objects/walls/WallRight.js';
import { createWallLeft } from './objects/walls/WallLeft.js';
import {createWallWindow} from './objects/walls/WallWindow.js'
import * as THREE from 'three';

// importar techo
import { createRoof } from './objects/Roof.js';

// importar clima
import { createClimaFrio } from './climates/ClimaFrio.js';

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

//import de las decoraciones
import { createDecorations } from './objects/decorations/Decorations.js';
import { applyLayout } from './utils/LayoutLoader.js';
import { createAllCortinas } from './objects/furniture/Cortinas_tela.js';


// CONTENEDOR
const container = document.getElementById('container');

// ESCENA
const scene = createScene();

// CAMARA
const camera = createCamera();

// RENDERER
const renderer = createRenderer(container);
applyEnvironment(scene, renderer);
//CONTROLES
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;

// AGREGAR PISO
const floor = createFloor();
scene.add(floor);


// AGREGAR CAMA
const bed = createBed();
bed.position.set(0, 0,-1);
scene.add(bed);

const mesaDeNoche = createMesaDeNoche();
mesaDeNoche.position.set(0,0,-1);
scene.add(mesaDeNoche);

const mesaDeNoche2 = createMesaDeNoche();
mesaDeNoche2.position.set(-34.5,0,-1);
scene.add(mesaDeNoche2);

const ropero = createRopero();
ropero.position.set(0,0,0);
scene.add(ropero);

const estanteria = createEstanteria();
estanteria.position.set(0,0,0);
scene.add(estanteria);

const comoda = createComoda();
comoda.position.set(0,0,0);
scene.add(comoda);

const chiminea = createChimenea();
chiminea.position.set(0,0,0);
scene.add(chiminea);

const mesacentro = createMesaCentro();
mesacentro.position.set(0,0,0);
scene.add(mesacentro);

const sofa = createSofa();
sofa.position.set(0,0,0);
scene.add(sofa);

const tapeteblanco = createTapeteBlanco();
tapeteblanco.position.set(0,0,0);
scene.add(tapeteblanco);

const tapeterojo= createTapeteRojo();
tapeterojo.position.set(0,0,0);
scene.add(tapeterojo);

const cajademadera= createCaja();
cajademadera.position.set(0,0,0);
scene.add(cajademadera);

const barril= createBarril();
barril.position.set(0,0,0);
scene.add(barril);

const repisa = createRepisaSuperior();
repisa.position.set(0,0,-1);
scene.add(repisa);

const repisainf = createRepisaInferior();
repisainf.position.set(0,0,-1);
scene.add(repisainf);
// AGREGAR PARED TRASERA
const wallBack = createWallBack();
wallBack.position.set(0, 0, -1);
scene.add(wallBack);
//AGREGAR PARED IZQUIERDA
const wallLeft = createWallLeft();
wallLeft.position.set(0, 0, 0);
scene.add(wallLeft);
//AGREGAR PARED DERECHA
const wallRight = createWallRight();
wallRight.position.set(0, 0, 0);
scene.add(wallRight);

//AGREGAR TECHO
const roof = createRoof();
roof.position.set(0, 0, 0);
scene.add(roof);
// LUCES
const lights = createLights(scene);

// GUI de hora del dia
const gui = createTimeGUI({
    min: 5,
    max: 20,
    initial: 7,
    onChange: (hour) => {
        lights.setTime(hour);
    },
});
document.body.appendChild(gui.element);




// CLIMA: MODO FRIO
const climaFrio = createClimaFrio(scene, lights.hemiLight, lights.fillLight);
const climaUpdaters = [climaFrio.update];

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

// Aplicar posiciones guardadas en layout.json
const allObjects = [
    bed, mesaDeNoche, mesaDeNoche2, ropero, estanteria, comoda,
    chiminea, mesacentro, sofa, tapeteblanco, tapeterojo,
    cajademadera, barril, repisa, repisainf,
    ...decorations.children
];
await applyLayout('src/assets/layout.json', allObjects);

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
console.log('Iniciando animacion con', climaUpdaters?.length, 'updaters');
startAnimation(renderer, scene, camera, controls, climaUpdaters || []);
