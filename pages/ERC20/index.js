import { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Container,
  Header,
  Grid,
  Segment,
  Divider,
  Button,
  Icon,
  Form,
  Input,
  Loader,
  Image,
} from 'semantic-ui-react';
import cryptoByte20 from '../../ethereum/solidity/ERC20/cryptoByte20';
import MMPrompt from '../../components/MMPrompt';
import { Link } from '../../routes';
import web3 from '../../ethereum/web3';
import Head from 'next/head';
import BigNumber from 'bignumber.js';

let currentAccount, headerEl;
let name, symbol, balance;
let buyPrice,
  totalSupply = BigNumber(0),
  cap;

class ERC20Index extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    mmprompt: false,
    loading: false,
    searchAddr: '',
    searchErr: false,
    result: false,
    MMreq: false,
  };

  async componentDidMount() {
    await web3;
    if (window.ethereum && window.ethereum.selectedAddress) {
      currentAccount = (await web3).utils.toChecksumAddress(
        window.ethereum.selectedAddress
      );
    }

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
    name = await (await cryptoByte20).methods.name().call();
    symbol = await (await cryptoByte20).methods.symbol().call();
    buyPrice = await (await cryptoByte20).methods.getBuyPrice().call();
    totalSupply = BigNumber(
      await (await cryptoByte20).methods.totalSupply().call()
    ).div(1e18);
    cap = await (await cryptoByte20).methods.cap().call();

    balance = currentAccount
      ? BigNumber(
          await (await cryptoByte20).methods.balanceOf(currentAccount).call()
        ).div(1e18)
      : 0;

    buyPrice = (await web3).utils.fromWei(buyPrice, 'ether');
    cap = (await web3).utils.fromWei(cap, 'ether');
  };

  handleSearchChange = async () => {
    this.setState({ loading: true });

    let addr = (await web3).utils.toChecksumAddress(this.state.searchAddr);

    let result = await (await cryptoByte20).methods.balanceOf(addr).call();

    result = (await web3).utils.fromWei(result, 'ether');

    this.setState({ result, loading: false });
  };

  handleConnect = async () => {
    try {
      this.setState({ MMreq: true });

      // if window.ethereum is undefined
      if (!window.ethereum) throw 'MetaMask not installed';
      // if provider isn't MetaMask
      else if (!window.ethereum.isMetaMask) throw 'MetaMask not installed';

      // Request account access
      await ethereum.request({ method: 'eth_requestAccounts' });
    } catch (error) {
      console.log(error);
      this.setState({ MMreq: false });

      if (error == 'MetaMask not installed') {
        this.setState({ mmprompt: true });

        setTimeout(() => {
          this.setState({ mmprompt: false });
        }, 100);
      }
    }
  };

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Head>
          <title>Crypto Byte Collectible - ERC20</title>
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
                    Price to buy one token: <b>{buyPrice} ETH</b>
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <p>
                    Total supply:{' '}
                    <b>
                      {parseInt(totalSupply.toFixed()).toLocaleString('en-US')}
                    </b>
                  </p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <p>
                    Max supply: <b>{parseInt(cap).toLocaleString('en-US')}</b>
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>

            <Image
              src="/static/images/erc20-transparent.png"
              size="medium"
              centered
            />

            <Divider />

            {currentAccount ? (
              <>
                <br />
                <p style={{ fontSize: '16px', wordWrap: 'break-word' }}>
                  You (<b>{currentAccount}</b>) own{' '}
                  <b>
                    {parseInt(balance.toFixed()).toLocaleString('en-US')}{' '}
                    {symbol}
                  </b>
                  .
                </p>

                <Grid columns="2">
                  <Grid.Column textAlign="right">
                    <Link route="/ERC20/buy">
                      <a
                        onClick={() => {
                          this.setState({ mounted: false });
                        }}
                      >
                        <Button primary icon labelPosition="left">
                          <Icon name="shopping cart" /> Buy Tokens
                        </Button>
                      </a>
                    </Link>
                  </Grid.Column>

                  <Grid.Column textAlign="left">
                    <Link route="/ERC20/transfer">
                      <a
                        onClick={() => {
                          this.setState({ mounted: false });
                        }}
                      >
                        <Button icon labelPosition="left">
                          <Icon name="exchange" /> Transfer Tokens
                        </Button>
                      </a>
                    </Link>
                  </Grid.Column>
                </Grid>
                <br />
              </>
            ) : (
              <>
                <br />
                <p>
                  Log in with MetaMask to be able to buy and transfer tokens.
                </p>
                <br />
                <p>
                  <Button
                    primary
                    disabled={this.state.MMreq}
                    loading={this.state.MMreq}
                    onClick={this.handleConnect}
                  >
                    Log In with MetaMask
                  </Button>
                </p>
                <br />
              </>
            )}

            <Divider />
            <br />

            <Container textAlign="left">
              <Header as="h3" inverted textAlign="center">
                Search account balances
              </Header>

              <Form inverted>
                <Form.Input error={this.state.searchErr} label="Address">
                  <Input
                    placeholder="Enter address to search for..."
                    loading={this.state.loading}
                    value={this.state.searchAddr}
                    icon="search"
                    fluid
                    onChange={(event) => {
                      this.setState({ searchAddr: event.target.value });
                      if (
                        !event.target.value.match(
                          /^(0x||0X)[a-fA-F0-9]{40}$/g
                        ) &&
                        !(event.target.value === '')
                      ) {
                        this.setState({
                          searchErr: {
                            content: 'Please enter a valid address.',
                          },
                          result: false,
                        });
                      } else {
                        this.setState({ searchErr: false });
                        if (event.target.value !== '') {
                          this.handleSearchChange();
                        }
                      }
                    }}
                  />
                </Form.Input>
              </Form>

              <br />
              {!this.state.searchErr &&
                this.state.searchAddr &&
                (!this.state.loading ? (
                  <p style={{ wordWrap: 'break-word' }}>
                    <b>{this.state.searchAddr}</b> owns{' '}
                    <b>
                      {parseInt(this.state.result).toLocaleString('en-US')}{' '}
                      {symbol}
                    </b>
                    .
                  </p>
                ) : (
                  <Segment style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                    <Loader active inverted>
                      Loading...
                    </Loader>
                  </Segment>
                ))}

              {!this.state.searchAddr && (
                <p>Enter an address above to show its {symbol} balance.</p>
              )}
            </Container>
          </Segment>
        </Container>
      </Layout>
    );
  }
}

export default ERC20Index;
