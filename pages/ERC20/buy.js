import { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Container,
  Header,
  Message,
  Button,
  Form,
  Input,
} from 'semantic-ui-react';
import cryptoByte20 from '../../ethereum/solidity/ERC20/cryptoByte20';
import MMPrompt from '../../components/MMPrompt';
import web3 from '../../ethereum/web3';
import Head from 'next/head';
import BigNumber from 'bignumber.js';

let currentAccount, headerEl, accountBalance;
let symbol, buyPrice;

class ERC20Buy extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    mmprompt: false,
    amount: '',
    amountErr: false,
    msgErr: false,
    price: false,
    loading: false,
    success: false,
  };

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

    await this.getInfo();

    this.setState({ mounted: true });
  }

  getInfo = async () => {
    symbol = await (await cryptoByte20).methods.symbol().call();
    buyPrice = BigNumber(
      await (await cryptoByte20).methods.getBuyPrice().call()
    );
    buyPrice = BigNumber(
      (await web3).utils.fromWei(buyPrice.toFixed(), 'ether')
    );
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, msgErr: '', success: false });

    try {
      if (this.state.amountErr || this.state.amount === '') {
        throw { message: 'Invalid amount.' };
      }

      if (accountBalance == 0) {
        alert('Insufficient funds!');

        throw 'Insufficient funds!';
      }

      await (await cryptoByte20).methods.buyTokens().send({
        from: currentAccount,
        value: (await web3).utils.toWei(this.state.price.toFixed(), 'ether'),
      });

      this.setState({ loading: false, success: true });
    } catch (err) {
      this.setState({
        loading: false,
        msgErr:
          err.message == 'Invalid amount.'
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
          <title>Crypto Byte Collectible - Buy ERC20</title>
          <meta name="description" content="Buy ERC20 CBTN tokens." />
          <meta name="robots" content="index, follow" />
        </Head>
        <MMPrompt visible={this.state.mmprompt} />

        <Container
          style={{
            marginTop: this.state.headerHeight + 20,
          }}
        >
          <Header as="h3" inverted dividing textAlign="center">
            You can buy {symbol} ERC20 tokens with the form below.
          </Header>

          <Form inverted onSubmit={this.onSubmit}>
            <Form.Group widths="equal">
              <Form.Input label="Amount to buy" error={this.state.amountErr}>
                <Input
                  placeholder="123"
                  value={this.state.amount}
                  onChange={(event) => {
                    this.setState({ amount: event.target.value });

                    if (
                      (isNaN(event.target.value) ||
                        parseFloat(event.target.value) <= 0 ||
                        event.target.value.substring(0, 2) === '0x') &&
                      !(event.target.value === '')
                    ) {
                      this.setState({
                        amountErr: {
                          content: 'Amount must be a positive number.',
                        },
                        price: false,
                        success: false,
                      });
                    } else {
                      this.setState({
                        amountErr: false,
                        price: buyPrice.times(event.target.value),
                      });
                    }
                  }}
                />
              </Form.Input>
              <Form.Field>
                <label />
                {!this.state.amountErr && this.state.amount && (
                  <Message info>
                    <p>
                      This purchase will cost{' '}
                      <b>{this.state.price.toFixed()} ETH</b>. You will receive{' '}
                      <b>
                        {this.state.amount} {symbol}
                      </b>
                      .
                    </p>
                  </Message>
                )}
              </Form.Field>
            </Form.Group>

            {this.state.msgErr && (
              <>
                <Message negative compact>
                  <Message.Header>Something went wrong!</Message.Header>
                  {this.state.msgErr}
                </Message>
                <br />
              </>
            )}
            {this.state.success && (
              <>
                <Message positive compact>
                  <Message.Header>Transaction complete!</Message.Header>
                  The transaction was completed successfully.
                </Message>
                <br />
              </>
            )}

            <Button
              loading={this.state.loading}
              disabled={this.state.loading}
              primary
            >
              Purchase
            </Button>
          </Form>
        </Container>
      </Layout>
    );
  }
}

export default ERC20Buy;
