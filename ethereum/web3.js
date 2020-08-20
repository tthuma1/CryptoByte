import Web3 from 'web3';

let web3;

if (
  typeof window !== 'undefined' &&
  typeof window.web3 !== 'undefined' &&
  window.web3.currentProvider.networkVersion === process.env.NETWORK_VERSION
) {
  web3 = new Web3(window.web3.currentProvider);
  (async () => {
    try {
      // Request account access if needed
      await ethereum.enable();
    } catch (error) {
      console.log(error);
    }
  })();
} else {
  const provider = new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT);

  web3 = new Web3(provider);
}

export default web3;
