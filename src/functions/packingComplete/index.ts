import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/APIResponses';
import Authorization from '@libs/Authorization';
import Dynamo from '@libs/Dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {
    await Authorization.apiKeyAuth(event);
  } catch (error) {
    console.log(error);
    return formatJSONResponse({
      statusCode: 401,
      body: { message: 'API key auth failed' },
    });
  }

  try {
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
      status:'packed',
      dateUpdated: Date.now()
    }

    await Dynamo.write({
      tableName:ordersTable,
      data:updatedOrder
    })

    return formatJSONResponse({ body: { message: 'order packed' } });
  } catch (error) {
    console.error(error);
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};
