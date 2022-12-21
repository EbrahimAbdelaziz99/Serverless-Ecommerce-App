import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';

const secrets:Record<string,any> = {
  deliveryApiKey: {
    Type: 'AWS::SecretsManager::Secret',
    Properties: {
      Description: 'API key passed by the warehouse',
      Name: 'deliveryApiKey',
      SecretString:'860e097c-4eef-4bc7-b741-abfd867bbc7b'
    },
  },
}

export const handler = async (event: APIGatewayProxyEvent) => {

  try {
    
    const authToken = event.headers.Authorization;

    const secretString = secrets.warehouseApiKey.Properties.SecretString;

    if(authToken !== secretString){
      return formatJSONResponse({
        statusCode: 401,
        body: { message: 'API key auth failed' },
      });
    }
    
    const ordersTable = process.env.ordersTable;

    const orderId = event.pathParameters.orderId;

    const order = await Dynamo.get({
      tableName:ordersTable,
      pkValue:orderId
    })

    if(!order || !order.id){
      return formatJSONResponse({ statusCode:404, body: {} });
    }

    const updatedOrder = {
      ...order,
      status:'delivered',
      dateUpdated: Date.now()
    }

    await Dynamo.write({
      tableName:ordersTable,
      data:updatedOrder
    })

    return formatJSONResponse({ body:{message:'order delivered'} });
  } catch (error) {
    console.error(error);
    return formatJSONResponse({ statusCode:500,body:error.message });
  }
};
