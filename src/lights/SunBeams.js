import * as THREE from 'three';

/**
 * Rayo de luz "falso": un plano con gradiente + blending aditivo que simula
 * un haz volumétrico entrando por una ventana. NO ilumina objetos ni proyecta
 * sombra real — es un efecto visual que se dibuja encima de la escena ya
 * iluminada por Lights.js.
 *
 * A DIFERENCIA de un rayo modelado/horneado en Blender, este se recalcula
 * en código cada vez que cambia la hora: rota según la dirección real del
 * sol, cambia de color/intensidad, y se apaga solo si el sol queda del lado
 * que no entra por esa ventana. No hace falta re-modelar nada al cambiar
 * el ciclo del día.
 *
 * Uso:
 *   const beam = createSunBeam(1.8, 7); // ancho, largo
 *   scene.add(beam);
 *
 *   // cada vez que cambies la hora (o cada frame si querés transición fluida):
 *   updateSunBeam(beam, windowPosition, windowNormal, lights.sunLight);
 */

function createBeamTexture() {
    const size = 128;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Gradiente: fuerte cerca de la ventana, se disuelve hacia adentro
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, 'rgba(255,255,255,0.9)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,0.25)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
}

/**
 * Crea el mesh del haz. Posición y rotación se setean después con updateSunBeam,
 * así que acá solo armamos geometría/material.
 */
export function createSunBeam(width = 1.8, length = 7) {
    const texture = createBeamTexture();
    const geometry = new THREE.PlaneGeometry(width, length);
    const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        color: 0xfff2d9,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.renderOrder = 10; // dibujar después de los objetos opacos
    mesh.userData.length = length;
    mesh.visible = false; // hasta el primer updateSunBeam
    return mesh;
}

// vectores/quaternion reusables para no generar basura en cada llamada
const _lightDir = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _up = new THREE.Vector3(0, 1, 0);

/**
 * @param {THREE.Mesh} beamMesh
 * @param {THREE.Vector3} windowPosition  centro de la ventana (mundo)
 * @param {THREE.Vector3} windowNormal    normal apuntando HACIA ADENTRO de la casa (normalizada)
 * @param {THREE.DirectionalLight} sunLight  el mismo objeto que devuelve createLights()
 */
export function updateSunBeam(beamMesh, windowPosition, windowNormal, sunLight) {
    // Dirección real en la que viaja la luz ahora mismo (sol -> objetivo)
    _lightDir.subVectors(sunLight.target.position, sunLight.position).normalize();

    // Solo se ve si el sol efectivamente entra por ESTA ventana
    const facingWindow = _lightDir.dot(windowNormal) > 0.05;
    beamMesh.visible = facingWindow && sunLight.intensity > 0.05;
    if (!beamMesh.visible) return;

    const length = beamMesh.userData.length;
    beamMesh.position.copy(windowPosition).addScaledVector(_lightDir, length / 2);

    _quat.setFromUnitVectors(_up, _lightDir);
    beamMesh.quaternion.copy(_quat);

    beamMesh.material.color.copy(sunLight.color);

    const grazing = 1 - Math.abs(_lightDir.y); // rasante = más visible
    const visibility = THREE.MathUtils.clamp(sunLight.intensity / 4.6, 0, 1);
    beamMesh.material.opacity = visibility * THREE.MathUtils.lerp(0.15, 0.55, grazing);
}