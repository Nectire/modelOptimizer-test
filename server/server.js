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

const glbStorage = multer.diskStorage({
  // Destination to store models
  destination: __dirname + '/public/models',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '_' + Date.now()
      + path.extname(file.originalname))
  }
});

const app = express();
app.use(cors());
app.use(express.static(__dirname + '/public')); //Serves resources from public folder
// dest: __dirname + `/public`,
const upload = multer({  storage: glbStorage })


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/compress', upload.single('model'), async (req, res) => {
  const fileName = req.file.filename.match(/^(.+)(\..+)$/)[1] + "_compressed.glb";
  console.log('check ',req.query, fileName);
  const inputFilePath = 'server/public/models/' + req.file.filename
  const outputFilePath = 'server/public/models/' + fileName;

  try {
    const filePath = req.file.path;

    if (fs.existsSync(filePath)) {

      const data = await promises.readFile(filePath);
      if (req.query.hasOwnProperty('-si')) {
        await createGLBFile(data);
        const inputStr = queryParse(req.query);
        await compressModel(({ compression: inputStr, inputFile: inputFilePath, outputFile: outputFilePath  }));
      }

      return res.json({ fileLink:  outputFilePath, fileName, })
      //   return res.sendFile('/models/compressedModel.glb', { root: path.join(__dirname)}, function (err) {
      //   if (err) {
      //     console.error(err);
      //   } else {
      //     console.log('Sent:', outputFilePath);
      //   }
      // });
    }
  } catch (e) {
    console.error(e);
  }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
})