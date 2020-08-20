const dotEnvResult = require('dotenv').config();

if (dotEnvResult.error) {
  throw dotEnvResult.error;
}

module.exports = {
  env: {
    ADDRESS: process.env.ADDRESS,
    ADDRESS_721: process.env.ADDRESS_721,
    NETWORK_TYPE: process.env.NETWORK_TYPE,
    NETWORK_VERSION: process.env.NETWORK_VERSION,
    INFURA_ENDPOINT: process.env.INFURA_ENDPOINT,
    CRYPTOCOMPARE_KEY: process.env.CRYPTOCOMPARE_KEY,
    VIKING_AMOUNT: process.env.VIKING_AMOUNT,
  },
};
