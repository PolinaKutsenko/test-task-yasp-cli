import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import screenshot from 'screenshot-desktop';

const buildFullPath = (filepath) => path.resolve(process.cwd(), filepath);
const readFile = (filepath) => fs.readFileSync(buildFullPath(filepath));
const getBase64Format = (fileContent) => Buffer.from(fileContent).toString('base64');

const makeScreenshot = () => {
  screenshot({ format: 'png' })
  .then((image) => {
      const fileName = `${_.uniqueId('pngFile_')}.png`;
      const filePath = buildFullPath(`screenshots/${fileName}`);
      console.log(filePath);
      return [filePath, image];
    },
  )
  .then(([filePath, image]) => {
    fs.writeFile(filePath, image, (e) => {
      if (e) {
        console.log('Something wrong!');
      } else {
        console.log('File .png written successfully!');
      }
    });
    return filePath;
  })
  .then((filePath) => {
    const fileContent = readFile(filePath);
    const fileContentIn64 = getBase64Format(fileContent);
    return fileContentIn64;
  })
  .then((fileContentIn64) => {
    fetch('https://vision.api.cloud.yandex.net/vision/v1/batchAnalyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer t1.9euelZrLzZHKyJ2XjJaVms2RlZuOze3rnpWaj5qXzseMnZOMmpySz8vOkMfl8_dbP0Jj-e8xEzx2_N3z9xtuP2P57zETPHb8zef1656Vmo-UlozNm5aQlceUz5WVnJPK7_0.KLJ4kvrFwgFTe4vCoe97tJS3IYXk4zILwAIGfGy2hRh2ZoSaMv_sv3ucWqzobH4-5AJ3ho3nItobCIcHEqKGBw',
      },
      body: {
        "analyzeSpecs": [{
          "content": fileContentIn64,
          "mimeType": "image",
          "features": [{
            "type": "TEXT_DETECTION",
            "text_detection_config": {
              "language_codes": ["*"]
            }
          }]
        }]
      },
    })
    .then((response) => {
      const fileName = `${_.uniqueId('txtFile_')}.txt`;
      const filePath = buildFullPath(`screenshots/${fileName}`);
      const regExp = /\"text\":\s\".*\"/;
      const result = response.data.match(regExp);
      return [result.join(' '), filePath];
    })
    .then(([result, filePath]) => {
      fs.writeFile(filePath, result, (e) => {
        if (e) {
          console.log('Something wrong!');
        } else {
          console.log('File .txt written successfully!');
        }
      });
    });
  });
};

export default makeScreenshot;
