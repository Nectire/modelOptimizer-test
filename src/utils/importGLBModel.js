import { BoxHelper, LoadingManager, REVISION, Box3 } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import calculateFileSize from './calculateFileSize';
import { makeRequest } from './makeRequest';
import { calcCameraDist } from "./calcCameraDist";

const MANAGER = new LoadingManager();

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`

const DRACO_LOADER = new DRACOLoader(MANAGER)
  .setDecoderPath(`${THREE_PATH}/examples/js/libs/draco/gltf/`);
const KTX2_LOADER = new KTX2Loader(MANAGER)
  .setTranscoderPath(`${THREE_PATH}/examples/js/libs/basis/`);


export default async function importGLBModel(ev, scene, modelSize, compressedModelOut, renderer, camera, cameraPos) {
  let modelTemp;
  const file = ev.target.files[0];
  modelSize.innerText = calculateFileSize(file.size);
  
  const formData = new FormData();
  formData.append('model', file);
  
  const res = await makeRequest('POST', { path: 'compress' }, formData);
  
  compressedModelOut.innerText = calculateFileSize(res.model.data.length);

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  // reader.readAsArrayBuffer(new Blob([res.model.data], { type: 'application/octet-stream' })); // Not working
  
  ev.target.value = '';
  reader.onload = (gltfText) => {
    const loader = new GLTFLoader(MANAGER)
    .setMeshoptDecoder(MeshoptDecoder)
    .setDRACOLoader(DRACO_LOADER)
    .setKTX2Loader(KTX2_LOADER.detectSupport(renderer))

    loader.parse(gltfText.target.result, '', (gltf) => {
      console.log("it's loaded")
      const model = gltf.scene;
      
      model.scale.set(1000, 1000, 1000);
      // const bbox = new Box3().setFromObject(model);
      // console.log(bbox);
      const helper = new BoxHelper(model, 0x00ff00);
      
      // cameraPos = calcCameraDist(model, camera);
      helper.update();
      modelTemp = model
      
      scene.add(model, helper);
    }, function (errormsg) {
      console.error(errormsg);
    });
  }
  return modelTemp;
}