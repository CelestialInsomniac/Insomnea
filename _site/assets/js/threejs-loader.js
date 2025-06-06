import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

document.querySelectorAll(".threejs-container").forEach(container => {
    const modelUrl = container.dataset.model;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xf5f5f5); // off-white Hintergrund
    container.appendChild(renderer.domElement);

    // lights
    const hemiLight = new THREE.HemisphereLight(0xfff4e5, 0xaaaaff, 1.2);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const loader = new GLTFLoader();

    loader.load(modelUrl, (gltf) => {
        const model = gltf.scene;

        // bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center); // zentrieren

        const size = box.getSize(new THREE.Vector3()).length();
        const scale = 2 / size;
        model.scale.setScalar(scale);

        // rotation
        const rotationGroup = new THREE.Group();
        rotationGroup.add(model);
        scene.add(rotationGroup);

        // camera position
        const adjustedZ = size * 1.5;
        camera.position.set(0, 0, adjustedZ);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        // animation
        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            rotationGroup.rotation.y += 0.005;
            renderer.render(scene, camera);
        }

        animate();
    }, undefined, (error) => {
        console.error("Fehler beim Laden des Modells:", error);
    });
});