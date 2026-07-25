import * as THREE from 'three';

export function createLluviaEffect() {
    const group = new THREE.Group();
    const particleCount = 5200;
    const positions = new Float32Array(particleCount * 3);
    const data = [];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0x9ecbff,
        size: 0.24,
        transparent: true,
        opacity: 0.92,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    const width = 620;
    const depth = 520;
    const height = 180;
    const roofHeight = 62;
    const houseWidth = 62;
    const houseDepth = 78;
    const roofGuardHeight = roofHeight + 32;
    const houseMargin = 12;

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
            drift: (Math.random() - 0.5) * 0.14
        };
    }

    for (let i = 0; i < particleCount; i += 1) {
        const particle = createParticle();
        positions[i * 3] = particle.x;
        positions[i * 3 + 1] = particle.y;
        positions[i * 3 + 2] = particle.z;
        data.push(particle);
    }

    function update(delta = 0.016) {
        if (!group.visible) {
            return;
        }

        const time = performance.now() * 0.001;
        const wind = Math.sin(time * 0.35) * 0.5;

        for (let i = 0; i < particleCount; i += 1) {
            const particle = data[i];
            particle.y -= particle.speed * delta * 31;
            particle.x += (wind + particle.drift * 0.6) * delta * 19;
            particle.z += wind * delta * 13;

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
            }

            positions[i * 3] = particle.x;
            positions[i * 3 + 1] = particle.y;
            positions[i * 3 + 2] = particle.z;
        }

        geometry.attributes.position.needsUpdate = true;
    }

    return { group, update };
}

