const express = require('express');
const cors = require('cors');
const multer = require('multer')
const fs = require('fs');
const { promises } = require('fs');
const compressModel = require('./compress');
const createGLBFile = require('./createGLBFile');

const port = 3000;
const upload = multer({ dest: __dirname + `/models` })
const app = express();
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/compress', upload.single('model'), async (req, res) => {

  const inputFilePath = 'server/models/model.glb'
  const outputFilePath = 'server/models/compressedModel.glb'
  try {
    const filePath = req.file.path;

    if (fs.existsSync(filePath)) {

      const data = await promises.readFile(filePath)
      await createGLBFile(data)
      await compressModel(({ compression: '-c', inputFile: inputFilePath, outputFile: outputFilePath }));

      const model = await promises.readFile(outputFilePath);
      return res.json({ model: model });
    }
  } catch (e) {
    console.error(e);
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})