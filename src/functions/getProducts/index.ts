import { APIGatewayProxyEvent } from 'aws-lambda';
import { formatJSONResponse } from '@libs/APIResponses';
import Dynamo from '@libs/Dynamo';

export const handler = async (event: APIGatewayProxyEvent) => {
  try {

    const productTable = process.env.productTable
    
    const { group, category, subcategory } = event.queryStringParameters;
    
    if (!group) {
      return formatJSONResponse({
        statusCode: 400,
        body: { message: 'missing "group" query string parameters' },
      });
    };

    let sk = undefined;

    if(category){
      sk = category
        if(subcategory){
          sk = `${category}#${subcategory}`
        }
    }

    const productsResponse = await Dynamo.query({
      tableName: productTable,
      index:'index1',
      pkValue:group,
      skBeginsWith: sk
    })

    return formatJSONResponse({ body: {} });
  } catch (error) {
    console.error(error);
    return formatJSONResponse({ statusCode: 500, body: error.message });
  }
};
