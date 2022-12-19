import type { AWS } from '@serverless/typescript';

import functions from './serverless/functions';
import DynamoResources from './serverless/dynamodb';
import AssetsBucketAndCloudfront from './serverless/AssetsBucketAndCloudfront';
import CognitoResources from './serverless/cognitoResources';

const serverlessConfiguration: AWS = {
  service: 'ecom-app',
  frameworkVersion: '3',

  plugins: ['serverless-esbuild'],
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
    region: 'eu-central-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      productTable: '${self:custom.tables.productTable}',
      ordersTable: '${self:custom.tables.ordersTable}',
      region: '${self:provider.region}',
    },
    iam:{
      role: {
        statements: [
          {
            Effect:'Allow',
            Action:'dynamodb:*',
            Resource:'*'
          }
        ]
      }
    },
  },
  functions,

  resources: {
    Resources: {
      ...DynamoResources,
      ...CognitoResources,
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
