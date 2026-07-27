import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const loader = new GLTFLoader();

export async function createDecorations() {

    return new Promise((resolve, reject) => {

        loader.load(

            'src/assets/decoraciones/Decorations.glb',

            (gltf) => {
                resolve(gltf.scene);
            },

            undefined,

            (error) => {
                reject(error);
            }
        );
    });
}