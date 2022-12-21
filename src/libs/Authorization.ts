import { APIGatewayProxyEvent } from "aws-lambda";
// import Secrets from "./secrets";

const secrets:Record<string,any> = {
  // warhouseApiKey : {
  //   Type:'AWS::SecretsManager::Secret',
  //   Properties: { 
  //     Description:'API key needed to call the warehouse',
  //     Name:'warhouseApiKey',
  //     SecretString:'560e097c-4eef-4bc7-b741-abfd648bbc7b'
  //   },
  // },
  orderpackeApiKey : {
    Type:'AWS::SecretsManager::Secret',
    Properties: { 
      Description:'API key passed by the ware house',
      Name:'auth-/orderpacked/_orderId_',
      SecretString:'558e035c-4eef-4bc7-b741-abfd648bbc7b',
    },
  },
}


const apiKeyAuth = async (event :APIGatewayProxyEvent) => {
  if(!event.headers?.Authorization){
    throw Error('missing authorization')
  }

  const authToken = event.headers.Authorization;
  
  if(!authToken){
    throw Error('No API key found for this path!')
  }

  const secretString = secrets.orderpackeApiKey.Properties.SecretString;

  // const secretObj = JSON.parse(secretString);

  if(secretString === authToken){
    return;
  }

  throw Error('Invalid API key');
};

const Authorization = {
  apiKeyAuth
}

export default Authorization;