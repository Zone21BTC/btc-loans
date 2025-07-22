import fs from 'node:fs';
import path from 'node:path';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

const schema = JSON.parse(
  fs.readFileSync('./schema/provider.schema.json', 'utf8')
);
const ajv = new Ajv2020({ allErrors: true });
addFormats(ajv);
const validate = ajv.compile(schema);

let hasErrors = false;

for (const dir of fs.readdirSync('./providers')) {
  const dirPath = path.join('./providers', dir);
  if (!fs.statSync(dirPath).isDirectory()) continue;
  const dataFile = path.join(dirPath, 'data.json');
  if (!fs.existsSync(dataFile)) {
    console.error(`❌  ${dir} is missing data.json`);
    hasErrors = true;
    break;
  }
  const data = JSON.parse(fs.readFileSync(dataFile));
  if (!validate(data)) {
    console.error(`❌  ${dir}/data.json failed schema validation:`);
    console.error(validate.errors);
    hasErrors = true;
    break;
  } else {
    console.log(`✅  ${dir}/data.json OK`);
  }
}

if (hasErrors) {
  process.exit(1);
}
