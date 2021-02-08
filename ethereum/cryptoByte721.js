import provider from './provider';
import { ethers } from 'ethers';
import abi from './abi721';

const signer = provider.getSigner();
let instance;

if (signer.provider.constructor.name == 'JsonRpcProvider') {
  instance = new ethers.Contract(process.env.ADDRESS_721, abi, provider);
} else {
  instance = new ethers.Contract(process.env.ADDRESS_721, abi, signer);
}

export default instance;
