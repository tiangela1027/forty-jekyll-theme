const THREE = window.THREE = require('three');
require('three/examples/js/controls/OrbitControls.js');
require('three/examples/js/loaders/OBJLoader.js');

let scene, camera, renderer, controls, ground, sun, moon;
let ADD = 0.05;
let stars = [], poles = [], stripes = [];

let randomInRange = function (from, to) {
    let x = Math.random() * (to - from);
    return x + from;
};

let createSun = function () {
    let geometry = new THREE.SphereGeometry(125, 50, 50);
    let material = new THREE.MeshBasicMaterial({ color: 0xcf613c, side: THREE.DoubleSide });
    sun = new THREE.Mesh(geometry, material);

    sun.position.set(-12, 500, -1100);
    scene.add(sun);
}

let createMoon = function () {
    let geometry = new THREE.SphereGeometry(35, 50, 50);
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    moon = new THREE.Mesh(geometry, material);

    moon.position.set(-12, 500, 1100);
    moon.rotation.x = 150;
    scene.add(moon);
};

let createLightPole = function () {
    let material = new THREE.MeshBasicMaterial({ color: 0x000000 });

    let geometry, poleExtension, pole;
    for (let i = 0; i <= 20; i++) {
        geometry = new THREE.CylinderGeometry(0.5, 0.5, 20, 15, 1);
        poleExtension = new THREE.Mesh(geometry, material);

        poleExtension.rotation.x = Math.PI / 2;
        poleExtension.rotation.z = Math.PI / 2;
        poleExtension.position.set(-9, 25, 0);

        geometry = new THREE.CylinderGeometry(0.5, 0.5, 50, 15, 1);
        poleExtension.updateMatrix();
        geometry.merge(poleExtension.geometry, poleExtension.matrix);

        pole = new THREE.Mesh(geometry, material);
        pole.position.set(30, 18, 200 - i * 1000);

        scene.add(pole);
        poles.push(pole);
    }
};

let createCar = function () {
    createCarInner();
    createCarStructure();
}

let createCarInner = function () {
    let geometry = new THREE.TorusGeometry(0.75, 0.15, 30, 30);
    let material = new THREE.MeshBasicMaterial({ color: 0x161a1c }); // 0x82989e
    let wheel = new THREE.Mesh(geometry, material);

    wheel.position.set(-1, -1, -2.5);
    wheel.rotation.x = -0.5;

    geometry = new THREE.PlaneGeometry(3.75, 4.25, 10, 10);
    material = new THREE.MeshBasicMaterial({ color: 0x586066, side: THREE.DoubleSide });
    let bottomSeat = new THREE.Mesh(geometry, material);

    bottomSeat.rotation.x = Math.PI / 2;
    bottomSeat.position.y = -2.5;

    geometry = new THREE.BoxGeometry(3.75, 2.7, 0.5);
    material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0x0f0f24,
        emissive: 0x88888f,
        emissiveIntensity: 0.5,
        shininess: 100,
    });
    let backSeat = new THREE.Mesh(geometry, material);

    backSeat.position.z = 2.5;
    backSeat.position.y = -1.8;
    backSeat.rotation.x = 0.2;

    geometry = new THREE.BoxGeometry(3.75, 2.7, 0.5);
    let frontSeat = new THREE.Mesh(geometry, material);

    frontSeat.position.y = -1.8;
    frontSeat.rotation.x = 0.2;

    scene.add(bottomSeat);
    scene.add(backSeat);
    scene.add(frontSeat);
    scene.add(wheel);
}

let createCarStructure = function () {
    let geometry = new THREE.PlaneGeometry(5, 6.5, 10, 10);
    let material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
    let floor = new THREE.Mesh(geometry, material);

    floor.rotation.x = Math.PI / 2;
    floor.position.y = -3;
    scene.add(floor);

    geometry = new THREE.BoxGeometry(5, 3, 4);
    material = new THREE.MeshPhongMaterial({
        side: THREE.DoubleSide,
        color: 0x115470,
        emissive: 0x3e706f,
        emissiveIntensity: 0.4,
        shininess: 100,
    });
    let front = new THREE.Mesh(geometry, material);

    front.position.z = -5.25;
    front.position.y = -2.5;

    geometry = new THREE.BoxGeometry(6.5, 3, 0.2);
    let right = new THREE.Mesh(geometry, material);

    right.rotation.y = Math.PI / 2;
    right.position.y = -2.5;
    right.position.x = -2.4;

    geometry = new THREE.BoxGeometry(6.5, 3, 0.2);
    let left = new THREE.Mesh(geometry, material);

    left.rotation.y = Math.PI / 2;
    left.position.y = -2.5;
    left.position.x = 2.4;

    geometry = new THREE.BoxGeometry(5, 3, 3);
    let back = new THREE.Mesh(geometry, material);

    back.position.z = 4.75;
    back.position.y = -2.5;

    scene.add(front);
    scene.add(left);
    scene.add(right);
    scene.add(back);
};

