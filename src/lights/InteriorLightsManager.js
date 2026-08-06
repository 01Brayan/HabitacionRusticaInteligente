import * as THREE from 'three';
import { resolveLightType } from './LightTypes.js';
import { createLight } from './LightFactory.js';
import { flickerIntensity } from './CandleFlicker.js';

// 0 = día pleno, 1 = noche
export function hourToDarkness(hour) {

    const h = ((hour % 24) + 24) % 24;

    if (h <= 5 || h >= 20) return 1;                    // noche cerrada
    if (h >= 8 && h <= 16.5) return 0;                   // día pleno
    if (h < 8) return 1 - THREE.MathUtils.smoothstep(h, 5, 8);  // amaneciendo

    return THREE.MathUtils.smoothstep(h, 16.5, 20);      // atardeciendo
}

// Centro visual real del objeto (bounding box)
function getLocalVisualCenter(object) {

    const box = new THREE.Box3().setFromObject(object);

    if (box.isEmpty() || !isFinite(box.min.x)) {
        return new THREE.Vector3(0, 0, 0);
    }

    return object.worldToLocal(box.getCenter(new THREE.Vector3()));
}

// Detecta lámparas y candelabro dentro de una lista de objetos, les crea
// una PointLight, y cada frame sube/baja su intensidad gradualmente según
// qué tan oscuro esté (nunca de golpe).


export class InteriorLightsManager {

    constructor(objects, { fadeSpeed = 1.2 } = {}) {

        this.fadeSpeed = fadeSpeed;
        this.elapsed = 0;
        this.enabled = true;
        this.entries = [];

        this._registerObjects(objects);
    }

    refresh(objects) {
        this._registerObjects(objects);
    }

    _registerObjects(objects) {

        objects.forEach(object => {

            const alreadyTracked = this.entries.some(entry => entry.light.parent === object);
            if (alreadyTracked) return;

            const type = resolveLightType(object.name);
            if (!type) return;

            let light = object.children.find(child => child.isPointLight);

            if (!light) {
                light = createLight(type);
                light.position.copy(getLocalVisualCenter(object));
                object.add(light);
            }

            object.userData.light = light;

            this.entries.push({
                light,
                type,
                current: 0,
                seed: this.entries.length * 1.37
            });
        });
    }

    // darkness: 0 (pleno día) a 1 (noche cerrada)
    update(delta, darkness) {

        this.elapsed += delta;

        this.entries.forEach(entry => {

            const target = this.enabled ? entry.type.intensity * darkness : 0;

            // Fundido suave: nunca salta directo al valor objetivo
            entry.current += (target - entry.current) * Math.min(this.fadeSpeed * delta, 1);

            entry.light.intensity = entry.type.flicker
                ? flickerIntensity(entry.current, this.elapsed, entry.seed)
                : entry.current;
        });
    }

    setEnabled(value) {
        this.enabled = value;
    }
}
