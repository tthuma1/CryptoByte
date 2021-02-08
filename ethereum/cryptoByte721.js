import provider from './provider';
import { ethers } from 'ethers';
import abi from './abi721';

let instance;

try {
  if (window.ethereum.chainId == process.env.NETWORK_VERSION) {
    instance = new ethers.Contract(process.env.ADDRESS_721, abi, provider);
  } else {
    throw 'Connected to wrong network in MetaMask';
  }
} catch (err) {
  const providerDefault = new ethers.providers.JsonRpcProvider(
    process.env.INFURA_ENDPOINT
  );

  instance = new ethers.Contract(process.env.ADDRESS_721, abi, providerDefault);
}

export default instance;
