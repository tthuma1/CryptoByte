const dotEnvResult = require('dotenv').config();

if (dotEnvResult.error) {
  throw dotEnvResult.error;
}

module.exports = {
  env: {
    ADDRESS_721: process.env.ADDRESS_721,
    NETWORK_TYPE: process.env.NETWORK_TYPE,
    NETWORK_VERSION: process.env.NETWORK_VERSION,
    INFURA_ENDPOINT: process.env.INFURA_ENDPOINT,
    VIKING_AMOUNT: process.env.VIKING_AMOUNT,
    SPECIAL_EDITION: process.env.SPECIAL_EDITION,
    RINKEBY_ADDRESS_20: process.env.RINKEBY_ADDRESS_20,
  },
};
