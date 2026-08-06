// ================================================================
//  1. IMPORTACIONES      -> carga todos los módulos
//  2. ESCENA/CÁMARA      -> crea la base 3D
//  3. PISO Y MUEBLES     -> agrega los objetos de la habitación
//  4. PAREDES Y TECHO    -> arma la estructura de la casa
//  5. EXTERIOR           -> césped y terraza
//  6. LUCES              -> sol, luna, cielo
//  7. INTERFAZ HORA      -> slider del día
//  8. CHIMENEA           -> fuego automático + manual
//  9. CLIMA FRIO         -> niebla y tinte azulado
// 10. VENTANAS           -> abren con calor
// 11. CORTINAS           -> cierran de noche o con frío
// 12. DECORACIONES       -> objetos 3D importados
// 13. CÁMARAS Y ANIMACIÓN -> bucle final
// ================================================================

// ================================================================
// 1. IMPORTACIONES
// ================================================================
import { createScene } from './core/SceneManager.js';       // crea la escena
import { createCamera } from './core/CameraManager.js';     // crea la cámara
import { createRenderer, applyEnvironment } from './core/RendererManager.js'; // crea el renderer + luces de entorno
import { createLights } from './lights/Lights.js';          // sistema de luz (sol, luna, cielo)
import { createTimeGUI } from './ui/TimeGUI.js';            // slider de hora
import { createCameraController } from './ui/CameraController.js'; // cámaras fijas
import { setupResize } from './utils/ResizeHandler.js';     // ajusta al redimensionar
import { startAnimation } from './animations/AnimationLoop.js'; // bucle de animación
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // vista libre con mouse
import * as THREE from 'three';
// --- Muebles de la habitación ---
import { createBed } from './objects/furniture/Bed.js';
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
import { createAllCortinas } from './objects/furniture/Cortinas_tela.js'; // cortinas de tela
// --- Piso, paredes y techo ---
import { createFloor } from './objects/Floor.js';
import { createWallBack } from './objects/walls/WallBack.js';
import { createWallRight } from './objects/walls/WallRight.js';
import { createWallLeft } from './objects/walls/WallLeft.js';
import { createWallWindow } from './objects/walls/WallWindow.js';
import { createWallFront } from './objects/walls/WallFront.js';
import { createRoof } from './objects/Roof.js';
// --- Exterior ---
import { createCesped } from './objects/exterior/Cesped.js'; // césped
import { createTerraza } from './objects/exterior/Terraza.js'; // terraza de madera
// --- Decoraciones y clima ---
import { createDecorations } from './objects/decorations/Decorations.js'; // decoraciones GLB
import { applyLayout } from './utils/LayoutLoader.js'; // carga posiciones guardadas
import { createClimaFrio } from './climates/ClimaFrio.js'; // modo FRIO
// --- Luces interiores de los objetos ---
import { InteriorLightsManager, hourToDarkness } from './lights/InteriorLightsManager.js';

// ================================================================
// 2. ESCENA, CÁMARA Y RENDERER (base del proyecto 3D)
// ================================================================
const container = document.getElementById('container'); // donde se dibuja el canvas
const scene = createScene();                            // el "mundo" 3D
const camera = createCamera();                          // la cámara (punto de vista)
const renderer = createRenderer(container);             // motor que dibuja
applyEnvironment(scene, renderer);                      // luz de entorno (reflejos)

// --- Controles de vista libre (mouse) ---
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;      // movimiento suave
controls.dampingFactor = 0.08;      // intensidad del suavizado

// --- Cámaras fijas (4 cámaras + vista libre) ---
const camController = createCameraController({ camera, controls });
document.body.appendChild(camController.element); // panel de botones de cámaras

// ================================================================
// 3. PISO Y MUEBLES (los objetos de la habitación)
// ================================================================
const floor = createFloor();
scene.add(floor);

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

// ================================================================
// 4. PAREDES Y TECHO (la estructura de la casa)
// ================================================================
const wallBack = createWallBack();
wallBack.position.set(0, 0, -1);   // pared trasera
scene.add(wallBack);

const wallLeft = createWallLeft();
wallLeft.position.set(0, 0, 0);    // pared izquierda
scene.add(wallLeft);

const wallRight = createWallRight();
wallRight.position.set(0, 0, 0);   // pared derecha
scene.add(wallRight);

