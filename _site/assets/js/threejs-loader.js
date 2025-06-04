import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

document.querySelectorAll(".threejs-container").forEach(container => {
    const modelUrl = container.dataset.model;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xf5f5f5); // hellgrau-weiß
    container.appendChild(renderer.domElement);

    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new GLTFLoader();
    loader.load(modelUrl, (gltf) => {
        const model = gltf.scene;

        // Modell zentrieren anhand Bounding Box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // verschiebt das Modell zum Ursprung

        // Optional: Modell skalieren, wenn es zu groß/klein wirkt
        const size = box.getSize(new THREE.Vector3()).length();
        const scale = 2 / size; // skaliere auf etwa 2 Einheiten Länge
        model.scale.setScalar(scale);

        scene.add(model);
        animate();
    }, undefined, (error) => {
        console.error("Fehler", error);
    });

    camera.position.z = 5;

    let rotationGroup = null;

    loader.load(modelUrl, (gltf) => {
        const model = gltf.scene;

        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        const size = box.getSize(new THREE.Vector3()).length();
        const scale = 2 / size;
        model.scale.setScalar(scale);

        // Modell in Gruppe, um Rotation zu steuern
        rotationGroup = new THREE.Group();
        rotationGroup.add(model);
        scene.add(rotationGroup);

        animate();
    }, undefined, (error) => {
        console.error("Fehler", error);
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        if (rotationGroup) {
            rotationGroup.rotation.y += 0.005; // langsame Rotation
        }

        renderer.render(scene, camera);
    }
});