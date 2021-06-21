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
let symbol;

class ERC20Transfer extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    mmprompt: false,
    addr: '',
    addrErr: false,
    msgErr: false,
    amount: '',
    amountErr: false,
    loading: false,
    success: false,
    balance: BigNumber(-1),
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
    try {
      let balance = BigNumber(
        await (await cryptoByte20).methods.balanceOf(currentAccount).call()
      ).div(1e18);
      this.setState({ balance });
    } catch {}

    symbol = await (await cryptoByte20).methods.symbol().call();
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, msgErr: '', success: false });

    try {
      if (this.state.addrErr || this.state.addr === '') {
        throw { message: 'Invalid address.' };
      } else if (this.state.amountErr || this.state.amount === '') {
        throw { message: 'Invalid amount.' };
      } else if (this.state.balance.minus(this.state.amount).lt(BigNumber(0))) {
        throw {
          message: `You don\'t own enough ${symbol} or you aren\'t logged in your MetaMask account.`,
        };
      }

      if (accountBalance == 0) {
        alert('Insufficient funds!');

        throw { message: 'Insufficient funds!' };
      }

      await (await cryptoByte20).methods
        .transfer(
          this.state.addr,
          BigNumber(this.state.amount).times(1e18).toFixed()
        )
        .send({
          from: currentAccount,
        });

      this.setState({ success: true });

      let balance = BigNumber(
        await (await cryptoByte20).methods.balanceOf(currentAccount).call()
      ).div(1e18);

      this.setState({ balance, loading: false });
    } catch (err) {
      this.setState({
        loading: false,
        msgErr:
          err.message == 'Invalid address.' ||
          err.message == 'Insufficient funds!' ||
          err.message == 'Invalid amount.' ||
          err.message ==
            `You don\'t own enough ${symbol} or you aren\'t logged in your MetaMask account.`
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
          <title>Crypto Byte Collectible - Transfer ERC20</title>
          <meta name="description" content="Transfer ERC20 CBTN tokens." />
          <meta name="robots" content="index, follow" />
        </Head>
        <MMPrompt visible={this.state.mmprompt} />

        <Container
          style={{
            marginTop: this.state.headerHeight + 20,
          }}
        >
          <Header as="h3" inverted dividing textAlign="center">
            You can transfer {symbol} ERC20 tokens from your account with the
            form below.
          </Header>

          {currentAccount && (
            <p style={{ color: 'white' }}>
              Your current balance is{' '}
              <b>
                {this.state.balance.toFixed()} {symbol}
              </b>{' '}
              .
            </p>
          )}

          <Form inverted onSubmit={this.onSubmit}>
            <Form.Group widths="equal">
              <Form.Input
                label="Amount to transfer"
                error={this.state.amountErr}
              >
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
                        success: false,
                      });
                    } else {
                      this.setState({
                        amountErr: false,
                      });
                    }
                  }}
                />
              </Form.Input>

              <Form.Input label="Receiver address" error={this.state.addrErr}>
                <Input
                  placeholder="0x0000000000000000000000000000000000000000"
                  value={this.state.addr}
                  onChange={(event) => {
                    this.setState({ addr: event.target.value });

                    if (
                      !event.target.value.match(/^(0x||0X)[a-fA-F0-9]{40}$/g) &&
                      !(event.target.value === '')
                    ) {
                      this.setState({
                        addrErr: {
                          content: 'Please enter a valid address.',
                        },
                      });
                    } else {
                      this.setState({
                        addrErr: false,
                      });
                    }
                  }}
                />
              </Form.Input>
            </Form.Group>

            {!this.state.addrErr &&
              this.state.addr &&
              !this.state.amountErr &&
              this.state.amount &&
              !this.state.balance.eq(BigNumber(-1)) &&
              this.state.balance.minus(this.state.amount).gte(BigNumber(0)) && (
                <Message info>
                  <p style={{ wordWrap: 'break-word' }}>
                    This will transfer{' '}
                    <b>
                      {this.state.amount} {symbol}
                    </b>{' '}
                    from your account to <b>{this.state.addr}</b>.
                  </p>
                </Message>
              )}

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

            <Button loading={this.state.loading} disabled={this.state.loading}>
              Transfer
            </Button>
          </Form>
        </Container>
      </Layout>
    );
  }
}

export default ERC20Transfer;
