import * as THREE from 'three/build/three.module.js';
// import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import createGradient from './createGradient';
import exportGLTF from './utils/exportGLTF';
import importGLBModel from './utils/importGLBModel';

let container;
let camera, cameraPos, model, object, object2, material, geometry, scene1, scene2, renderer, orbitControl;
let gridHelper, sphere, waltHead;

const link = document.createElement('a');
link.style.display = 'none';
document.body.appendChild(link); // Firefox workaround, see #6594

const modelSize = document.getElementById('model_size');
const modelTriangles = document.getElementById('model_nb_triangles');
const compressedModelSize = document.getElementById(`compressed_model_size`);
const compressedModelTriangles = document.getElementById(`compressed_model_nb_triangles`);

init();
animate();


document.getElementById('export_scene')
  .addEventListener('click', function () {
    exportGLTF(link, scene1.children[5]);
  });

document.getElementById('import_model')
  .addEventListener('change',
    async (ev) => {
     model = await importGLBModel(ev, scene1, modelSize, compressedModelSize, renderer, camera, cameraPos)
    });

function init() {
  console.log("init")
  container = document.createElement('div');
  document.body.appendChild(container);

  // const gradientTexture = createGradient();

  scene1 = new THREE.Scene();
  const backColor = new THREE.Color(0x505050);
  scene1.background = backColor;
  scene1.name = 'Scene1';
  
  // ---------------------------------------------------------------------
  // Perspective Camera
  // ---------------------------------------------------------------------
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.set(600, 400, 0);

  camera.name = "PerspectiveCamera";
  cameraPos = scene1.position;
  console.log(cameraPos);
  scene1.add(camera);

  // ---------------------------------------------------------------------
  // Ambient light
  // ---------------------------------------------------------------------
  const ambientLight = new THREE.AmbientLight(0xffffff, 2);
  ambientLight.name = 'AmbientLight';
  scene1.add(ambientLight);

  // ---------------------------------------------------------------------
  // DirectLight
  // ---------------------------------------------------------------------
  const dirLight = new THREE.DirectionalLight(0xFFFFFF, 10);
  dirLight.name = 'DirectionalLight';
  // dirLight.target.position.set(-3000, 5000, 5000);
  dirLight.add(dirLight.target);
  dirLight.target.position.set(-3000, 5000, - 1);
  dirLight.lookAt(100, 500, 100)
  scene1.add(dirLight);


  // ---------------------------------------------------------------------
  // Grid
  // ---------------------------------------------------------------------

  gridHelper = new THREE.GridHelper(2000, 20, 0x888888, 0x444444);
  gridHelper.position.y = - 50;
  gridHelper.name = "Grid";
  scene1.add(gridHelper);

  // ---------------------------------------------------------------------
  // Axes
  // ---------------------------------------------------------------------
  const axes = new THREE.AxesHelper(500);
  axes.name = "AxesHelper";
  scene1.add(axes);

  // ---------------------------------------------------------------------
  // OrbitControls
  // ---------------------------------------------------------------------

  // function createOrbitControl() {
  //   orbitControl = new OrbitControls(camera, container);
  // }

  // createOrbitControl()

  /* 				const loader = new OBJLoader();
          loader.load( 'files/WaltHead.obj', function ( obj ) {
            waltHead = obj;
            waltHead.scale.multiplyScalar( 1.5 );
            waltHead.position.set( 400, 0, 0 );
            //scene1.add( waltHead );
          } );
   */
  /* 				const loaderJSON = new THREE.ObjectLoader();
          loaderJSON.load(
          // resource URL
          "./files/scene.json",
          // onLoad callback
          // Here the loaded data is assumed to be an object
          function ( obj ) {
            // Add the loaded object to the scene
            scene1.add( obj );
          },
          // onProgress callback
          function ( xhr ) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
          },
          // onError callback
          function ( err ) {
            console.error( 'An error happened' );
          }
  ); */

  // ---------------------------------------
  // console.log("loading GLB")

  // const loader = new GLTFLoader();

  // const url = './static/models/minibottle.glb';
  // loader.load(url, (gltf) => {
  //   const model = gltf.scene;
  //   console.log("it's loaded")
  //   model.scale.set(1000, 1000, 1000);

  //   // const bbox = new THREE.Box3().setFromObject(model);
  //   const helper = new THREE.BoxHelper(model, 0x00ff00);
  //   console.log( helper);

  //   helper.update();
  //   scene1.add(model, helper);
  //   // window.root = model
  //   // window.scene = scene1
  // }, 
  // (xhr) => {
  //   console.log((xhr.loaded / xhr.total * 100) + '% loaded');
  // });
  
  // ---------------------------------------------------------------------
  // 2nd THREE.Scene
  // ---------------------------------------------------------------------
  scene2 = new THREE.Scene();
  object = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), material);
  object.position.set(0, 0, 0);
  object.name = "Cube2ndScene";
  scene2.name = 'Scene2';
  scene2.add(object);

  //

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.physicallyCorrectLights = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  
  container.appendChild(renderer.domElement);

  // document.getElementById('info')
  //   .addEventListener('click', (ev) => {
  //     if (ev.target.type === 'checkbox' || ev.target.type === 'number') {
  //       renderer.update()
  //     }
  //   })
  
  //

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
  modelTriangles.innerText = renderer.info.render.triangles;
  const timer = Date.now() * 0.0005;

  camera.position.x = Math.cos(timer) * 800;
  camera.position.z = Math.sin(timer) * 800;
  camera.lookAt(cameraPos);
  // camera.lookAt(scene1.position);
  // orbitControl.update()

  renderer.render(scene1, camera);
}
