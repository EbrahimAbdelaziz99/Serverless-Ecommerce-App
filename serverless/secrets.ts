import { AWS } from "@serverless/typescript";

const SecretConfig:AWS['resources']['Resources'] = {
  warhouseApiKey : {
    Type:'AWS::SecretsManager::Secret',
    Properties: { 
      Description:'API key needed to call the warehouse',
      Name:'warhouseApiKey',
      SecretString:'${env:warehouseApiKey}'
    }
  }
}

export default SecretConfig;