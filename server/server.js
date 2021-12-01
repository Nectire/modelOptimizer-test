const express = require('express');
const cors = require('cors');
const multer = require('multer')
const fs = require('fs');
const compressModel = require('./compress');
const createGLBFile = require('./createGLBFile');

const port = 3000;
const upload = multer({ dest: __dirname + `/models` })
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/compress', upload.single('model'), (req, res) => {

  const outPutCompressedFilePath = __dirname + `/models/commpressedModel.glb`;
  const inputFilePath = 'server/models/model.glb'
  const outputFilePath = 'server/models/commpressedModel.glb'
  try {
    const filePath = req.file.path;

    if (fs.existsSync(filePath)) {

      fs.readFile(filePath, (err, data) => {

        try {
          if (err) throw err;
          createGLBFile(data);
          compressModel(({ compression: '-c', inputFile: inputFilePath, outputFile: outputFilePath }));
        } catch (error) {
          console.error(error);
        }
      })
    }
    fs.readFile(outPutCompressedFilePath, (err, data) => {
      try {
        if (err) throw err;

        return res.json({ model: data });
      } catch (error) {
        console.error(error);
      }
    })
  } catch (e) {
    console.error(e);
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})