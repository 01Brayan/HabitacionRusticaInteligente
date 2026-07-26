import * as THREE from 'three';

export function createNieveEffect() {
    const group = new THREE.Group();
    const particleCount = 3400;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const data = [];

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        map: createSnowflakeTexture(),
        color: 0xffffff,
        transparent: true,
        opacity: 0.96,
        alphaTest: 0.04,
        depthWrite: false,
        sizeAttenuation: true,
        blending: THREE.NormalBlending,
        vertexColors: true
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

    function createSnowflakeTexture() {
        const size = 128;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        const gradient = ctx.createRadialGradient(size / 2, size / 2, size * 0.02, size / 2, size / 2, size * 0.5);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.92)');
        gradient.addColorStop(0.65, 'rgba(255, 255, 255, 0.18)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);

        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(size * 0.25, size * 0.5);
        ctx.lineTo(size * 0.75, size * 0.5);
        ctx.moveTo(size * 0.5, size * 0.25);
        ctx.lineTo(size * 0.5, size * 0.75);
        ctx.moveTo(size * 0.32, size * 0.32);
        ctx.lineTo(size * 0.68, size * 0.68);
        ctx.moveTo(size * 0.68, size * 0.32);
        ctx.lineTo(size * 0.32, size * 0.68);
        ctx.stroke();

        const texture = new THREE.CanvasTexture(canvas);
        texture.needsUpdate = true;
        return texture;
    }

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
        const tone = 0.85 + Math.random() * 0.15;

        return {
            x,
            y,
            z,
            speed: 0.12 + Math.random() * 0.12,
            driftX: (Math.random() - 0.5) * 0.16,
            driftZ: (Math.random() - 0.5) * 0.16,
            floatOffset: Math.random() * Math.PI * 2,
            tone
        };
    }

    for (let i = 0; i < particleCount; i += 1) {
        const particle = createParticle();
        positions[i * 3] = particle.x;
        positions[i * 3 + 1] = particle.y;
        positions[i * 3 + 2] = particle.z;
        colors[i * 3] = particle.tone;
        colors[i * 3 + 1] = particle.tone;
        colors[i * 3 + 2] = particle.tone;
        data.push(particle);
    }

    function update(delta = 0.016) {
        if (!group.visible) {
            return;
        }

        const time = performance.now() * 0.001;
        const wind = Math.sin(time * 0.26) * 0.3;

        for (let i = 0; i < particleCount; i += 1) {
            const particle = data[i];
            particle.y -= particle.speed * delta * 14;
            particle.x += (wind + particle.driftX) * delta * 12;
            particle.z += (wind * 0.25 + particle.driftZ) * delta * 11;
            particle.y += Math.sin(time + particle.floatOffset) * delta * 0.4;

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
                particle.floatOffset = replacement.floatOffset;
                particle.tone = replacement.tone;
            }

            positions[i * 3] = particle.x;
            positions[i * 3 + 1] = particle.y;
            positions[i * 3 + 2] = particle.z;
            colors[i * 3] = particle.tone;
            colors[i * 3 + 1] = particle.tone;
            colors[i * 3 + 2] = particle.tone;
        }

        geometry.attributes.position.needsUpdate = true;
        geometry.attributes.color.needsUpdate = true;
    }

    return { group, update };
}
