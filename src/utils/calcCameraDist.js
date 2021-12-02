import * as THREE from 'three';

export function calcCameraDist(object, camera) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3()).length();
  const center = box.getCenter(new THREE.Vector3());

  object.position.x += (object.position.x - center.x);
  // object.position.y += (object.position.y - center.y);
  object.position.z += (object.position.z - center.z);

  // controls.maxDistance = size * 10;
  // camera.zoom = 0.05;
  camera.near = size / 100;
  camera.far = size * 100;
  camera.lookAt(center);
  camera.updateProjectionMatrix();
  console.log(center);
  return center;
}