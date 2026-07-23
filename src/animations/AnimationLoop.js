export function startAnimation(renderer, scene, camera, room, controls) {
    function animate() {
        requestAnimationFrame(animate);
        
        // Actualiza los controles del mouse en cada frame
        if (controls) {
            controls.update(); 
        }

        renderer.render(scene, camera);
    }
    animate();
}