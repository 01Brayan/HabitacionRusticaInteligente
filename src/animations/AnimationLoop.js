import * as THREE from 'three';

export function startAnimation(
    renderer,
    scene,
    camera,
    controls,
    climateUpdaters = [],
    interiorLights = null,
    getDarkness = () => 0
) {
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();
        // Actualiza los controles del mouse en cada frame
        if (controls && typeof controls.update === 'function') {
            controls.update();
        }
        //Ejecuta TODOS los "actualizadores" del clima/sistemas
        climateUpdaters.forEach((updater) => {
            if (typeof updater === 'function') {
                updater(delta);
            }
        });
        //Actualiza las luces interiores de lámparas/velas
        if (interiorLights) {
            interiorLights.update(delta, getDarkness());
        }

        renderer.render(scene, camera);
    }
    animate();
}
