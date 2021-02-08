import provider from './provider';
import { ethers } from 'ethers';
import abi from './abi721';

const instance = new ethers.Contract(process.env.ADDRESS_721, abi, provider);

export default instance;
