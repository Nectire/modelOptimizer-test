const { getCamDistancetoFitCameraToObject } = require("./calcCameraDist");
import { BoxHelper } from "three";

export function parseModelToScene(loader, loadedModel, scene) {
  loader.parse(loadedModel, '', (gltf) => {
    console.log("it's loaded", gltf);
    const model = gltf.scene;
    console.log('model ',model);
    model.scale.set(1000, 1000, 1000);

    const helper = new BoxHelper(model, 0x00ff00);

    // cameraPosZoom = calcCameraDist(model, camera);
    // cameraPosZoom = getCamDistancetoFitCameraToObject(camera, model, 0.1)
    helper.update();
    scene.add(model, helper);

  }, function (errormsg) {
    console.error(errormsg);
  });
}
