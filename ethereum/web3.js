import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

async function web3() {
  let provider;

  try {
    if (typeof window !== 'undefined') {
      provider = await detectEthereumProvider();
    } else {
      throw 'window is not defined due to SSR';
    }

    // provider === window.ethereum
    if (provider) {
      const chainId = await provider.request({
        method: 'eth_chainId',
      });

      if (chainId != process.env.RINKEBY_CHAIN_ID) {
        // if MetaMask is installed but connected to wrong network
        provider = new Web3.providers.HttpProvider(
          process.env.RINKEBY_INFURA_ENDPOINT
        );
      }
    } else {
      // if MetaMask is not installed
      provider = new Web3.providers.HttpProvider(
        process.env.RINKEBY_INFURA_ENDPOINT
      );
    }
  } catch (err) {
    // if window isn't defined (SSR)
    provider = new Web3.providers.HttpProvider(
      process.env.RINKEBY_INFURA_ENDPOINT
    );
  }

  // provider will be either window.ethereum or Infura
  return new Web3(provider);
}

export default web3();
