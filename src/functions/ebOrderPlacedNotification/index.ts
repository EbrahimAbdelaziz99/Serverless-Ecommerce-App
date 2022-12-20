import { EventBridgeEvent } from 'aws-lambda';
import Dynamo from '@libs/Dynamo';
import { OrderRecord, ProductsRecord } from 'src/types/dynamo';

export const handler = async (event: EventBridgeEvent<string,OrderRecord>) => {
  try {

    const productTable = process.env.productTable
    
  } catch (error) {
    console.error(error);
  }
};
