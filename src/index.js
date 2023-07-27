// client-side js
// run by the browser each time your view template is loaded

// Extract globals, otherwise linting gets angry
import chroma from "chroma-js";
import * as THREE from "three";
import "three/OrbitControls";
import "three/SVGLoader";
import lottie from "lottie-web";
import animationData from "./eye.json";
import faceSVG from "./egg.svg";
import aboutSVG from "./ABOUT.svg";

const lottieEl = document.getElementById("lottie-container");
const animation = lottie.loadAnimation({
  container: lottieEl,
  renderer: "svg",
  loop: false,
  autoplay: false,
  animationData,
});
let frame;
animation.onComplete = () => animation.stop();
lottieEl.onclick = () => (location.href = "https://eyes.klevecz.net");
import { onMouseMove, loadSVG } from "./utils.js";
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var click = false;

const faceContainer = document.getElementById("face-container");
faceContainer.onclick = () => {
  location.href = "https://info.yaytso.art";
  // history.pushState("", "about", "/about");
  // document.getElementById("face-container").style.display = "none";
  // document.getElementById("lottie-container").style.display = "none";
  // document.querySelector("canvas").style.display = "none";
  // cancelAnimationFrame(frame);
  // const container = document.createElement("div");
  // container.id = "about-container";
  // container.style.width = "100%";
  // container.style.background = "white";
  // container.innerHTML = aboutSVG;

  // container.style.position = "absolute";
  // container.style.top = "0px";

  // document.body.prepend(container);
};
window.onpopstate = () => {
  document.getElementById("about-container").remove();
  document.getElementById("face-container").style.display = "block";
  document.getElementById("lottie-container").style.display = "block";
  document.querySelector("canvas").style.display = "block";
  animate();
};

faceContainer.innerHTML = faceSVG;

// Create a scene
var camera, scene, renderer, clock, stats;
var dirLight, spotLight;
var sphere, dirGroup;
var ground;
var material_name;
init();
loadSVG(scene);
animate();
function init() {
  initScene();
  initMisc();

  document.body.appendChild(renderer.domElement);
  window.addEventListener("resize", onWindowResize, false);
}
function initScene() {
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(0, 10, 30);
  scene = new THREE.Scene();
  // Lights
  scene.add(new THREE.AmbientLight(0x000000));
  spotLight = new THREE.SpotLight(0xffffff);
  spotLight.name = "Spot Light";
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.3;
  spotLight.position.set(3, 10, 5);
  spotLight.castShadow = true;
  spotLight.shadow.camera.near = 8;
  spotLight.shadow.camera.far = 200;
  spotLight.shadow.mapSize.width = 256;
  spotLight.shadow.mapSize.height = 256;
  spotLight.shadow.bias = -0.002;
  spotLight.shadow.radius = 4;
  scene.add(spotLight);
  dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
  dirLight.name = "Dir. Light";
  dirLight.position.set(-5, 20, 19);
  dirLight.castShadow = true;
  dirLight.shadow.camera.near = 0.1;
  dirLight.shadow.camera.far = 500;
  dirLight.shadow.camera.right = 17;
  dirLight.shadow.camera.left = -17;
  dirLight.shadow.camera.top = 17;
  dirLight.shadow.camera.bottom = -17;
  dirLight.shadow.mapSize.width = 512;
  dirLight.shadow.mapSize.height = 512;
  dirLight.shadow.radius = 4;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);
  dirGroup = new THREE.Group();
  dirGroup.add(dirLight);
  scene.add(dirGroup);
  // Geometry
  var geometry = new THREE.SphereBufferGeometry(35, 32, 32);
  material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 0,
    specular: 0x222222,
  });
  sphere = new THREE.Mesh(geometry, material);
  sphere.scale.multiplyScalar(1 / 18);
  sphere.position.y = 3;
  sphere.castShadow = true;
  sphere.receiveShadow = false;
  sphere.name = "chicken";
  scene.add(sphere);

  var geometry = new THREE.PlaneBufferGeometry(10, 10);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    shininess: 0,
    specular: 0x111111,
  });
  ground = new THREE.Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y -= 5;
  ground.scale.multiplyScalar(3);
  ground.castShadow = true;
  ground.receiveShadow = true;
  scene.add(ground);
}
function initMisc() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.VSMShadowMap;
  renderer.setClearColor(0xffffff, 1);
  // Mouse control
  var controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.maxPolarAngle = Math.PI / 2;
  controls.update();
  clock = new THREE.Clock();
}
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  frame = requestAnimationFrame(animate);
  render();
}
function renderScene() {
  renderer.render(scene, camera);
}
function render() {
  var delta = clock.getDelta();
  var time = clock.elapsedTime;
  renderScene();
  if (click) {
    raycaster.setFromCamera(mouse, camera);
    // calculate objects intersecting the picking ray
    var intersects = raycaster.intersectObjects(scene.children);

    for (var i = 0; i < intersects.length; i++) {
      console.log(intersects[i].object.name);
      intersects[i].object.material.color.set(0xff0000);
      if (intersects[i].object.name === "chicken") {
        // material_name.color.set(0x000000);
        var ariel_material = scene.children.filter((f) => f.name === "ariel")[0]
          .children[0].material;
        ariel_material.color.set(0xff0000);
      }
    }
  }
  mouse = { x: 9999, y: -9999 };
  sphere.rotation.x += 0.25 * delta;
  sphere.rotation.y += 2 * delta;
  sphere.rotation.z += 1 * delta;
  const randomColor = chroma.random();
  if (Math.floor(time % 5) === 0) animation.play();
  // sphere.material.color = new THREE.Color(randomColor.hex());

  // dirGroup.rotation.y += 0.7 * delta;
  // dirLight.position.z = 17 + Math.sin(time*0.001)*5;
}

window.addEventListener(
  "touchstart",
  (e) => {
    const m = onMouseMove(e, mouse);
    click = true;
    mouse = m;
  },
  false
);
window.addEventListener(
  "click",
  (e) => {
    const m = onMouseMove(e, mouse);
    click = true;
    mouse = m;
  },
  false
);
