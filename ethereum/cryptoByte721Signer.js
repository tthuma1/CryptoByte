import provider from './provider';
import { ethers } from 'ethers';
import abi from './abi721';

const signer = provider.getSigner();

const instance = new ethers.Contract(process.env.ADDRESS_721, abi, signer);

export default instance;
