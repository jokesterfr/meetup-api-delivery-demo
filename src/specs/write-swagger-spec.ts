import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { HealthCheckService } from '@nestjs/terminus';
import { writeFileSync } from 'node:fs';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { convert } = require('api-spec-converter');

import * as path from 'path';
import * as YAML from 'yaml';
import { AppModule } from '../app.module';

const specFolder =
  process.env.SPEC_FOLDER_PATH || path.join(process.cwd(), 'dist');

function addGoogleSecurity(swaggerObject: any) {
  if (!!swaggerObject.securityDefinitions === false) {
    // securityDefinitions not defined
    swaggerObject.securityDefinitions = {};
  }

  const oauthServer = {
    authorizationUrl: '',
    flow: 'implicit',
    type: 'oauth2',
    'x-google-issuer': '${OAUTH_ISSUER}',
    'x-google-jwks_uri': '${OAUTH_JWKS_URI}',
    'x-google-audiences': '${OAUTH_AUDIENCES}',
  };

  swaggerObject.securityDefinitions.oauthServer = oauthServer;
}

function addGoogleEndpoint(swaggerObject: any, endpoint: any) {
  if (!!swaggerObject['x-google-endpoints'] === false) {
    swaggerObject['x-google-endpoints'] = [];
  }
  swaggerObject['x-google-endpoints'].push(endpoint);
}

/**
 * Build the swagger/OpenAPI spec
 */
export async function buildDocument(app: INestApplication) {
  const swaggerDocument = new DocumentBuilder()
    .setTitle('Meetup swagging with API delivery')
    .setDescription('A demo to showcase the API and doc delivery')
    .setVersion('1.0.0')
    .addServer('http://localhost:3000', 'Local server')
    .addServer(
      'https://meetup-integration.prestashop.com/api-demo/v1',
      'Integration',
    )
    .addServer(
      'https://meetup-preproduction.prestashop.com/api-demo/v1',
      'Pre-production',
    )
    .addServer('https://meetup.prestashop.com/api-demo/v1', 'Production')
    .addSecurity('firebaseShop', {
      type: 'oauth2',
      flows: {
        implicit: {
          authorizationUrl: '',
          scopes: {},
        },
      },
    })
    .addSecurity('oauthServer', {
      type: 'oauth2',
      flows: {
        implicit: {
          authorizationUrl: '',
          scopes: {},
        },
      },
    });

  const document = SwaggerModule.createDocument(app, swaggerDocument.build());
  return document;
}

function reduceExamplesToOne(swaggerObject: any) {
  const dtos = Object.keys(swaggerObject.definitions);
  dtos.forEach((dtoName) => {
    const dto = swaggerObject.definitions[dtoName];
    const properties = Object.keys(dto.properties);
    properties.forEach((p: any) => {
      const property = dto.properties[p];
      if (property.examples?.length >= 1) {
        property.example = property.examples[0];
        property.examples = undefined;
      }
    });
  });
}

/**
 * main function use Nest root module to compile swager document, convert it and
 * write the V2 file to file system
 */
async function bootstrap() {
  const options = {
    outputPath: path.join(specFolder, 'meetup-api-delivery-demo.yaml'),
  };
  const v3_options = {
    outputPath: path.join(specFolder, 'meetup-api-delivery-demo-v3.yaml'),
  };

  const app = await NestFactory.create(
    {
      module: AppModule,
      imports: [],
      providers: [
        {
          provide: 'AppService',
          useFactory: () => null,
        },
        {
          provide: HealthCheckService,
          useFactory: () => null,
        },
      ],
    },
    {
      bufferLogs: true,
    },
  );
  const document = await buildDocument(app);
  const ymlv2 = (
    await convert({
      from: 'openapi_3',
      to: 'swagger_2',
      source: document,
    })
  ).spec;
  ymlv2.host = '${DOMAIN}';
  addGoogleSecurity(ymlv2);
  addGoogleEndpoint(ymlv2, {
    name: '${DOMAIN}',
    target: '${STATIC_IP}',
  });
  reduceExamplesToOne(ymlv2);
  console.log(`writing openapi to ${options.outputPath}`);
  writeFileSync(options.outputPath, YAML.stringify(ymlv2));
  console.log(`done 🚀`);
  console.log(`writing openapi-v3 to ${v3_options.outputPath} done`);
  writeFileSync(v3_options.outputPath, YAML.stringify(document));
  console.log(`done 🚀`);
  process.exit(0);
}

bootstrap();
