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

        if (controls && typeof controls.update === 'function') {
            controls.update();
        }

        climateUpdaters.forEach((updater) => {
            if (typeof updater === 'function') {
                updater();
            }
        });

        if (interiorLights) {
            interiorLights.update(delta, getDarkness());
        }

        renderer.render(scene, camera);
    }
    animate();
}