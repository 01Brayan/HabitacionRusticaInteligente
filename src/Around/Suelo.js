import * as THREE from 'three';

export function createSueloExterior() {
    const group = new THREE.Group();

    const geometry = new THREE.PlaneGeometry(260, 240, 160, 140);
    geometry.rotateX(-Math.PI / 2);

    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i += 1) {
        const x = position.getX(i);
        const z = position.getZ(i);
        const height = Math.sin(x * 0.02) * 2.5 + Math.cos(z * 0.03) * 1.8;
        const noise = (Math.random() - 0.5) * 0.9;
        position.setY(i, height + noise);
    }
    geometry.computeVertexNormals();

    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b7b6d,
        roughness: 1,
        metalness: 0,
        flatShading: true,
    });

    const plane = new THREE.Mesh(geometry, groundMaterial);
    plane.receiveShadow = true;
    plane.position.y = -2.8;
    group.add(plane);

    const stoneGeometry = new THREE.DodecahedronGeometry(2.5, 0);
    const stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x5f5749,
        roughness: 0.95,
        metalness: 0.02,
    });

    const stonePositions = [
        { x: -18, z: 16, y: 0.7, scale: 1 },
        { x: 22, z: 10, y: 1.5, scale: 1.3 },
        { x: 6, z: 36, y: 1.2, scale: 0.9 }
    ];

    stonePositions.forEach((pos) => {
        const rock = new THREE.Mesh(stoneGeometry, stoneMaterial);
        rock.scale.setScalar(pos.scale);
        rock.position.set(pos.x, pos.y - 2.8, pos.z);
        rock.castShadow = true;
        rock.receiveShadow = true;
        group.add(rock);
    });

    function setWeather(weather) {
        switch (weather) {
            case 'lluvia':
                groundMaterial.color.set(0x7f7568);
                groundMaterial.roughness = 0.96;
                groundMaterial.metalness = 0.01;
                break;
            case 'nieve':
                groundMaterial.color.set(0x9aa4ab);
                groundMaterial.roughness = 0.98;
                groundMaterial.metalness = 0;
                break;
            case 'neblina':
                groundMaterial.color.set(0x7f8688);
                groundMaterial.roughness = 0.99;
                groundMaterial.metalness = 0;
                break;
            default:
                groundMaterial.color.set(0x8b7b6d);
                groundMaterial.roughness = 1;
                groundMaterial.metalness = 0;
                break;
        }
    }

    return { group, setWeather };
}