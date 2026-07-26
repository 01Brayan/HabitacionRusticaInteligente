import { createScene } from './core/SceneManager.js' ;
import { createCamera } from './core/CameraManager.js';
import { createRenderer , applyEnvironment} from './core/RendererManager.js';
import { createLights } from './lights/Lights.js';
import { createTimeGUI } from './ui/TimeGUI.js';

import { setupResize } from './utils/ResizeHandler.js';
import { startAnimation } from './animations/AnimationLoop.js';
//crear el diseño del cielo
import {createSkybox} from './objects/Skybox.js'

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { DirectionalLightHelper } from 'three'; // --esto fue modificado: helper para ver dirección del sol (luego lo borraremos)
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




// CONTENEDOR
const container = document.getElementById('container');

// ESCENA
const scene = createScene();

// CÁMARA
const camera = createCamera();

// RENDERER
const renderer = createRenderer(container);
applyEnvironment(scene, renderer);
//CONTROLES
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// AGREGAR ENTORNO (SKYBOX) -- comentado temporalmente para ver el sol real
//const skybox = createSkybox();
//scene.add(skybox);

// AGREGAR PISO
const floor = createFloor();
scene.add(floor);


// AGREGAR CAMA
const bed = createBed();
bed.position.set(0, 0,-1); // Posición de la cama en la habitación
scene.add(bed);

const mesaDeNoche = createMesaDeNoche();
mesaDeNoche.position.set(0,0,-1); // la posición junto a la cama
scene.add(mesaDeNoche);

const mesaDeNoche2 = createMesaDeNoche();
mesaDeNoche2.position.set(-34.5,0,-1); // la posición junto a la cama
scene.add(mesaDeNoche2);

const ropero = createRopero();
ropero.position.set(0,0,0); // la posición junto a la cama
scene.add(ropero);

const estanteria = createEstanteria();
estanteria.position.set(0,0,0); // la posición junto a la cama
scene.add(estanteria);

const comoda = createComoda();
comoda.position.set(0,0,0); // la posición junto a la cama
scene.add(comoda);

const chiminea = createChimenea();
chiminea.position.set(0,0,0); // la posición junto a la cama
scene.add(chiminea);

const mesacentro = createMesaCentro();
mesacentro.position.set(0,0,0); // la posición junto a la cama
scene.add(mesacentro);

const sofa = createSofa();
sofa.position.set(0,0,0); // la posición junto a la cama
scene.add(sofa);

const tapeteblanco = createTapeteBlanco();
tapeteblanco.position.set(0,0,0); // la posición junto a la cama
scene.add(tapeteblanco);

const tapeterojo= createTapeteRojo();
tapeterojo.position.set(0,0,0); // la posición junto a la cama
scene.add(tapeterojo);

const cajademadera= createCaja();
cajademadera.position.set(0,0,0); // la posición junto a la cama
scene.add(cajademadera);

const barril= createBarril();
barril.position.set(0,0,0); // la posición junto a la cama
scene.add(barril);

const repisa = createRepisaSuperior();
repisa.position.set(0,0,-1); // la posición junto a la cama
scene.add(repisa);

const repisainf = createRepisaInferior();
repisainf.position.set(0,0,-1); // la posición junto a la cama
scene.add(repisainf);
// AGREGAR PARED TRASERA
const wallBack = createWallBack();
wallBack.position.set(0, 0, -1); // La mandas al fondo de la cabaña
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

// Helper visual que muestra la dirección del sol (opcional, puedes borrarlo después)
const sunHelper = new DirectionalLightHelper(lights.sunLight, 15);
scene.add(sunHelper);

// GUI de hora del día
const gui = createTimeGUI({
    min: 5,
    max: 20,
    initial: 7,
    onChange: (hour) => {
        lights.setTime(hour);
    },
});
document.body.appendChild(gui.element);




// RESPONSIVE
setupResize(camera, renderer);

// ANIMACIÓN
startAnimation(renderer, scene, camera, controls);