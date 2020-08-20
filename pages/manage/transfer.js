import { Component } from 'react';
import Layout from '../../components/Layout';
import Head from 'next/head';
import {
  Container,
  Header,
  Visibility,
  Form,
  Button,
  Input,
  Message,
  Dropdown
} from 'semantic-ui-react';
import MMPrompt from '../../components/MMPrompt';
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
  { key: 'aCRB', text: 'aCRB (1e-18)', value: '1e-18' }
];

let headerEl, pausedEl;
let decimals, currentAccount;
let amount, fac, dec;

class Transfer extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    pausedHeight: 0,
    recAddr: '',
    amount: '',
    recAddrErr: false,
    amountErr: false,
    msgErr: '',
    loading: false,
    success: false,
    dropdownValue: '1',
    dropdownKey: 'CRB'
  };

  async componentDidMount() {
    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        pausedEl = document.getElementById('pausedmsg');
        this.setState({
          headerHeight: headerEl.clientHeight,
          pausedHeight: pausedEl.clientHeight
        });
        clearInterval(headerVisible);
      }
    }, 100);

    window.addEventListener('pausedClosed', _e => {
      this.setState({ pausedHeight: 0 });
    });

    await this.getCryptoByteInfo();

    this.setState({ mounted: true });
  }

  getCryptoByteInfo = async () => {
    decimals = await cryptoByte.methods.decimals().call();
    currentAccount = (await web3.eth.getAccounts())[0];
  };

  onSubmit = async () => {
    this.setState({ loading: true, msgErr: '' });
    try {
      if (this.state.recAddrErr || this.state.recAddr === '') {
        throw { message: 'Invalid receiver address.' };
      }

      if (this.state.amountErr || this.state.amount === '') {
        throw { message: 'Amount must be a positive number.' };
      }

      amount = BigNumber(this.state.amount);
      fac = BigNumber(this.state.dropdownValue);
      dec = BigNumber('1e+' + decimals);
      fac = fac.times(dec);
      amount = amount.times(fac);

      await cryptoByte.methods
        .transfer(
          web3.utils.toChecksumAddress(this.state.recAddr),
          amount.toFixed()
        )
        .send({
          from: currentAccount
        });

      this.setState({ loading: false, success: true });
    } catch (err) {
      this.setState({ loading: false, msgErr: err.message });
    }
  };

  updateContent = () => {
    this.setState({ headerHeight: headerEl.clientHeight });
  };

  numberWithCommas = num => {
    let parts = num.split('.');

    parts[0] = parts[0].replace(/^0+/, '');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    if (parts[0] === '') {
      parts[0] = '0';
    }

    return parts.join('.');
  };

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Head>
          <title>Crypto Byte - Transfer tokens</title>
        </Head>
        <MMPrompt />

        <Visibility onUpdate={this.updateContent}>
          <Container
            style={{
              marginTop: !this.state.pausedHeight
                ? this.state.headerHeight + 20
                : 20
            }}
          >
            <Header as="h3" inverted dividing textAlign="center">
              You can transfer tokens from your account with the form below.
            </Header>
            <Form inverted onSubmit={this.onSubmit}>
              <Form.Group widths="equal">
                <Form.Input
                  error={this.state.recAddrErr}
                  label="Receiver address"
                >
                  <Input
                    placeholder="0x0000000000000000000000000000000000000000"
                    value={this.state.recAddr}
                    onChange={event => {
                      this.setState({ recAddr: event.target.value });

                      if (
                        !event.target.value.match(
                          /^(0x||0X)[a-fA-F0-9]{40}$/g
                        ) &&
                        !(event.target.value === '')
                      ) {
                        this.setState({
                          recAddrErr: {
                            content: 'Please enter a valid address.'
                          }
                        });
                      } else {
                        this.setState({ recAddrErr: false });
                      }
                    }}
                  />
                </Form.Input>

                <Form.Input
                  label="Amount to transfer"
                  error={this.state.amountErr}
                  style={{ width: '90%' }}
                >
                  <Input
                    placeholder="123.456"
                    label={
                      <Dropdown
                        scrolling
                        value={this.state.dropdownValue}
                        options={dropdownOptions}
                        onChange={(_event, data) => {
                          this.setState({
                            dropdownValue: data.value,
                            dropdownKey: data.options.find(
                              o => o.value === data.value
                            ).key
                          });
                        }}
                      />
                    }
                    labelPosition="right"
                    value={this.state.amount}
                    onChange={event => {
                      this.setState({ amount: event.target.value });

                      if (
                        (isNaN(event.target.value) ||
                          parseFloat(event.target.value) < 0 ||
                          event.target.value.substring(0, 2) === '0x') &&
                        !(event.target.value === '')
                      ) {
                        this.setState({
                          amountErr: {
                            content: 'The amount must be a positive number.'
                          }
                        });
                      } else {
                        this.setState({ amountErr: false });
                      }
                    }}
                  />
                </Form.Input>
              </Form.Group>

              {this.state.amount && !this.state.amountErr && (
                <Message info>
                  <p>
                    This is going to transact{' '}
                    <b>
                      {this.numberWithCommas(this.state.amount)}{' '}
                      {this.state.dropdownKey}
                    </b>{' '}
                    from your account.
                    <br />
                    Once the transaction is done, you can't get your CRB back.
                    To avoid any inconveniences, please double check the
                    receiver address (and you should also <b>never</b> hand type
                    addresses).
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
            </Form>
          </Container>
        </Visibility>
      </Layout>
    );
  }
}

export default Transfer;
