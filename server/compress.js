const { exec } = require('child_process');
const { resolve } = require('path');

function compressModel(params) {
  return new Promise((res, rej) => {
    exec(`gltfpack -i ${params.inputFile} -o ${params.outputFile} ${params.compression}`,
      { shell: true }, (err, stdout, stderr) => {
        if (err) rej(err);
        if (stdout) rej(stdout);
        if (stderr) rej(stderr);
        if (!err && !stderr) res(console.log('Compression finished!'))
      })
  })
 
}

module.exports = compressModel;

