// const { getCamDistancetoFitCameraToObject } = require("./calcCameraDist");
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { BoxHelper, LoadingManager, REVISION, Box3 } from "three";
import { SERVER_URL } from "../constants";

export function parseModelToScene(loadedModel, renderer, scene) {
  const MANAGER = new LoadingManager();

  const THREE_PATH = `https://unpkg.com/three@0.${REVISION}.x`

  const DRACO_LOADER = new DRACOLoader(MANAGER)
    .setDecoderPath(`${THREE_PATH}/examples/js/libs/draco/gltf/`);
  const KTX2_LOADER = new KTX2Loader(MANAGER)
    .setTranscoderPath(`${THREE_PATH}/examples/js/libs/basis/`);

  const loader = new GLTFLoader(MANAGER)
    .setMeshoptDecoder(MeshoptDecoder)
    .setDRACOLoader(DRACO_LOADER)
    .setKTX2Loader(KTX2_LOADER.detectSupport(renderer))

    // Model type file
  if (typeof loadedModel !== 'string') {

    loader.parse(loadedModel, '', (gltf) => {
      console.log("it's loaded", gltf);
      const model = gltf.scene;
      model.scale.set(1000, 1000, 1000);

      const helper = new BoxHelper(model, 0x00ff00);

      helper.update();
      scene.add(model, helper);

    }, (errormsg) => {
      console.error(errormsg);
    });

  } else {
    // Link to model
    loader.load(
      '../' + loadedModel,
      (gltf) => {
        console.log("it's loaded", gltf);
        // compressedModelSize.innerText = calculateFileSize(res.byteLength);
        const model = gltf.scene;
        console.log('model ', model);
        model.scale.set(1000, 1000, 1000);

        const helper = new BoxHelper(model, 0x00ff00);

        helper.update();
        scene.add(model, helper);
      },
      function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');

      },
      function (error) {
        console.error('An error happened', error);
      }
    );
  }

}
