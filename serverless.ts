import type { AWS } from '@serverless/typescript';

import functions from './serverless/functions';
import DynamoResources from './serverless/dynamodb';
import CognitoResources from './serverless/cognitoResources';
import SecretConfig from './serverless/secrets'

const serverlessConfiguration: AWS = {
  service: 'ecom-app',
  frameworkVersion: '3',

  useDotenv:true,

  plugins: ['serverless-esbuild','serverless-iam-roles-per-function'],
  custom: {
    tables: {
      productTable: '${sls:stage}-${self:service}-product-table',
      ordersTable: '${sls:stage}-${self:service}-orders-table',
    },
    profile: {
      dev: 'EbrahimSLS',
      int: 'int-profile',
      prod: 'prod-profile',
    },

    eventBridgeBusName: 'ordersEventBus',

    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node16',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
  },
  provider: {
    name: 'aws',
    runtime: 'nodejs16.x',
    profile: '${self:custom.profile.${sls:stage}}',
    region: 'me-south-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      productTable: '${self:custom.tables.productTable}',
      ordersTable: '${self:custom.tables.ordersTable}',
      region: '${self:provider.region}',
      eventBridgeBusName: '${self:custom.eventBridgeBusName}',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: 'dynamodb:*',
            Resource: '*',
          },
        ],
      },
    },
  },
  functions,

  resources: {
    Resources: {
      ...DynamoResources,
      ...CognitoResources,
      ...SecretConfig
    },
    Outputs: {
      ProductDynamoTableName: {
        Value: '${self:custom.tables.productTable}',
        Export: {
          Name: 'ProductDynamoTableName',
        },
      },
      OrderDynamoTableName: {
        Value: '${self:custom.tables.ordersTable}',
        Export: {
          Name: 'OrderDynamoTableName',
        },
      },
      UserPoolId: {
        Value: { Ref: 'CognitoUserPool' },
        Export: {
          Name: 'UserPoolId',
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
