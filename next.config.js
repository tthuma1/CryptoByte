const dotEnvResult = require('dotenv').config();

if (dotEnvResult.error) {
  throw dotEnvResult.error;
}

module.exports = {
  env: {
    ADDRESS_721: process.env.ADDRESS_721,
    NETWORK_TYPE: process.env.NETWORK_TYPE,
    CHAIN_ID: process.env.CHAIN_ID,
    INFURA_ENDPOINT: process.env.INFURA_ENDPOINT,
    VIKING_AMOUNT: process.env.VIKING_AMOUNT,
    SPECIAL_EDITION: process.env.SPECIAL_EDITION,
    RINKEBY_ADDRESS_721: process.env.RINKEBY_ADDRESS_721,
    RINKEBY_CHAIN_ID: process.env.RINKEBY_CHAIN_ID,
    RINKEBY_INFURA_ENDPOINT: process.env.RINKEBY_INFURA_ENDPOINT,
    RINKEBY_ADDRESS_20: process.env.RINKEBY_ADDRESS_20,
  },
};
