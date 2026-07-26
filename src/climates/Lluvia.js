import * as THREE from 'three';

export function createLluviaEffect() {
    const group = new THREE.Group();
    const particleCount = 5200;
    const data = [];

    const segmentGeometry = new THREE.BoxGeometry(0.032, 1.2, 0.032);
    const material = new THREE.MeshBasicMaterial({
        color: 0x9ecbff,
        transparent: true,
        opacity: 0.78,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const instancedRain = new THREE.InstancedMesh(segmentGeometry, material, particleCount);
    instancedRain.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(instancedRain);

    const width = 620;
    const depth = 520;
    const height = 180;
    const roofHeight = 62;
    const houseWidth = 62;
    const houseDepth = 78;
    const roofGuardHeight = roofHeight + 32;
    const houseMargin = 12;
    const matrix = new THREE.Matrix4();
    const quaternion = new THREE.Quaternion();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();

    function isInsideHouse(x, z) {
        return Math.abs(x) < houseWidth + houseMargin && Math.abs(z) < houseDepth + houseMargin;
    }

    function createParticle() {
        let x;
        let z;

        do {
            x = (Math.random() - 0.5) * width;
            z = (Math.random() - 0.5) * depth;
        } while (isInsideHouse(x, z));

        const y = Math.random() * height + roofHeight + 32;
        return {
            x,
            y,
            z,
            speed: 1.1 + Math.random() * 0.9,
            drift: (Math.random() - 0.5) * 0.14,
            length: 0.9 + Math.random() * 0.5,
            tilt: (Math.random() - 0.5) * 0.08
        };
    }

    function updateInstance(i, particle) {
        position.set(particle.x, particle.y, particle.z);
        quaternion.setFromEuler(new THREE.Euler(particle.tilt, 0, 0));
        scale.set(1, particle.length, 1);
        matrix.compose(position, quaternion, scale);
        instancedRain.setMatrixAt(i, matrix);
    }

    for (let i = 0; i < particleCount; i += 1) {
        const particle = createParticle();
        data.push(particle);
        updateInstance(i, particle);
    }

    function update(delta = 0.016) {
        if (!group.visible) {
            return;
        }

        const time = performance.now() * 0.001;
        const wind = Math.sin(time * 0.35) * 0.55;

        for (let i = 0; i < particleCount; i += 1) {
            const particle = data[i];
            particle.y -= particle.speed * delta * 32;
            particle.x += (wind + particle.drift * 0.6) * delta * 20;
            particle.z += wind * delta * 14;

            if (
                particle.y < -4 ||
                (isInsideHouse(particle.x, particle.z) && particle.y < roofGuardHeight) ||
                Math.abs(particle.x) > width / 2 ||
                Math.abs(particle.z) > depth / 2
            ) {
                const replacement = createParticle();
                particle.x = replacement.x;
                particle.y = replacement.y;
                particle.z = replacement.z;
                particle.speed = replacement.speed;
                particle.drift = replacement.drift;
                particle.length = replacement.length;
                particle.tilt = replacement.tilt;
            }

            updateInstance(i, particle);
        }

        instancedRain.instanceMatrix.needsUpdate = true;
    }

    return { group, update };
}

