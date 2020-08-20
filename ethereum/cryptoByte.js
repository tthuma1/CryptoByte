import web3 from './web3';
import CompiledCryptoByte from './build/CryptoByte.json';

const instance = new web3.eth.Contract(
  CompiledCryptoByte.abi,
  process.env.ADDRESS
);

export default instance;
