import * as THREE from 'three/build/three.module.js';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import createGradient from './createGradient';
import exportGLTF from './utils/exportGLTF';
import importGLBModel from './utils/importGLBModel';

let container;
let camera, cameraPosZoomZ, model, object, object2, material, geometry, scene1, scene2, renderer, orbitControl;
let gridHelper, gridHelper2, sphere, waltHead;

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

const reductionOutput = document.getElementById('model_redu');
reductionOutput.innerText = '0.1'
const rendererTriangles = document.getElementById('model_nb_triangles');
const modelSize = document.getElementById('model_size');
const compressedModelSize = document.getElementById(`compressed_model_size`);
// const compressedModelTriangles = document.getElementById(`compressed_model_nb_triangles`);

init();
animate();

document.getElementById('option_max_reduction')
  .addEventListener('input', (ev) => {
    reductionOutput.innerText = ev.target.value;
  } )

document.getElementById('export_scene')
  .addEventListener('click', function () {
    exportGLTF(link, scene1.children[5]);
  });

document.getElementById('import_model')
  .addEventListener('change',
    async (ev) => {

      model = await importGLBModel({
        ev, 
        scene1, 
        scene2, 
        modelSize, 
        compressedModelSize,
        rendererTriangles,
        renderer, 
        camera, 
        cameraPosZoomZ,
        reductionValue: reductionOutput.innerText
      });
      console.log(cameraPosZoomZ);
      camera.zoom = cameraPosZoomZ;
    });

function init() {
  console.log("init")
  container = document.createElement('div');
  document.body.appendChild(container);

  // const gradientTexture = createGradient();

  // ---------------------------------------------------------------------
  // Scenes
  // ---------------------------------------------------------------------
  scene1 = new THREE.Scene();
  const backColor = new THREE.Color(0x505050);
  scene1.background = backColor;
  scene1.name = 'Scene1';

  scene2 = new THREE.Scene();
  scene2.name = 'Scene2';
  scene2.translateX(520);
  
  // ---------------------------------------------------------------------
  // Perspective Camera
  // ---------------------------------------------------------------------
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(600, 400, 0);

  camera.name = "PerspectiveCamera";
  cameraPosZoomZ = scene1.position;
  scene1.add(camera);

  // ---------------------------------------------------------------------
  // Ambient light
  // ---------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  ambientLight.name = 'AmbientLight';
  scene1.add(ambientLight);

  const ambientLight2 = new THREE.AmbientLight(0xffffff, 2);
  ambientLight2.name = 'AmbientLight 2';
  scene2.add(ambientLight2);
  // ---------------------------------------------------------------------
  // DirectLight
  // ---------------------------------------------------------------------
  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 10);
  dirLight.name = 'DirectionalLight';
  // dirLight.target.position.set(-3000, 5000, 5000);
  dirLight.add(dirLight.target);
  dirLight.target.position.set(-3000, 5000, - 1);
  dirLight.lookAt(100, 500, 100);
  scene1.add(dirLight);

  const dirLight2 = new THREE.DirectionalLight(0xFFFFFF, 10);
  dirLight2.name = 'DirectionalLight 2';
  // dirLight.target.position.set(-3000, 5000, 5000);
  dirLight2.add(dirLight.target);
  // dirLight2.target.position.set(0, 10000, - 1);
  dirLight2.lookAt(0, 0, 0);
  scene2.add(dirLight2);

  // ---------------------------------------------------------------------
  // Grid
  // ---------------------------------------------------------------------

  gridHelper = new THREE.GridHelper(500, 20, 0x888888, 0x444444);
  gridHelper.position.y = - 50;
  gridHelper.name = "Grid";
  scene1.add(gridHelper);

  gridHelper2 = new THREE.GridHelper(500, 20, 0xaabb55, 0xaabb99);
  gridHelper2.position.y = - 50;
  gridHelper2.name = "Grid 2";
  scene2.add(gridHelper2);

  // ---------------------------------------------------------------------
  // Axes
  // ---------------------------------------------------------------------
  const axes = new THREE.AxesHelper(400);
  axes.name = "AxesHelper";
  const axes1 = new THREE.AxesHelper(400);
  axes1.name = "AxesHelper";
  scene1.add(axes);
  scene2.add(axes1);

  // ---------------------------------------------------------------------
  // OrbitControls
  // ---------------------------------------------------------------------

  function createOrbitControl() {
    orbitControl = new OrbitControls(camera, container);
  }

  createOrbitControl()

 
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

//

function animate() {
  requestAnimationFrame(animate);

  render();
}

function render() {
  rendererTriangles.innerText = renderer.info.render.triangles;
  // const timer = Date.now() * 0.0005;

  // camera.position.x = Math.cos(timer) * 800;
  // camera.position.z = Math.sin(timer) * 800;
  // camera.position.x = 510;
  // camera.position.z = 510;

  camera.lookAt(scene1.position);
  orbitControl.update()
  renderer.autoClear = false;

  renderer.render(scene1, camera);
  renderer.render(scene2, camera);
}
