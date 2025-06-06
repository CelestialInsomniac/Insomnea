import * as THREE from "three";
import { OrbitControls } from "https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js";

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
    controls.enableDamping = true;

    const loader = new GLTFLoader();

    let rotationGroup = new THREE.Group();
    scene.add(rotationGroup);

    let autoRotate = true;
    let rotateTimeout;

    // stop rotation
    function stopAutoRotateTemporarily() {
        autoRotate = false;
        clearTimeout(rotateTimeout);
        rotateTimeout = setTimeout(() => {
            autoRotate = true;
        }, 3000);
    }

    controls.addEventListener('start', stopAutoRotateTemporarily);

    let mixer;

    loader.load(modelUrl, (gltf) => {
        const model = gltf.scene;
        mixer = new THREE.AnimationMixer(model);

        gltf.animations.forEach(clip => {
            mixer.clipAction(clip).play();
        });

        // bounding box
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        const sizeVec = box.getSize(new THREE.Vector3());
        const size = sizeVec.length();

        // scaling
        if (!isFinite(size) || size === 0) {
            console.warn("Modellgröße ungültig – wird nicht skaliert.");
        } else {
            const scale = 2 / size;
            model.scale.setScalar(scale);
        }

        model.position.sub(center);
        rotationGroup.add(model);

        // camera
        const adjustedZ = size * 1.2;
        camera.position.set(0, 0, adjustedZ || 5);
        camera.lookAt(new THREE.Vector3(0, 0, 0));

        animate();
    }, undefined, (error) => {
        console.error("Fehler beim Laden des Modells:", error);
    });

    let clock = new THREE.Clock(); // global oder oben in der Funktion definieren

    function animate() {
        requestAnimationFrame(animate);
        const delta = clock.getDelta();

        controls.update();
        if (autoRotate) {
            rotationGroup.rotation.y += 0.005;
        }

        if (mixer) mixer.update(delta); // Animationen updaten
        renderer.render(scene, camera);
    }})