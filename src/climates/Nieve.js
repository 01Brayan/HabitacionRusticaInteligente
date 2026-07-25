import * as THREE from 'three';

export function createNieveEffect() {
    const group = new THREE.Group();
    const particleCount = 3400;
    const positions = new Float32Array(particleCount * 3);
    const data = [];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.32,
        transparent: true,
        opacity: 0.94,
        depthWrite: false,
        sizeAttenuation: true
    });

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    const width = 540;
    const depth = 460;
    const height = 150;
    const roofHeight = 62;
    const houseWidth = 58;
    const houseDepth = 70;
    const roofGuardHeight = roofHeight + 30;
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
            speed: 0.18 + Math.random() * 0.16,
            driftX: (Math.random() - 0.5) * 0.1,
            driftZ: (Math.random() - 0.5) * 0.1
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
        const wind = Math.sin(time * 0.26) * 0.28;

        for (let i = 0; i < particleCount; i += 1) {
            const particle = data[i];
            particle.y -= particle.speed * delta * 15;
            particle.x += (wind + particle.driftX) * delta * 12;
            particle.z += (wind * 0.3 + particle.driftZ) * delta * 11;

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
                particle.driftX = replacement.driftX;
                particle.driftZ = replacement.driftZ;
            }

            positions[i * 3] = particle.x;
            positions[i * 3 + 1] = particle.y;
            positions[i * 3 + 2] = particle.z;
        }

        geometry.attributes.position.needsUpdate = true;
    }

    return { group, update };
}
