import Web3 from 'web3';

let web3;

const provider = new Web3.providers.HttpProvider(process.env.INFURA_ENDPOINT);
web3 = new Web3(provider);

export default web3;
