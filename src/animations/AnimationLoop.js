export function startAnimation(renderer, scene, camera, controls, climateUpdaters = []) {
    function animate() {
        requestAnimationFrame(animate);
        
        // Actualiza los controles del mouse en cada frame
        if (controls && typeof controls.update === 'function') {
            controls.update(); 
        }

        climateUpdaters.forEach((updater) => {
            if (typeof updater === 'function') {
                updater();
            }
        });

        renderer.render(scene, camera);
    }
    animate();
}