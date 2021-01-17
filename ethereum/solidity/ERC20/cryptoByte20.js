import web3 from '../web3';
import abi from './abi20';

const instance = new web3.eth.Contract(abi, process.env.RINKEBY_ADDRESS_20);

export default instance;
