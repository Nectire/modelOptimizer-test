const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { promises } = require('fs');
const compressModel = require('./compress');
const createGLBFile = require('./createGLBFile');
const queryParse = require('./utils/queryParse');

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

      const data = await promises.readFile(filePath);
      if (req.query.hasOwnProperty('-si')) {
        await createGLBFile(data);
        const inputStr = queryParse(req.query);
        await compressModel(({ compression: inputStr, inputFile: inputFilePath, outputFile: outputFilePath }));

      }
      
      // const model = await promises.readFile(inputFilePath);
      // const model1 = await promises.readFile(outputFilePath)

        return res.sendFile('/models/compressedModel.glb', { root: path.join(__dirname)}, function (err) {
        if (err) {
          console.error(err);
        } else {
          console.log('Sent:', outputFilePath);
        }
      });
    }
  } catch (e) {
    console.error(e);
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})