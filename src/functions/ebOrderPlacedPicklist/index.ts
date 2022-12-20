import { EventBridgeEvent } from 'aws-lambda';
import { OrderRecord } from 'src/types/dynamo';

import axios from 'axios';
import Secrets from '@libs/secrets';

export const handler = async (event: EventBridgeEvent<string, OrderRecord>) => {
  try {
    const details = event.detail;

    const authKey = await Secrets.getSecret('warehouseApiKey');

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
