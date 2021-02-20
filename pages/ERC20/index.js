import { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Container,
  Header,
  Message,
  Grid,
  Segment,
  Divider,
} from 'semantic-ui-react';
import cryptoByte20 from '../../ethereum/solidity/ERC20/cryptoByte20';
import MMPrompt from '../../components/MMPrompt';
import web3 from '../ethereum/web3';
import Head from 'next/head';
import BigNumber from 'bignumber.js';

let currentAccount, headerEl;
let name, symbol, balance;
let buyPrice = '0';
let totalSupply = '0';

class SellToken extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    mmprompt: false,
  };

  async componentDidMount() {
    currentAccount = (await web3.eth.getAccounts())[0];

    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        this.setState({
          headerHeight: headerEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    await this.getCryptoByteInfo();

    this.setState({ mounted: true });
  }

  getCryptoByteInfo = async () => {
    name = await cryptoByte20.name();
    symbol = await cryptoByte20.symbol();
    buyPrice = await cryptoByte20.getBuyPrice();
    totalSupply = await cryptoByte20.totalSupply();
    balance = currentAccount ? await cryptoByte20.balanceOf(currentAccount) : 0;
  };

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Head>
          <title>Crypto Byte Collectible - Sell Tokens</title>
          <meta
            name="description"
            content="General information about the Crypto Byte ERC20 token."
          />
          <meta name="robots" content="index, follow" />
        </Head>
        <MMPrompt visible={this.state.mmprompt} />

        <Container
          textAlign="center"
          style={{
            marginTop: this.state.headerHeight + 20,
          }}
        >
          <Segment
            inverted
            style={{ backgroundColor: 'rgba(0, 0, 0, 0)', marginTop: '20px' }}
          >
            <Header as="h2" inverted dividing textAlign="center">
              Welcome to the page for Crypto Byte ERC20 token.
            </Header>
            <Message warning>
              <p>
                This page currently only uses the Rinkeby Testnet. Full Mainnet
                experience coming soon.
              </p>
            </Message>
            <Grid columns={2} celled="internally">
              <Grid.Row>
                <Grid.Column>
                  <p>
                    Token name: <b>{name}</b>
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <p>
                    Symbol: <b>{symbol}</b>
                  </p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <p>
                    Price to buy one token:{' '}
                    <b>{web3.utils.fromWei(buyPrice, 'ether')} ETH</b>
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <p>
                    Current amount of tokens in circulation:{' '}
                    <b>{totalSupply.toLocaleString('en-US')}</b>
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Divider />

            <br />
            {currentAccount ? (
              <p style={{ fontSize: '16px' }}>
                You (<b>{currentAccount}</b>) own{' '}
                <b>
                  {balance} {symbol}
                </b>
                .
              </p>
            ) : (
              ''
            )}
            <br />

            <Divider />
            <p>
              Here you will be able to search balanceOf. With a nice form and a
              nice output :). Input an address here to find out it's balance of{' '}
              {symbol}
            </p>
          </Segment>
        </Container>
      </Layout>
    );
  }
}

export default SellToken;
