import { Component } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import MMPrompt from '../../components/MMPrompt';
import {
  Button,
  Header,
  Visibility,
  Container,
  Message,
  Form,
  Input,
  Dropdown,
} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import cryptoByte from '../../ethereum/cryptoByte';
import BigNumber from 'bignumber.js';

const dropdownOptions = [
  { key: 'GCRB', text: 'GCRB (1e+9)', value: '1e+9' },
  { key: 'MCRB', text: 'MCRB (1e+6)', value: '1e+6' },
  { key: 'kCRB', text: 'kCRB (1000)', value: '1000' },
  { key: 'CRB', text: 'CRB (1)', value: '1' },
  { key: 'mCRB', text: 'mCRB (0.001)', value: '0.001' },
  { key: 'µCRB', text: 'µCRB (1e-6)', value: '1e-6' },
  { key: 'nCRB', text: 'nCRB (1e-9)', value: '1e-9' },
  { key: 'pCRB', text: 'pCRB (1e-12)', value: '1e-12' },
  { key: 'fCRB', text: 'fCRB (1e-15)', value: '1e-15' },
  { key: 'aCRB', text: 'aCRB (1e-18)', value: '1e-18' },
];

let headerEl, pausedEl;
let decimals, symbol, price, currentAccount;
let inUSD, inETH;

class BuyTokens extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    pausedHeight: 0,
    amount: '',
    amountErr: false,
    amountETH: 0,
    amountUSD: 0,
    ETHtoUSD: 0,
    dropdownValue: '1',
    dropdownKey: 'CRB',
    msgErr: false,
    success: false,
  };

  async componentDidMount() {
    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        pausedEl = document.getElementById('pausedmsg');
        this.setState({
          transVisible: true,
          headerHeight: headerEl.clientHeight,
          pausedHeight: pausedEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    window.addEventListener('pausedClosed', (_e) => {
      this.setState({ pausedHeight: 0 });
    });

    await this.getETHprice();
    setInterval(this.getETHprice, 30000);

    await this.getCryptoByteInfo();

    this.setState({ mounted: true });
  }

  getCryptoByteInfo = async () => {
    decimals = await cryptoByte.methods.decimals().call();
    symbol = await cryptoByte.methods.symbol().call();
    price = await cryptoByte.methods.tokenPrice().call();
    price = BigNumber(price).div('1e+18');
    currentAccount = (await web3.eth.getAccounts())[0];
  };

  getETHprice = () => {
    fetch(
      `https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD&api_key=${process.env.CRYPTOCOMPARE_KEY}`
    ).then(async (response) => {
      this.setState({ ETHtoUSD: (await response.json()).USD });
      if (typeof inETH !== 'undefined') {
        this.setState({
          amountUSD: inETH.times(this.state.ETHtoUSD).toFixed(),
        });
      }
    });
  };

  onSubmit = async () => {
    this.setState({ loading: true, msgErr: '', success: false });
    try {
      if (this.state.amountErr || this.state.amount === '') {
        throw { message: 'Amount must be a positive number.' };
      }

      if (this.state.amountETH === '0') {
        throw {
          message:
            "Can't buy that few tokens (you should increase the amount).",
        };
      }

      await cryptoByte.methods.buyToken().send({
        from: currentAccount,
        value: web3.utils.toWei(this.state.amountETH, 'ether'),
      });

      this.setState({ loading: false, success: true });
    } catch (err) {
      this.setState({ loading: false, msgErr: err.message });
    }
  };

  setAmountETH = (input) => {
    if (input !== '') {
      input = BigNumber(input).times(BigNumber(this.state.dropdownValue));
      inETH = input.times(price);

      try {
        web3.utils.toWei(inETH.toFixed(), 'ether');
      } catch {
        inETH = BigNumber(
          inETH.toFixed().split('.')[0] +
            '.' +
            inETH.toFixed().split('.')[1].substring(0, 18)
        );
      }

      inUSD = inETH.times(this.state.ETHtoUSD);

      this.setState({ amountETH: inETH.toFixed(), amountUSD: inUSD.toFixed() });
    } else {
      this.setState({ amountETH: 0, amountUSD: 0 });
    }
  };

  updateContent = () => {
    this.setState({ headerHeight: headerEl.clientHeight });
  };

  render() {
    return (
      <Layout mounted={true}>
        <Head>
          <title>Crypto Byte - Buy tokens</title>
        </Head>
        <MMPrompt />

        <Visibility onUpdate={this.updateContent}>
          <Container
            style={{
              marginTop: !this.state.pausedHeight
                ? this.state.headerHeight + 20
                : 20,
            }}
          >
            <Header as="h3" inverted dividing textAlign="center">
              You can buy Crypto Byte tokens (CRB) with ETH with the form below.
            </Header>
            <Form inverted onSubmit={this.onSubmit}>
              <Form.Group widths="equal">
                <Form.Input
                  label="Amount of CRB to buy"
                  error={this.state.amountErr}
                >
                  <Input
                    placeholder="123.456"
                    label={
                      <Dropdown
                        scrolling
                        value={this.state.dropdownValue}
                        options={dropdownOptions}
                        onChange={async (_event, data) => {
                          await this.setState({
                            dropdownValue: data.value,
                            dropdownKey: data.options.find(
                              (o) => o.value === data.value
                            ).key,
                          });

                          this.setAmountETH(this.state.amount);
                        }}
                      />
                    }
                    labelPosition="right"
                    value={this.state.amount}
                    onChange={(event) => {
                      this.setState({ amount: event.target.value });

                      if (
                        (isNaN(event.target.value) ||
                          parseFloat(event.target.value) < 0 ||
                          event.target.value.substring(0, 2) === '0x') &&
                        !(event.target.value === '')
                      ) {
                        this.setState({
                          amountErr: {
                            content: 'The amount must be a positive number.',
                          },
                          amountETH: 0,
                          amountUSD: 0,
                        });
                      } else {
                        this.setState({ amountErr: false });
                        this.setAmountETH(event.target.value);
                      }
                    }}
                  />
                </Form.Input>

                <Form.Field>
                  <label />
                  <Message>
                    This purchase is going to cost you {this.state.amountETH}{' '}
                    ETH (~ ${this.state.amountUSD}).
                  </Message>
                </Form.Field>
              </Form.Group>

              {this.state.amount && !this.state.amountErr && (
                <Message info>
                  <p>
                    You are going to buy{' '}
                    <b>
                      {this.state.amount} {this.state.dropdownKey}
                    </b>{' '}
                    with this transaction.
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
                Purchase
              </Button>
            </Form>
          </Container>
        </Visibility>
      </Layout>
    );
  }
}

export default BuyTokens;
