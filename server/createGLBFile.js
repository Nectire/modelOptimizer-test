const fs = require('fs');

function createGLBFile(bufferData) {
  const path = __dirname + '/models/model.glb';
  fs.writeFile(path, bufferData, (err) => {
    if (err)
      console.log(err);
    else {
      console.log("File written successfully!\n");
    }
  });
}

module.exports = createGLBFile