import { EventBridgeEvent } from 'aws-lambda';
import { OrderRecord } from 'src/types/dynamo';

import axios from 'axios';
// import Secrets from '@libs/secrets';

const secrets:Record<string,any> = {
  warhouseApiKey : {
    Type:'AWS::SecretsManager::Secret',
    Properties: { 
      Description:'API key needed to call the warehouse',
      Name:'warhouseApiKey',
      SecretString:'560e097c-4eef-4bc7-b741-abfd648bbc7b'
    },
  },
}

export const handler = async (event: EventBridgeEvent<string, OrderRecord>) => {
  try {
    const details = event.detail;

    const authKey = secrets.warehouseApiKey.Properties.SecretString;

    await axios.post(
      'https://httpstatus.us/201',
      {
        ...details,
      },
      {
        headers: {
          authorization: authKey,
        },
      }
    );

    console.log(' warhous API called');
  } catch (error) {
    console.error(error);
  }
};
