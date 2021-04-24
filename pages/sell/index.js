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
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';
import Head from 'next/head';

let currentAccount, headerEl, accountBalance;

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
    await web3;
    if (window.ethereum && window.ethereum.selectedAddress) {
      currentAccount = (await web3).utils.toChecksumAddress(
        window.ethereum.selectedAddress
      );

      accountBalance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [currentAccount, 'latest'],
      });
      accountBalance = (await web3).utils.fromWei(accountBalance, 'ether');
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

    let currentPrice = await (await cryptoByte721).methods
      .getTokenPrice(this.props.id)
      .call();
    currentPrice = (await web3).utils.fromWei(currentPrice, 'ether');

    this.setState({
      currentPrice,
    });

    this.setState({ mounted: true });
  }

  removeSale = async (event) => {
    event.preventDefault();
    this.setState({ saleLoading: true, msgErr: '' });
    try {
      if (accountBalance == 0) {
        alert('Insufficient funds!');

        throw 'Insufficient funds!';
      }

      await (await cryptoByte721).methods.setTokenPrice(this.props.id, 0).send({
        from: currentAccount,
      });

      this.setState({ saleLoading: false, success: true });
      Router.pushRoute(`/token/${this.props.id}`);
    } catch (err) {
      if (err != 'Insufficient funds!') {
        this.setState({
          msgErr: "You aren't logged in your MetaMask account.",
          mmprompt: true,
        });

        setTimeout(() => {
          this.setState({ mmprompt: false });
        }, 100);
      } else {
        // if insufficient funds
        this.setState({ msgErr: err });
      }
    }

    let currentPrice = await (await cryptoByte721).methods
      .getTokenPrice(this.props.id)
      .call();
    currentPrice = (await web3).utils.fromWei(currentPrice, 'ether');

    this.setState({
      currentPrice,
      saleLoading: false,
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, msgErr: '' });

    try {
      if (this.state.newPriceErr || this.state.newPrice === '') {
        throw { message: 'Invalid token price.' };
      }

      if (accountBalance == 0) {
        alert('Insufficient funds!');

        throw 'Insufficient funds!';
      }

      await (await cryptoByte721).methods
        .setTokenPrice(
          this.props.id,
          (await web3).utils.toWei(this.state.newPrice, 'ether')
        )
        .send({
          from: currentAccount,
        });

      this.setState({ loading: false, success: true });
      Router.pushRoute(`/token/${this.props.id}`);
    } catch (err) {
      this.setState({
        loading: false,
        msgErr:
          err.message == 'Invalid token price.'
            ? err.message
            : err == 'Insufficient funds!'
            ? err
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
                  {this.state.currentPrice} ETH. To remove it from sale, click
                  the button bellow.
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
