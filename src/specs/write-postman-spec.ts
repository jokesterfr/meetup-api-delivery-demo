import { writeFileSync } from 'node:fs';
import * as PostmanConvert from 'openapi-to-postmanv2/index';
import * as path from 'path';

const specFolder =
  process.env.SPEC_FOLDER_PATH || path.join(process.cwd(), 'dist');

async function bootstrap() {
  const options = {
    yamlPath: path.join(specFolder, 'meetup-api-delivery-demo-v3.yaml'),
    outputPath: path.join(specFolder, 'postman-collection.json'),
    converter_options: {
      folderStrategy: 'Tags',
      includeAuthInfoInExample: true,
      enableOptionalParameters: false,
      requestParametersResolution: 'Example',
      exampleParametersResolution: 'Example',
    },
  };

  PostmanConvert.convert(
    { type: 'file', data: options.yamlPath },
    options.converter_options as PostmanConvert.Options,
    (err, conversionResult) => {
      if (!conversionResult.result) {
        console.log('Error during postman generation', conversionResult);
        process.exit(1);
      } else {
        console.log(`Writing postman collection to ${options.outputPath}`);
        writeFileSync(
          options.outputPath,
          JSON.stringify(conversionResult.output[0].data),
        );
        console.log(`Done 🚀`);
        process.exit(0);
      }
    },
  );
}

bootstrap();