let createRoadStripes = function () {
    let geometry;
    let material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    for (var i = 0; i < 100; i++) {
        geometry = new THREE.PlaneGeometry(0.75, 30, 10, 10);
        stripe = new THREE.Mesh(geometry, material);

        stripe.position.set(-12, -4.8, 200 - i * 100);
        stripe.rotation.x = Math.PI / 2;

        scene.add(stripe);
        stripes.push(stripe);
    }
}

let createEarth = function () {
    let geometry = new THREE.PlaneGeometry(500, 2000, 50, 50);
    let material = new THREE.MeshBasicMaterial({ color: 0x947c4b, side: THREE.DoubleSide });
    ground = new THREE.Mesh(geometry, material);

    geometry = new THREE.PlaneGeometry(50, 2000, 100, 50);
    material = new THREE.MeshBasicMaterial({ color: 0x363b37, side: THREE.DoubleSide });
    let road = new THREE.Mesh(geometry, material);

    ground.rotation.x = Math.PI / 2;
    ground.position.y = -5;

    road.rotation.x = Math.PI / 2;
    road.position.x = -12;
    road.position.y = -4.9;

    scene.add(ground);
    scene.add(road);
};

let createStars = function () {
    let geometry, material, star;
    for (let i = 1; i <= 75; i++) {
        geometry = new THREE.SphereGeometry(0.5, 30, 30);
        material = new THREE.MeshBasicMaterial({ color: 0xf7f3b2 });
        star = new THREE.Mesh(geometry, material);

        star.position.x = randomInRange(-100, 100);
        star.position.y = randomInRange(4, 100);
        star.position.z = randomInRange(-100, 100);

        star.rotation.y = randomInRange(0, Math.PI / 2);
        star.material.side = THREE.DoubleSide;

        stars.push(star);
        scene.add(star);
    }
};

// set up the environment - 
// initialize scene, camera, objects, and renderer
let init = function () {
    // 1. create the scene
    scene = new THREE.Scene();

    let skyTexture = new THREE.TextureLoader().load('assets/sunset.jpg');
    skyTexture.wrapS = THREE.RepeatWrapping;
    skyTexture.wrapT = THREE.RepeatWrapping;
    // skyTexture.repeat.set(4, 4);

    scene.background = skyTexture;
    scene.fog = new THREE.Fog(0xcf613c, 1000, 1300);

    // 2. create and locate the camera
    camera = new THREE.PerspectiveCamera(30,
        window.innerWidth / window.innerHeight,
        1,
        1500);
    camera.position.z = 1;

    // 3. create and locate the objects on the scene
    createStars();
    createEarth();
    createCar();
    createRoadStripes();
    createSun();
    createMoon();
    createLightPole();

    // 4. create the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    light = new THREE.DirectionalLight(0x4bb2cc);
    scene.add(light);

    document.body.appendChild(renderer.domElement);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.screenSpacePanning = false;
    controls.enableZoom = false;
};

let clock = new THREE.Clock();
let time = 0;
let delta = 0;
let direction = new THREE.Vector3(0, 0, 1);
let speed = 125; // units a second - 2 seconds

// main animation loop - calls every 50 - 60 ms
let mainLoop = function () {
    delta = clock.getDelta();
    time += delta;

    stripes.forEach(function (stripe) {
        stripe.position.addScaledVector(direction, speed * delta);
        if (stripe.position.z >= 2000) {
            stripe.position.z = -1000;
        }
    });

    poles.forEach(function (pole) {
        pole.position.addScaledVector(direction, speed * delta);
        if (pole.position.z >= 2000) {
            pole.position.z = -1000;
        }
    });

    let x = Math.random();

    stars.forEach(star => {
        star.material.transparent = true;
        if (x < 0.1)
            star.material.opacity = randomInRange(0.25, 1);
    });

    if (sun.position.y > 0)
        sun.position.y -= ADD;

    renderer.render(scene, camera);
    requestAnimationFrame(mainLoop);
};

init();
mainLoop();