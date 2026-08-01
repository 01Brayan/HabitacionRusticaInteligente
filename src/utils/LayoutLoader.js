// Carga las posiciones guardadas desde el archivo layout.json
// y las aplica a los objetos de la escena por su nombre.
//
// También recrea los objetos duplicados (creados con Editor3D en su momento):
// si el layout tiene datos de un objeto que no existe todavía, pero indica
// de qué "sourceName" (objeto original) proviene, lo clona automáticamente.

export async function applyLayout(layoutUrl, objects, scene) {

    const response = await fetch(layoutUrl);
    if (!response.ok) return;

    const data = await response.json();

    // 1) Recrear duplicados que falten
    if (scene) {

        const currentNames = new Set(objects.map(o => o.name));

        Object.entries(data).forEach(([name, saved]) => {

            if (currentNames.has(name) || !saved.sourceName) return;

            const source = objects.find(o => o.name === saved.sourceName);

            if (!source) {
                console.warn(`No se pudo recrear "${name}": no se encontró su original "${saved.sourceName}"`);
                return;
            }

            const clone = source.clone(true);
            clone.name = name;
            clone.userData.sourceName = saved.sourceName;

            scene.add(clone);
            objects.push(clone);
        });
    }

    // 2) Aplicar posición/rotación/escala a todos (originales + recreados)
    objects.forEach(obj => {
        const saved = data[obj.name];
        if (!saved) return;

        obj.position.fromArray(saved.position);
        obj.rotation.set(saved.rotation[0], saved.rotation[1], saved.rotation[2]);
        obj.scale.fromArray(saved.scale);
    });
}
