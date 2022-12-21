// import { AWS } from "@serverless/typescript";

// const SecretConfig:AWS['resources']['Resources'] = {
//   warhouseApiKey : {
//     Type:'AWS::SecretsManager::Secret',
//     Properties: { 
//       Description:'API key needed to call the warehouse',
//       Name:'warhouseApiKey',
//       SecretString:'${env:warehouseApiKey}'
//     },
//   },
//   orderpackeApiKeys : {
//     Type:'AWS::SecretsManager::Secret',
//     Properties: { 
//       Description:'API key passed by the ware house',
//       Name:'auth-/orderpacked/_orderId_',
//       SecretString:'560e035c-4eef-4bc7-b741-abfd648bbc7b',
//       // SecretString:'${env:orderpackeApiKeys}'

//     },
//   },
// }

// export default SecretConfig;