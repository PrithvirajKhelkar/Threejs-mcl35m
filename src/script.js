import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as dat from "dat.gui";

/**
 * Base
 */

const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
const spotLight = new THREE.SpotLight("#ff9700", 1, 10, Math.PI * 0.1, 0.25, 1);
spotLight.position.set(0, 2, 3);
spotLight.castShadow = true;
gui.add(spotLight, "intensity").min(0).max(20).step(0.001);
scene.add(spotLight);

const rectLight = new THREE.RectAreaLight( "#005fdb", 10,  1, 10 );
rectLight.position.set( 0, 0, -3 );
rectLight.lookAt( 0, 0, 0 );
scene.add( rectLight );

const rectLight2 = new THREE.RectAreaLight( "#005fdb", 15,  1, 10 );
rectLight2.position.set( 0, 0, 6 );
rectLight2.lookAt( 0, 0, 0 );
scene.add( rectLight2 );



const gltfLoader = new GLTFLoader();
/**
 * Models
 */

gltfLoader.load(
    "/models/scene.gltf",
    (gltf) =>
    {
        const obj = gltf.scene.children[0];
        obj.scale.set(1, 1, 1);
        obj.position.y=0.6;
        obj.castShadow = true;
        spotLight.target = obj;
        scene.add(obj);
    }
);

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneBufferGeometry(50, 50),
    new THREE.MeshStandardMaterial({
        color: "#444444",
        metalness: 0,
        roughness: 0.5
    })
);

floor.receiveShadow = true;
floor.rotation.x = - Math.PI * 0.5;
scene.add(floor);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener("resize", () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(2, 2, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const clock = new THREE.Clock();
let previousTime = 0;

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime();
    previousTime = elapsedTime;

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
}

tick();