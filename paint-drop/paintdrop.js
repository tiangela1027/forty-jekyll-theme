const THREE = window.THREE = require('three');
require('three/examples/js/controls/OrbitControls.js');

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
}

let changeText = function (hexString) {
    $("#colour").text("0x" + hexString.toUpperCase());
    $("#colour").css('color', hexString);
};

let scene, camera, renderer, raindrop, controls, color;

let ADD = 0.02;
raindrops = [];
cats = [];

let randomInRange = function (from, to) {
    let x = Math.random() * (to - from);
    return x + from;
};

let createRaindrop = function () {
    material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff });

    // for (let i = 1; i <= 150; i++) {
    let geometry = new THREE.ConeGeometry(0.1, 0.3, 20, 1);

    let raindropCone = new THREE.Mesh(geometry, material);
    raindropCone.position.y = 0.17;

    geometry = new THREE.SphereGeometry(0.101, 30, 30);
    raindropCone.updateMatrix();
    geometry.merge(raindropCone.geometry, raindropCone.matrix);

    raindrop = new THREE.Mesh(geometry, material);

    raindrop.position.x = randomInRange(-10, 10);
    raindrop.position.z = randomInRange(-10, 10);
    raindrop.position.y = 10;

    scene.add(raindrop);
    raindrops.push(raindrop);
};

// set up the environment - 
// initialize scene, camera, objects, and renderer
let init = function () {
    // 1. create the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xc1cee3);
    scene.fog = new THREE.Fog('lightblue', -7, 25);

    // 2. create and locate the camera
    camera = new THREE.PerspectiveCamera(30,
        window.innerWidth / window.innerHeight,
        1,
        500);
    camera.position.z = 5;

    // 3. create and locate the objects on the scene
    light = new THREE.DirectionalLight(0xffffff);
    scene.add(light);

    // 4. create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = false;

    document.body.appendChild(renderer.domElement);
    window.addEventListener('mousemove', onMouseMove, false);
};

// main animation loop - calls every 50 - 60 ms
let mainLoop = function () {
    let x = Math.random();
    if (x < 0.1)
        createRaindrop();

    raindrops.forEach(raindrop => raindrop.position.y -= ADD);

    raycaster.setFromCamera(mouse, camera);

    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    if (x < 0.05) {
        for (var i = 0; i < intersects.length; i++) {
            color = intersects[i].object.material.color.getHexString()
            changeText(color);
        }
    }

    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

init();
mainLoop();