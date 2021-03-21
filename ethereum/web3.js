import Web3 from 'web3';

let web3;

if (
  typeof window !== 'undefined' &&
  typeof window.web3 !== 'undefined' &&
  window.ethereum.networkVersion === process.env.NETWORK_VERSION
) {
  web3 = new Web3(window.ethereum);
  /*(async () => {
    try {
      // Request account access if needed
      ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log(error);
    }
  })();*/
} else {
  const provider = new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT);

  web3 = new Web3(provider);
}

export default web3;
