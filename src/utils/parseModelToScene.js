
import { BoxHelper} from "three";
import createGLTFLoader from "./createLoader";

export function parseModelToScene(loadedModel, renderer, scene) {
  const loader = createGLTFLoader(renderer);
    // Load Model from file
  if (typeof loadedModel !== 'string') {

    loader.parse(loadedModel, '', (gltf) => {
      console.log("it's loaded", gltf);
      const model = gltf.scene;
      model.scale.set(1000, 1000, 1000);
      model.name = 'ModelFromFile';

      const helper = new BoxHelper(model, 0x00ff00);
      helper.name ='ModelFromFileHelper';

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
        model.scale.set(1000, 1000, 1000);
        model.name = 'CompressedModel';
        const helper = new BoxHelper(model, 0x00ff00);
        helper.name = 'CompressedModelHelper';

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
