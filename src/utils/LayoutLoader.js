// Carga las posiciones guardadas desde el archivo layout.json
// y las aplica a los objetos de la escena por su nombre.
//
// También:
// - Recrea objetos duplicados (creados con Editor3D): si el layout tiene
//   datos de un objeto que no existe todavía, pero indica de qué
//   "sourceName" proviene, lo clona automáticamente.
// - Elimina objetos que fueron borrados con el editor (guardados en
//   data.__deleted), para que no reaparezcan al recargar la página.
//
// IMPORTANTE: primero se recrean los duplicados y DESPUÉS se eliminan los
// borrados. Si se hiciera al revés, borrar un objeto original eliminaría
// también, por accidente, cualquier copia que se haya hecho de él (ya no
// habría de dónde clonarla).

// Si el objeto no tiene "sourceName" guardado (entradas viejas, de antes de
// que Editor3D lo guardara), lo deduce a partir de su propio nombre:
// "lamp2_copia_123_copia_456" → "lamp2"
function inferSourceName(name, saved) {
    if (saved.sourceName) return saved.sourceName;
    const index = name.indexOf('_copia_');
    return index === -1 ? null : name.slice(0, index);
}

export async function applyLayout(layoutUrl, objects, scene) {

    const response = await fetch(layoutUrl);
    if (!response.ok) return;

    const data = await response.json();
    const deletedNames = new Set(data.__deleted || []);

    // 1) Recrear duplicados que falten (los originales todavía existen acá)
    if (scene) {

        const currentNames = new Set(objects.map(o => o.name));

        Object.entries(data).forEach(([name, saved]) => {

            if (name === '__deleted') return;
            if (currentNames.has(name)) return;
            if (deletedNames.has(name)) return; // no recrear algo que se borró a propósito

            const sourceName = inferSourceName(name, saved);
            if (!sourceName) return; // no es un duplicado, no hay nada que recrear

            const source = objects.find(o => o.name === sourceName);

            if (!source) {
                console.warn(`No se pudo recrear "${name}": no se encontró su original "${sourceName}"`);
                return;
            }

            const clone = source.clone(true);
            clone.name = name;
            clone.userData.sourceName = sourceName;

            scene.add(clone);
            objects.push(clone);
        });
    }

    // 2) Ahora sí, eliminar los objetos que el usuario borró
    if (deletedNames.size > 0) {
        for (let i = objects.length - 1; i >= 0; i--) {
            const object = objects[i];
            if (!deletedNames.has(object.name)) continue;

            if (object.parent) {
                object.parent.remove(object);
            }
            objects.splice(i, 1);
        }
    }

    // 3) Aplicar posición/rotación/escala a todos los que quedan
    objects.forEach(obj => {
        const saved = data[obj.name];
        if (!saved) return;

        obj.position.fromArray(saved.position);
        obj.rotation.set(saved.rotation[0], saved.rotation[1], saved.rotation[2]);
        obj.scale.fromArray(saved.scale);
    });
}