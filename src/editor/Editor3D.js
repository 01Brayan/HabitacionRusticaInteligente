import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export class Editor3D {

    constructor(scene, camera, renderer, orbitControls) {

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.orbitControls = orbitControls;

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.objects = [];
        this.selected = null;

        this.transform = new TransformControls(
            camera,
            renderer.domElement
        );

        this.transform.setSize(0.8);

        // IMPORTANTE: en three.js reciente (r169+) TransformControls
        // ya no es un Object3D. Hay que agregar su "helper" a la escena.
        // Esto funciona tanto en versiones nuevas como viejas.
        const transformVisual = typeof this.transform.getHelper === 'function'
            ? this.transform.getHelper()
            : this.transform;

        scene.add(transformVisual);

        this.transform.addEventListener('dragging-changed', (event) => {
            orbitControls.enabled = !event.value;
        });

        // Para saber si el usuario está arrastrando el gizmo
        this.isDragging = false;
        this.transform.addEventListener('dragging-changed', (event) => {
            this.isDragging = event.value;
        });

        renderer.domElement.addEventListener(
            'pointerdown',
            this.onPointerDown.bind(this)
        );

        window.addEventListener(
            'keydown',
            this.onKeyDown.bind(this)
        );
    }

    //-----------------------------------------------------

    add(...objects) {
        objects.forEach(object => {
            if (!object) return;
            object.userData.editorRoot = true;
            this.objects.push(object);
        });
    }

    //-----------------------------------------------------

    remove(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }

        if (this.selected === object) {
            this.transform.detach();
            this.selected = null;
        }
    }

    //-----------------------------------------------------

    duplicate() {

        if (!this.selected) return;

        const clone = this.selected.clone(true); // true = clona también los hijos

        // Nombre único para que el layout no lo confunda con el original
        clone.name = `${this.selected.name || 'objeto'}_copia_${Date.now()}`;

        // Recuerda de qué objeto original viene (para poder recrearlo al recargar).
        // Si "selected" ya era un duplicado, apunta al mismo origen (evita cadenas).
        clone.userData.sourceName = this.selected.userData.sourceName || this.selected.name;

        // Pequeño desplazamiento para que no quede exactamente encima del original
        clone.position.x += 2;

        clone.userData.editorRoot = true;

        this.scene.add(clone);
        this.objects.push(clone);

        this.selected = clone;
        this.transform.attach(clone);

        console.log('Objeto duplicado:', clone.name);
    }

    //-----------------------------------------------------

    onPointerDown(event) {

        // Si se está arrastrando el gizmo, no tocar la selección
        if (this.transform.dragging || this.isDragging) return;

        const rect = this.renderer.domElement.getBoundingClientRect();

        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);

        const intersects = this.raycaster.intersectObjects(this.objects, true);

        if (intersects.length === 0) {
            this.selected = null;
            this.transform.detach();
            return;
        }

        let object = intersects[0].object;

        while (object) {
            if (object.userData.editorRoot) break;
            object = object.parent;
        }

        if (!object) {
            this.transform.detach();
            this.selected = null;
            return;
        }

        this.selected = object;
        this.transform.attach(this.selected);
    }

    //-----------------------------------------------------

    onKeyDown(event) {

        // Exportar layout a archivo .json con la tecla "L"
        // (Ctrl+S está reservado por el navegador y no se puede sobrescribir)
        if (event.key.toLowerCase() === 'l' && !event.ctrlKey) {
            this.exportLayout();
            return;
        }

        if (event.ctrlKey && event.key.toLowerCase() === 'd') {
            event.preventDefault(); // evita que el navegador abra "Agregar a favoritos"
            this.duplicate();
            return;
        }

        if (!this.selected) return;

        switch (event.key.toLowerCase()) {

            case "w":
                this.transform.setMode("translate");
                console.log("Modo: Mover");
                break;

            case "e":
                this.transform.setMode("rotate");
                console.log("Modo: Rotar");
                break;

            case "r":
                this.transform.setMode("scale");
                console.log("Modo: Escalar");
                break;

            case "escape":
                this.transform.detach();
                this.selected = null;
                console.log("Deseleccionado");
                break;

            case "delete":
            case "backspace":
                // Importante: el objeto puede no ser hijo directo de "scene"
                // (por ejemplo, los objetos de Blender viven dentro de un
                // grupo "decorations"). Hay que quitarlo de su padre real.
                if (this.selected.parent) {
                    this.selected.parent.remove(this.selected);
                }
                this.remove(this.selected);
                console.log("Objeto eliminado");
                break;

            case "p":
                this.printSelected();
                break;
        }
    }

    //-----------------------------------------------------
    // RECOLECTAR / APLICAR datos de transformación (uso interno,
    // compartido por guardar, cargar y exportar)
    //-----------------------------------------------------

    _collectLayoutData() {

        const data = {};

        this.objects.forEach(object => {

            if (!object.name) {
                console.warn('Objeto sin "name", no se puede guardar de forma confiable:', object);
                return;
            }

            data[object.name] = {
                position: object.position.toArray(),
                rotation: [object.rotation.x, object.rotation.y, object.rotation.z],
                scale: object.scale.toArray(),
                sourceName: object.userData.sourceName || null
            };
        });

        return data;
    }

    _applyLayoutData(data) {

        // 1) Recrea los duplicados que falten (objetos guardados que no
        //    existen todavía en esta sesión, pero tienen un "sourceName").
        const currentNames = new Set(this.objects.map(o => o.name));

        Object.entries(data).forEach(([name, saved]) => {

            if (currentNames.has(name) || !saved.sourceName) return;

            const source = this.objects.find(o => o.name === saved.sourceName);

            if (!source) {
                console.warn(`No se pudo recrear "${name}": no se encontró su original "${saved.sourceName}"`);
                return;
            }

            const clone = source.clone(true);
            clone.name = name;
            clone.userData.editorRoot = true;
            clone.userData.sourceName = saved.sourceName;

            this.scene.add(clone);
            this.objects.push(clone);
        });

        // 2) Aplica posición/rotación/escala a todos (originales + recreados)
        this.objects.forEach(object => {

            const saved = data[object.name];

            if (!saved) return;

            object.position.fromArray(saved.position);
            object.rotation.set(saved.rotation[0], saved.rotation[1], saved.rotation[2]);
            object.scale.fromArray(saved.scale);
        });
    }

    //-----------------------------------------------------
    // EXPORTAR/CARGAR desde un archivo .json del proyecto
    // (esto viaja con Git; no se usa localStorage)
    //-----------------------------------------------------

    exportLayout() {

        const data = this._collectLayoutData();

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'layout.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        console.log('Layout exportado ✅ (revisa tu carpeta de Descargas)');
    }

    async loadLayoutFromFile(url) {

        try {
            const response = await fetch(url);

            if (!response.ok) {
                console.warn(`No se encontró layout en "${url}" (${response.status})`);
                return;
            }

            const data = await response.json();
            this._applyLayoutData(data);
            console.log('Layout cargado desde archivo ✅');

        } catch (error) {
            console.warn('Error cargando layout desde archivo:', error);
        }
    }

    //-----------------------------------------------------

    printSelected() {

        if (!this.selected) return;

        const p = this.selected.position;
        const r = this.selected.rotation;
        const s = this.selected.scale;

        console.clear();
        console.log("================================");
        console.log("OBJETO SELECCIONADO");
        console.log("================================");
        console.log("Posición");
        console.log(`x: ${p.x}`);
        console.log(`y: ${p.y}`);
        console.log(`z: ${p.z}`);
        console.log("");
        console.log("Rotación");
        console.log(`x: ${THREE.MathUtils.radToDeg(r.x).toFixed(2)}°`);
        console.log(`y: ${THREE.MathUtils.radToDeg(r.y).toFixed(2)}°`);
        console.log(`z: ${THREE.MathUtils.radToDeg(r.z).toFixed(2)}°`);
        console.log("");
        console.log("Escala");
        console.log(`x: ${s.x}`);
        console.log(`y: ${s.y}`);
        console.log(`z: ${s.z}`);
        console.log("");
        console.log("Código");
        console.log(`position.set(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)});`);
        console.log(`rotation.set(
${r.x.toFixed(3)},
${r.y.toFixed(3)},
${r.z.toFixed(3)}
);`);
        console.log(`scale.set(${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)});`);
        console.log("================================");
    }
}