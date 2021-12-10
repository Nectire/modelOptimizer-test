import { BoxHelper, LoadingManager, REVISION, Box3 } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import calculateFileSize from './calculateFileSize';
import { requestModelArrayBuffer } from './makeRequest';
import { calcCameraDist, getCamDistancetoFitCameraToObject } from "./calcCameraDist";
import { parseModelToScene } from "./loadModelToScene";

const MANAGER = new LoadingManager();

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`

const DRACO_LOADER = new DRACOLoader(MANAGER)
  .setDecoderPath(`${THREE_PATH}/examples/js/libs/draco/gltf/`);
const KTX2_LOADER = new KTX2Loader(MANAGER)
  .setTranscoderPath(`${THREE_PATH}/examples/js/libs/basis/`);


export default async function importGLBModel(
  {
    ev,
    scene1,
    scene2,
    modelSize,
    compressedModelSize,
    renderer,
    camera,
    cameraPosZoom,
    reductionValue
  }) {

  const file = ev.target.files[0];
  modelSize.innerText = calculateFileSize(file.size);

  const formData = new FormData();
  formData.append('model', file);
  const searchParam = new URLSearchParams();
  searchParam.set('-si', reductionValue);
  const res = await requestModelArrayBuffer('POST', 
  { 
    path: 'compress', 
    searchParam
   }, formData);

  compressedModelSize.innerText = calculateFileSize(res.byteLength);


  ev.target.value = '';

  const loader = new GLTFLoader(MANAGER)
    .setMeshoptDecoder(MeshoptDecoder)
    .setDRACOLoader(DRACO_LOADER)
    .setKTX2Loader(KTX2_LOADER.detectSupport(renderer))

  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  reader.onload = (ev) => {
    console.log('reader first model', ev.target.result);
    parseModelToScene(loader, ev.target.result, scene2);
  }

  parseModelToScene(loader, res, scene1);

}