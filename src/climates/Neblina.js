import * as THREE from 'three';

export function createNeblinaEffect() {
    const group = new THREE.Group();
    const particleCount = 2600;
    const width = 620;
    const depth = 520;
    const height = 24;
    const baseHeight = -1.5;
    const houseWidth = 62;
    const houseDepth = 78;
    const margin = 10;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const data = [];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        map: createFogSpriteTexture(),
        vertexColors: true,
        size: 92,
        transparent: true,
        opacity: 0.24,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.NormalBlending
    });

    function createFogSpriteTexture() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createRadialGradient(
            size / 2,
            size / 2,
            size * 0.08,
            size / 2,
            size / 2,
            size * 0.55
        );

        gradient.addColorStop(0, 'rgba(230, 240, 250, 0.95)');
        gradient.addColorStop(0.6, 'rgba(210, 225, 238, 0.3)');
        gradient.addColorStop(1, 'rgba(210, 225, 238, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

    const particles = new THREE.Points(geometry, material);
    group.add(particles);

    function isOutsideHouse(x, z) {
        return Math.abs(x) > houseWidth + margin || Math.abs(z) > houseDepth + margin;
    }

    function createParticle() {
        let x;
        let z;

        do {
            x = (Math.random() - 0.5) * width;
            z = (Math.random() - 0.5) * depth;
        } while (!isOutsideHouse(x, z));

        return {
            x,
            y: baseHeight + Math.random() * height,
            z,
            driftX: (Math.random() - 0.5) * 0.06,
            driftZ: (Math.random() - 0.5) * 0.06,
            floatOffset: Math.random() * Math.PI * 2
        };
    }

    for (let i = 0; i < particleCount; i += 1) {
        const particle = createParticle();
        positions[i * 3] = particle.x;
        positions[i * 3 + 1] = particle.y;
        positions[i * 3 + 2] = particle.z;

        const tone = 0.78 + Math.random() * 0.16;
        colors[i * 3] = tone * 0.84;
        colors[i * 3 + 1] = tone * 0.90;
        colors[i * 3 + 2] = tone * 0.96;

        data.push(particle);
    }

    function update(delta = 0.016) {
        if (!group.visible) {
            return;
        }

        const time = performance.now() * 0.0004;

        for (let i = 0; i < particleCount; i += 1) {
            const particle = data[i];
            particle.x += particle.driftX * delta * 12;
            particle.z += particle.driftZ * delta * 12;
            particle.y = baseHeight + 1.2 + Math.sin(time + particle.floatOffset) * 2.0;

            if (
                particle.x < -width / 2 ||
                particle.x > width / 2 ||
                particle.z < -depth / 2 ||
                particle.z > depth / 2
            ) {
                const replacement = createParticle();
                particle.x = replacement.x;
                particle.y = replacement.y;
                particle.z = replacement.z;
                particle.driftX = replacement.driftX;
                particle.driftZ = replacement.driftZ;
                particle.floatOffset = replacement.floatOffset;
            }

            positions[i * 3] = particle.x;
            positions[i * 3 + 1] = particle.y;
            positions[i * 3 + 2] = particle.z;
        }

        geometry.attributes.position.needsUpdate = true;
    }

    return { group, update };
}
