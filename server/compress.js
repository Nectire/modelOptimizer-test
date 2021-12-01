const { exec } = require('child_process');

function compressModel(params) {
  exec(`gltfpack ${params.compression} -i ${params.inputFile} -o ${params.outputFile}`, 
  { shell: true }, (err, stdout, stderr) => {
    if (err) console.error(err);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    if (!err && !stderr) console.log('Compression finished!');
  });
}

module.exports = compressModel;

