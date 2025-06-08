import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/DRACOLoader.js';

document.querySelectorAll(".threejs-container").forEach(container => {
    const modelUrl = container.dataset.model;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0xf5f5f5); // off-white
    container.appendChild(renderer.domElement);

    // lights
    const hemiLight = new THREE.HemisphereLight(0xfff7dd, 0xaaaaff, 1.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.dampingFactor = 0.1;
    controls.zoomDampingFactor = 0.1;
    controls.minDistance = 1;
    controls.maxDistance = 6;
    controls.zoomSpeed = 0.5;

    // loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let model; // global animate()
    let autoRotate = true;
    let rotateTimeout;

    function stopAutoRotateTemporarily() {
        autoRotate = false;
        clearTimeout(rotateTimeout);
        rotateTimeout = setTimeout(() => {
            autoRotate = true;
        }, 3000);
    }

    controls.addEventListener('start', stopAutoRotateTemporarily);

    loader.load(modelUrl, (gltf) => {
        model = gltf.scene;

        // bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const sizeVec = box.getSize(new THREE.Vector3());
        const size = sizeVec.length();

        model.position.sub(center);

        if (!isFinite(size) || size === 0) {
            console.warn("Modellgröße ungültig – wird nicht skaliert.");
        } else {
            const scale = 2.0 / size;
            model.scale.setScalar(scale);
        }

        scene.add(model);

        // camera position
        camera.position.set(0, 0, 3);

        controls.target.set(0, 0, 0);
        controls.update();

        animate();
    }, undefined, (error) => {
        console.error("Fehler beim Laden des Modells:", error);
    });

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        if (autoRotate && model) {
            model.rotation.y += 0.005;
        }

        renderer.render(scene, camera);
    }
});