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
    renderer.setClearColor(0xb6afa3); // viewport color
    container.appendChild(renderer.domElement);

    // lights
    const hemiLight = new THREE.HemisphereLight(0xfffaea, 0xaaaaff, 1.8);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = true;
    controls.dampingFactor = 0.1;
    controls.zoomDampingFactor = 0.1;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.zoomSpeed = 0.8;
    controls.minDistance = 0.5;
    controls.maxDistance = 10;

    // loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    let model; // global animate()
    let mixer;
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
        model.position.setY(-0.3);

        if (!isFinite(size) || size === 0) {
            console.warn("Modellgröße ungültig – wird nicht skaliert.");
        } else {
            const scale = 2.5 / size;
            model.scale.setScalar(scale);
        }

        scene.add(model);

        // animation
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        // camera position
        camera.position.set(0, 0, 1.6);

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

        if (mixer) mixer.update(0.016); // ca. 60fps

        renderer.render(scene, camera);
    }
});