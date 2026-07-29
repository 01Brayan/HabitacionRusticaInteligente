import { createScene } from './core/SceneManager.js' ;
import { createCamera } from './core/CameraManager.js';
import { createRenderer , applyEnvironment} from './core/RendererManager.js';
import { createLights } from './lights/Lights.js';
import { createTimeGUI } from './ui/TimeGUI.js';

import { setupResize } from './utils/ResizeHandler.js';
import { startAnimation } from './animations/AnimationLoop.js';
//crear el diseno del cielo
import {createSkybox} from './objects/Skybox.js'

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
import { createLluviaEffect } from './climates/Lluvia.js';
import { createNieveEffect } from './climates/Nieve.js';
import { createNeblinaEffect } from './climates/Neblina.js';

//importar suelo exterior
import { createSueloExterior } from './Around/Suelo.js';

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
controls.dampingFactor = 0.05;

// AGREGAR ENTORNO (SKYBOX)
const skybox = createSkybox();
scene.add(skybox);

// AGREGAR PISO
const floor = createFloor();
scene.add(floor);

// AGREGAR SUELO EXTERIOR
const sueloExterior = createSueloExterior();
scene.add(sueloExterior.group);

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




// EFECTOS DE CLIMA
const lluviaEffect = createLluviaEffect();
const nieveEffect = createNieveEffect();
const neblinaEffect = createNeblinaEffect();

lluviaEffect.group.position.set(0, 0, 0);
nieveEffect.group.position.set(0, 0, 0);
neblinaEffect.group.position.set(0, 0, 0);

lluviaEffect.group.visible = false;
nieveEffect.group.visible = false;
neblinaEffect.group.visible = false;

scene.add(lluviaEffect.group);
scene.add(nieveEffect.group);
scene.add(neblinaEffect.group);

const climateUpdaters = [lluviaEffect.update, nieveEffect.update, neblinaEffect.update];
const weatherHint = document.getElementById('weather-hint');

function createClimateControls() {
    const panel = document.createElement('div');
    panel.id = 'climate-panel';
    panel.style.position = 'absolute';
    panel.style.top = '20px';
    panel.style.right = '20px';
    panel.style.display = 'flex';
    panel.style.gap = '8px';
    panel.style.padding = '10px';
    panel.style.background = 'rgba(18, 18, 28, 0.85)';
    panel.style.borderRadius = '8px';
    panel.style.zIndex = '1000';
    panel.style.fontFamily = 'Arial, sans-serif';

    const buttons = [
        { id: 'btn-lluvia', label: 'Lluvia' },
        { id: 'btn-nieve', label: 'Nieve' },
        { id: 'btn-neblina', label: 'Neblina' },
        { id: 'btn-detener', label: 'Detener' }
    ];

    buttons.forEach(({ id, label }) => {
        const button = document.createElement('button');
        button.id = id;
        button.textContent = label;
        button.style.padding = '8px 12px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.background = '#2a2f47';
        button.style.color = '#fff';
        button.style.cursor = 'pointer';
        button.style.fontSize = '0.9rem';
        button.style.transition = 'transform 0.15s ease, background 0.15s ease';
        button.addEventListener('mouseover', () => button.style.transform = 'scale(1.04)');
        button.addEventListener('mouseout', () => button.style.transform = 'scale(1)');
        button.addEventListener('click', () => {
            const weatherKey = id.replace('btn-', '');
            if (weatherKey === 'detener') {
                setClimate(null);
            } else {
                setClimate(weatherKey);
            }
        });
        panel.appendChild(button);
    });

    document.body.appendChild(panel);
}

function initializeClimateControls() {
    if (!document.getElementById('btn-lluvia') || !document.getElementById('btn-nieve') || !document.getElementById('btn-neblina')) {
        createClimateControls();
    }

    climateButtons = {
        lluvia: document.getElementById('btn-lluvia'),
        nieve: document.getElementById('btn-nieve'),
        neblina: document.getElementById('btn-neblina'),
        detener: document.getElementById('btn-detener')
    };

    hasClimateControls = Boolean(climateButtons.lluvia && climateButtons.nieve && climateButtons.neblina);
}

let climateButtons = {
    lluvia: document.getElementById('btn-lluvia'),
    nieve: document.getElementById('btn-nieve'),
    neblina: document.getElementById('btn-neblina')
};

let hasClimateControls = false;
let activeWeather = null;

initializeClimateControls();

function updateWeatherHint() {
    if (!weatherHint) {
        return;
    }

    if (activeWeather) {
        const label = activeWeather.charAt(0).toUpperCase() + activeWeather.slice(1);
        weatherHint.textContent = `Clima activo: ${label}.`;
    } else {
        weatherHint.textContent = 'Selecciona un clima.';
    }
}

function setClimate(active) {
    const activeStates = {
        lluvia: active === 'lluvia',
        nieve: active === 'nieve',
        neblina: active === 'neblina'
    };

    activeWeather = active;
    lluviaEffect.group.visible = activeStates.lluvia;
    nieveEffect.group.visible = activeStates.nieve;
    neblinaEffect.group.visible = activeStates.neblina;
    scene.fog = activeStates.neblina ? new THREE.FogExp2(0xb3c5d3, 0.00145) : null;

    if (typeof sueloExterior.setWeather === 'function') {
        sueloExterior.setWeather(active || 'clear');
    }

    updateWeatherHint();

    if (hasClimateControls) {
        Object.keys(climateButtons).forEach((key) => {
            const button = climateButtons[key];
            if (!button) {
                return;
            }
            if (key === 'detener') {
                if (!active) {
                    button.classList.add('active');
                    button.style.background = '#ff5c5c';
                } else {
                    button.classList.remove('active');
                    button.style.background = '#2a2f47';
                }
                return;
            }

            if (activeStates[key]) {
                button.classList.add('active');
                button.style.background = '#5c82ff';
            } else {
                button.classList.remove('active');
                button.style.background = '#2a2f47';
            }
        });
    }
}

function toggleClimate(key) {
    setClimate(key);
}

setClimate(null);
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
scene.add(decorations);

// Aplicar posiciones guardadas en layout.json
const allObjects = [
    bed, mesaDeNoche, mesaDeNoche2, ropero, estanteria, comoda,
    chiminea, mesacentro, sofa, tapeteblanco, tapeterojo,
    cajademadera, barril, repisa, repisainf,
    ...decorations.children
];
await applyLayout('src/assets/layout.json', allObjects);

// ANIMACION
startAnimation(renderer, scene, camera, controls, climateUpdaters);
