/*
//import web3 from './web3';
import { ethers } from 'ethers';
import abi from './abi20';
import detectEthereumProvider from '@metamask/detect-provider';

let provider;

provider = (async () => {
  return detectEthereumProvider();
})();

provider.then((value) => {
  const instance = new ethers.Contract(
    process.env.RINKEBY_ADDRESS_20,
    abi,
    provider
  );
});

export default instance;
*/
