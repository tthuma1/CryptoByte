import web3 from './web3Infura';
import abi from './abi721';

const instance = new web3.eth.Contract(abi, process.env.ADDRESS_721);

export default instance;