const wallFront = createWallFront();
wallFront.position.set(0, 0, 0);   // pared frontal (puerta)
scene.add(wallFront);

const roof = createRoof();
roof.position.set(0, 0, 0);        // techo
scene.add(roof);

// ================================================================
// 5. EXTERIOR (césped y terraza frente a la puerta)
// ================================================================
const cesped = createCesped();
scene.add(cesped.group);

const terraza = createTerraza();
scene.add(terraza);

// ================================================================
// 6. LUCES (sol, luna y cielo procedural)
// ================================================================
const lights = createLights(scene);

// ================================================================
// 7. CHIMENEA (fuego automático + control manual) — Waldimar
//    Se enciende sola en horarios fríos (5-8 AM y 17:30+)
//    y también al activar el modo FRIO.
// ================================================================
function isFireplaceTime(hour) {
    return (hour >= 5.0 && hour < 8.0) || (hour >= 17.5);
}

let lastFireplaceAutoState = isFireplaceTime(currentHour);

// Checkbox para encender/apagar la chimenea manualmente
const fuegoLabel = document.createElement('label');
fuegoLabel.style.cssText = 'color:#fff;font-family:Arial,sans-serif;font-size:0.95rem;font-weight:600;background:rgba(18,18,28,0.85);padding:10px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.4);transition:all 0.3s;position:fixed;bottom:70px;left:20px;z-index:10000;user-select:none;';

const fuegoCheck = document.createElement('input');
fuegoCheck.type = 'checkbox';
fuegoCheck.checked = isFireplaceTime(currentHour);
fuegoCheck.style.width = '18px';
fuegoCheck.style.height = '18px';
fuegoCheck.style.cursor = 'pointer';

if (!fuegoCheck.checked) {
    fuegoLabel.style.background = 'rgba(18, 18, 28, 0.85)';
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
        fuegoLabel.style.borderColor = 'rgba(255, 150, 60, 0.4)';
    } else {
        fuegoLabel.style.background = 'rgba(18, 18, 28, 0.85)';
        fuegoLabel.style.borderColor = 'rgba(255,255,255,0.15)';
    }
});

const fuegoText = document.createElement('span');
fuegoText.textContent = 'CHIMENEA';
fuegoLabel.appendChild(fuegoCheck);
fuegoLabel.appendChild(fuegoText);
document.body.appendChild(fuegoLabel);

// ================================================================
// 8. INTERFAZ DE HORA DEL DÍA (slider)
//    horaActual -> usada por ventanas, cortinas y cámaras (Brayan)
//    currentHour -> usada por la chimenea automática (Waldimar)
// ================================================================
let horaActual = 7;
let currentHour = 7;

