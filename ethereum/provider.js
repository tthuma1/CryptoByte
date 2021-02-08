import { ethers } from 'ethers';

let provider;

if (
  typeof window !== 'undefined' &&
  typeof window.ethereum !== 'undefined' &&
  window.ethereum.chainId === process.env.NETWORK_VERSION
) {
  (async () => {
    try {
      // Request account access if needed
      ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log(error);
    }
  })();

  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_ENDPOINT);
}

export default provider;
