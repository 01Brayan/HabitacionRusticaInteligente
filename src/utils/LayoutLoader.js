// Carga las posiciones guardadas desde el archivo layout.json
// y las aplica a los objetos de la escena por su nombre.

export async function applyLayout(layoutUrl, objects) {
    const response = await fetch(layoutUrl);
    if (!response.ok) return;

    const data = await response.json();

    objects.forEach(obj => {
        const saved = data[obj.name];
        if (!saved) return;

        obj.position.fromArray(saved.position);
        obj.rotation.set(saved.rotation[0], saved.rotation[1], saved.rotation[2]);
        obj.scale.fromArray(saved.scale);
    });
}
