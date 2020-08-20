import web3 from './web3';
import CompiledCryptoByte721 from './build/CryptoByte721.json';

const instance = new web3.eth.Contract(
  CompiledCryptoByte721.abi,
  process.env.ADDRESS_721
);

export default instance;
