import { ethers } from 'ethers';

let provider;
let a;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  try {
    // Request account access if needed
    window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.log(error);
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
} else {
  provider = new ethers.providers.JsonRpcProvider(process.env.INFURA_ENDPOINT);
}

export default provider;
