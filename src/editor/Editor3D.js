import * as THREE from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls.js';

export class Editor3D {

    constructor(scene, camera, renderer, orbitControls, { onDuplicate } = {}) {

        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.orbitControls = orbitControls;
        this.onDuplicate = onDuplicate; // callback opcional: (clone) => {...}

        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        this.objects = [];
        this.selected = null;
        this.deletedNames = new Set(); // nombres de objetos borrados esta sesión

        this.transform = new TransformControls(camera, renderer.domElement);
        this.transform.setSize(0.8);

        const transformVisual = typeof this.transform.getHelper === 'function'
            ? this.transform.getHelper()
            : this.transform;

        scene.add(transformVisual);

        this.transform.addEventListener('dragging-changed', (event) => {
            orbitControls.enabled = !event.value;
        });

        this.isDragging = false;
        this.transform.addEventListener('dragging-changed', (event) => {
            this.isDragging = event.value;
        });

        renderer.domElement.addEventListener('pointerdown', this.onPointerDown.bind(this));
        window.addEventListener('keydown', this.onKeyDown.bind(this));
    }

    add(...objects) {
        objects.forEach(object => {
            if (!object) return;
            object.userData.editorRoot = true;
            this.objects.push(object);
        });
    }

    remove(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) this.objects.splice(index, 1);

        if (this.selected === object) {
            this.transform.detach();
            this.selected = null;
        }
    }

    duplicate() {

        if (!this.selected) return;

        const clone = this.selected.clone(true);

        clone.name = `${this.selected.name || 'objeto'}_copia_${Date.now()}`;
        clone.userData.sourceName = this.selected.userData.sourceName || this.selected.name;
        clone.position.x += 2;
        clone.userData.editorRoot = true;

        this.scene.add(clone);
        this.objects.push(clone);

        this.selected = clone;
        this.transform.attach(clone);

        console.log('Objeto duplicado:', clone.name);

        if (typeof this.onDuplicate === 'function') {
            this.onDuplicate(clone);
        }
    }

    onPointerDown(event) {

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

    onKeyDown(event) {

        if (event.key.toLowerCase() === 'l' && !event.ctrlKey) {
            this.exportLayout();
            return;
        }

        if (event.ctrlKey && event.key.toLowerCase() === 'd') {
            event.preventDefault();
            this.duplicate();
            return;
        }

        if (!this.selected) return;

        switch (event.key.toLowerCase()) {
            case "w":
                this.transform.setMode("translate");
                break;
            case "e":
                this.transform.setMode("rotate");
                break;
            case "r":
                this.transform.setMode("scale");
                break;
            case "escape":
                this.transform.detach();
                this.selected = null;
                break;
            case "delete":
            case "backspace": {
                const removedName = this.selected.name;
                if (removedName) {
                    this.deletedNames.add(removedName);
                }
                if (this.selected.parent) {
                    this.selected.parent.remove(this.selected);
                }
                this.remove(this.selected);
                console.log("Objeto eliminado:", removedName);
                break;
            }
            case "p":
                this.printSelected();
                break;
        }
    }

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

    exportLayout() {
        const data = this._collectLayoutData();
        data.__deleted = [...this.deletedNames]; // objetos que ya no deben recrearse
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

    printSelected() {
        if (!this.selected) return;
        const p = this.selected.position;
        const r = this.selected.rotation;
        const s = this.selected.scale;
        console.log(`position.set(${p.x.toFixed(2)}, ${p.y.toFixed(2)}, ${p.z.toFixed(2)});`);
        console.log(`rotation.set(${r.x.toFixed(3)}, ${r.y.toFixed(3)}, ${r.z.toFixed(3)});`);
        console.log(`scale.set(${s.x.toFixed(2)}, ${s.y.toFixed(2)}, ${s.z.toFixed(2)});`);
    }
}