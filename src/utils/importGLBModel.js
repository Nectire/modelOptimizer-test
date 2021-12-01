import { BoxHelper, LoadingManager, REVISION } from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';

import calculateFileSize from './calculateFileSize';
import { makeRequest } from './makeRequest';

const MANAGER = new LoadingManager();

const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`

const DRACO_LOADER = new DRACOLoader(MANAGER)
  .setDecoderPath(`${THREE_PATH}/examples/js/libs/draco/gltf/`);
const KTX2_LOADER = new KTX2Loader(MANAGER)
  .setTranscoderPath(`${THREE_PATH}/examples/js/libs/basis/`);


export default async function importGLBModel(ev, scene, modelSize, compressedModelOut, renderer) {
  const file = ev.target.files[0];
  modelSize.innerText = calculateFileSize(file.size);

  const formData = new FormData();
  formData.append('model', file);

  const res = await makeRequest('POST', { path: 'compress' }, formData);
  
  compressedModelOut.innerText = calculateFileSize(res.model.data.length);


  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  // reader.readAsArrayBuffer(new Blob(res.model.data)); // Not working

  reader.onload = async (gltfText) => {
    const loader = new GLTFLoader(MANAGER)
      .setDRACOLoader(DRACO_LOADER)
      .setKTX2Loader(KTX2_LOADER.detectSupport(renderer))
      .setMeshoptDecoder(MeshoptDecoder);

    loader.parse(gltfText.target.result, '', (gltf) => {
      const model = gltf.scene;
      console.log("it's loaded")

      model.scale.set(1000, 1000, 1000);
      const helper = new BoxHelper(model, 0x00ff00);

      helper.update();
      scene.add(model, helper);

    }, function (errormsg) {
      console.error(errormsg);
    });
  }
}