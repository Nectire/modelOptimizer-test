import calculateFileSize from './calculateFileSize';
import { parseModelToScene } from "./loadModelToScene";

export default async function importGLBModel(
  {
    fileModel,
    scene1,
    modelSize,
    renderer,
  }) {
  modelSize.innerText = calculateFileSize(fileModel.size);

  const reader = new FileReader();
  reader.readAsArrayBuffer(fileModel);

  reader.onload = (ev) => {
    console.log('reader first model', ev.target.result);
    parseModelToScene(ev.target.result, renderer, scene1);
  }

}