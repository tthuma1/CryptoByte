import web3 from '../../web3';
import abi from './abi20';

async function instance() {
  // wait for web3 to be returned, then create an instance of the contract
  return new (await web3).eth.Contract(abi, process.env.RINKEBY_ADDRESS_20);
}

export default instance();
