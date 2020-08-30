const dotEnvResult = require('dotenv').config();

if (dotEnvResult.error) {
  throw dotEnvResult.error;
}

module.exports = {
  env: {
    ADDRESS_721: process.env.ADDRESS_721,
    NETWORK_VERSION: process.env.NETWORK_VERSION,
    INFURA_ENDPOINT: process.env.INFURA_ENDPOINT,
    VIKING_AMOUNT: process.env.VIKING_AMOUNT,
  },
};
