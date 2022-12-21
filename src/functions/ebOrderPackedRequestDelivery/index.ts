import { EventBridgeEvent } from 'aws-lambda';
import { OrderRecord } from 'src/types/dynamo';

import axios from 'axios';
import Dynamo from '@libs/Dynamo';
// import Secrets from '@libs/secrets';

const secrets:Record<string,any> = {
  deliveryApiKey : {
    Type:'AWS::SecretsManager::Secret',
    Properties: { 
      Description:'API key needed to call the warehouse',
      Name:'deliveryApiKey',
      SecretString:'560e354f-4eef-4bc7-b741-abfd648bbc7b'
    },
  },
}

export const handler = async (event: EventBridgeEvent<'string', OrderRecord>) => {
  try {
    const details = event.detail;

    const authKey = secrets.deliveryApiKey.Properties.SecretString;

    const deliveryData = await generateDeliveryData(details);

    await axios.post('https://httpstat.us/201', deliveryData, {
      headers: {
        authorization: authKey,
      },
    });

    console.log('delivery was ordered');

    return;
  } catch (error) {
    console.error(error);
  }
};

const generateDeliveryData = async (details: OrderRecord) => {
  const { userId, id } = details;

  const userAddress = await Dynamo.get({
    pkValue: userId,
    tableName: process.env.userAddressTable,
  });

  const warehouseAddress = {
    firstLine: '12 Jones Ave',
    city: 'Manchester',
    postcode: 'M34 5KD',
  };

  return {
    deliveryAddress: userAddress,
    pickupAddress: warehouseAddress,
    deliveryType: 'standard',
    readyForCollection: true,
    meta: {
      id,
      userId,
    },
  };
};