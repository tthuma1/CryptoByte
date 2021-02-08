import { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Container,
  Header,
  Form,
  Button,
  Input,
  Message,
} from 'semantic-ui-react';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import MMPrompt from '../../components/MMPrompt';
import { ethers } from 'ethers';
import { Router } from '../../routes';
import Head from 'next/head';
import BigNumber from 'bignumber.js';

let currentAccount, headerEl;

class SellToken extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    newPrice: '',
    newPriceErr: false,
    msgErr: false,
    loading: false,
    success: false,
    currentPrice: 0,
    saleLoading: false,
    mmprompt: false,
  };

  static async getInitialProps({ query }) {
    return { id: query.id };
  }

  async componentDidMount() {
    try {
      currentAccount = ethers.utils.getAddress(
        (await ethereum.request({ method: 'eth_accounts' }))[0]
      );
    } catch {}

    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        this.setState({
          headerHeight: headerEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    this.setState({
      currentPrice: await cryptoByte721.getTokenPrice(this.props.id),
    });

    this.setState({ mounted: true });
  }

  removeSale = async (event) => {
    event.preventDefault();
    this.setState({ saleLoading: true, msgErr: '' });
    try {
      await (await cryptoByte721.setTokenPrice(this.props.id, 0)).wait();

      this.setState({ saleLoading: false, success: true });
      Router.pushRoute(`/token/${this.props.id}`);
    } catch (err) {
      this.setState({
        saleLoading: false,
        msgErr: "You aren't logged in your MetaMask account.",
        mmprompt: true,
      });

      setTimeout(() => {
        this.setState({ mmprompt: false });
      }, 100);
    }

    this.setState({
      currentPrice: await cryptoByte721.getTokenPrice(this.props.id),
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, msgErr: '' });
    try {
      if (this.state.newPriceErr || this.state.newPrice === '') {
        throw { message: 'Invalid token price.' };
      }

      await (
        await cryptoByte721.setTokenPrice(
          this.props.id,
          BigNumber(this.state.newPrice)
            .times(ethers.constants.WeiPerEther.toString())
            .toString()
        )
      ).wait();

      this.setState({ loading: false, success: true });
      Router.pushRoute(`/token/${this.props.id}`);
    } catch (err) {
      await this.setState({
        loading: false,
        msgErr:
          err.message == 'Invalid token price.'
            ? err.message
            : "You aren't logged in your MetaMask account.",
      });

      if (this.state.msgErr == "You aren't logged in your MetaMask account.") {
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
          <title>Crypto Byte Collectible - Sell Tokens</title>
          <meta
            name="description"
            content="Put your Crypto Byte Collectible tokens up for sale in exchange for Ether (ETH)."
          />
          <meta name="robots" content="index, follow" />
        </Head>
        <MMPrompt visible={this.state.mmprompt} />

        <Container
          style={{
            marginTop: this.state.headerHeight + 20,
          }}
        >
          <Header as="h3" inverted dividing textAlign="center">
            You can change the price of your ERC721 tokens with the form below.
          </Header>

          <Form inverted onSubmit={this.onSubmit}>
            <Form.Group widths="equal">
              <Form.Input label="Token price" error={this.state.newPriceErr}>
                <Input
                  placeholder="123"
                  value={this.state.newPrice}
                  label="ETH"
                  labelPosition="right"
                  onChange={(event) => {
                    this.setState({ newPrice: event.target.value });

                    if (
                      (isNaN(event.target.value) ||
                        parseFloat(event.target.value) <= 0 ||
                        event.target.value.substring(0, 2) === '0x') &&
                      !(event.target.value === '')
                    ) {
                      this.setState({
                        newPriceErr: {
                          content: 'The price must be a positive number.',
                        },
                      });
                    } else {
                      this.setState({ newPriceErr: false });
                    }
                  }}
                />
              </Form.Input>
            </Form.Group>
            {this.state.newPrice && !this.state.newPriceErr && (
              <Message info>
                <p>
                  This is going to change the price of your ERC721 token with{' '}
                  <b>ID {this.props.id}</b> to <b>{this.state.newPrice} ETH</b>.
                  <br />
                </p>
              </Message>
            )}
            {this.state.msgErr && (
              <div>
                <Message negative compact>
                  <Message.Header>Something went wrong!</Message.Header>
                  {this.state.msgErr}
                </Message>
                <br />
              </div>
            )}
            {this.state.success && (
              <div>
                <Message positive compact>
                  <Message.Header>Transaction complete!</Message.Header>
                  The transaction was completed successfully.
                </Message>
                <br />
              </div>
            )}
            <Button
              type="submit"
              loading={this.state.loading}
              disabled={this.state.loading}
            >
              Submit
            </Button>
            {Number(this.state.currentPrice) ? (
              <div>
                <p
                  style={{
                    color: 'white',
                    marginBottom: '5px',
                    marginTop: '40px',
                  }}
                >
                  This token is currently up for sale for{' '}
                  {ethers.utils.formatEther(this.state.currentPrice)} ETH. To
                  remove it from sale, click the button bellow.
                </p>
                <Button
                  color="red"
                  onClick={this.removeSale}
                  loading={this.state.saleLoading}
                  disabled={this.state.saleLoading}
                >
                  Remove from sale
                </Button>
              </div>
            ) : (
              ''
            )}
          </Form>
        </Container>
      </Layout>
    );
  }
}

export default SellToken;
