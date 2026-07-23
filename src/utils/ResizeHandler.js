export function setupResize (camera, renderer){
    window.addEventListener(
        'resize',
        ()=> {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatix();
            renderer.setSize(
                window.innerWidth,
                window.innerHeight
            );
        }
    );
}