const gui = createTimeGUI({
    min: 5,
    max: 20,
    initial: 7,
    onChange: (hour) => {
        horaActual = hour;
        currentHour = hour;
        lights.setTime(hour); // cambia el sol/cielo según la hora

        // Control automático de la chimenea según horario
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

// ================================================================
// 9. CLIMA FRIO (niebla + tinte azulado) — Brayan
// ================================================================
const climaFrio = createClimaFrio(scene, lights.hemiLight, lights.fillLight, cesped.material);

// Lista de actualizadores que se ejecutan cada frame
const climaUpdaters = [
    climaFrio.update,               // niebla + partículas del frío
    camController.update,           // animación de cámaras
    chiminea.userData?.updateFuego  // partículas del fuego
].filter(Boolean);                  // quita los undefined

// ================================================================
// 10. VENTANAS AUTOMÁTICAS (se abren con calor 10h-16h) — Brayan
// ================================================================
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
    // Si hace calor (10-16h) y NO está el modo frío activo → abrir
    const haceCalor = horaActual >= HORA_INICIO_CALOR && horaActual <= HORA_FIN_CALOR && !climaFrio.state.activo;
    const objetivo = haceCalor ? ANGULO_ABIERTA : 0;

    ventanas.forEach(win => {
        win.userData.setApertura(objetivo); // fija el objetivo
        win.userData.actualizar();          // anima suavemente hacia él
    });
}

climaUpdaters.push(updateVentanas);

// ================================================================
// 11. CORTINAS AUTOMÁTICAS (cierran de noche o con frío) — Brayan
// ================================================================
const ESCALA_CORTINA_ABIERTA = 0.35; // recogida arriba
const ESCALA_CORTINA_CERRADA = 1;    // estirada, cubre la ventana

// Recolectar las cortinas de la pared trasera (WallBack)
const cortinasWallBack = [];
wallBack.traverse((child) => {
    if (child.userData && typeof child.userData.setCortina === 'function') {
        cortinasWallBack.push(child);
    }
});

function updateCortinas() {
    // Cerrar cortinas de noche (19h a 7h) o si hace frío
    const esDeNoche = horaActual >= 19 || horaActual <= 7;
    const cerrar = esDeNoche || climaFrio.state.activo;
    const objetivo = cerrar ? ESCALA_CORTINA_CERRADA : ESCALA_CORTINA_ABIERTA;

    cortinasWallBack.forEach(c => {
        c.userData.setCortina(objetivo);   // fija el objetivo
        c.userData.actualizarCortina();    // anima suavemente hacia él
    });
}

climaUpdaters.push(updateCortinas);

// ================================================================
// RESPONSIVE (ajusta el tamaño al cambiar la ventana)
// ================================================================
setupResize(camera, renderer);

// ================================================================
// 12. DECORACIONES Y POSICIONES GUARDADAS
// ================================================================
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

// Cargar decoraciones (objetos 3D de Blender)
const decorations = await createDecorations();
scene.add(decorations);

// Lista de todos los objetos que pueden tener layout guardado y/o luz interior
const allObjects = [
    bed, mesaDeNoche, mesaDeNoche2, ropero, estanteria, comoda,
    chiminea, mesacentro, sofa, tapeteblanco, tapeterojo,
    cajademadera, barril, repisa, repisainf,
    ...decorations.children
];

// Sistema de luces interiores (lámparas + candelabro) — Luis
const interiorLights = new InteriorLightsManager(allObjects);

// Aplicar posiciones guardadas (recrea duplicados si hace falta)
await applyLayout('src/assets/layout.json', allObjects, scene);

// Registrar las luces de los duplicados recién creados
interiorLights.refresh(allObjects);

// ================================================================
// CORTINAS DE TELA (ventanas laterales) — Griselda
// ================================================================
const cortinas = createAllCortinas();
scene.add(cortinas.group);
climaUpdaters.push(cortinas.update); // animación de pliegues

// Cierre/apertura automática igual que las de WallBack
function updateCortinasTela() {
    const esDeNoche = horaActual >= 19 || horaActual <= 7;
    const cerrar = esDeNoche || climaFrio.state.activo;
    if (cerrar && cortinas.isOpen()) cortinas.closeAll();
    if (!cerrar && !cortinas.isOpen()) cortinas.openAll();
}
climaUpdaters.push(updateCortinasTela);

// ================================================================
// CHECKBOX FRIO (activa/desactiva el modo frío)
// ================================================================
const frioLabel = document.createElement('label');
frioLabel.style.cssText = 'position:fixed;bottom:20px;left:20px;color:#fff;font-family:Arial,sans-serif;font-size:0.95rem;font-weight:600;background:rgba(18,18,28,0.85);padding:10px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;gap:8px;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,0.4);transition:all 0.3s;z-index:10000;user-select:none;';

const frioCheck = document.createElement('input');
frioCheck.type = 'checkbox';
frioCheck.style.width = '18px';
frioCheck.style.height = '18px';
frioCheck.style.cursor = 'pointer';

frioCheck.addEventListener('change', () => {
    climaFrio.toggle();
    if (climaFrio.state.activo) {
        frioLabel.style.background = 'rgba(58, 100, 150, 0.9)';
        // Al activar FRIO, encender automáticamente el fuego si estaba apagado
        if (!fuegoCheck.checked) {
            fuegoCheck.checked = true;
            fuegoCheck.dispatchEvent(new Event('change'));
        }
    } else {
        frioLabel.style.background = 'rgba(18, 18, 28, 0.85)';
    }
});

const frioText = document.createElement('span');
frioText.textContent = 'FRIO';
frioLabel.appendChild(frioCheck);
frioLabel.appendChild(frioText);
document.body.appendChild(frioLabel);

// ================================================================
// 13. BUCLE DE ANIMACIÓN (inicia el renderizado en cada frame)
// ================================================================
startAnimation(
    renderer,
    scene,
    camera,
    controls,
    climaUpdaters,               // actualizadores por frame
    interiorLights,              // luces interiores dinámicas
    () => hourToDarkness(currentHour) // nivel de oscuridad para las luces
);
