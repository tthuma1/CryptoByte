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
  Dropdown,
  Grid,
  Table,
  Loader
} from 'semantic-ui-react';
import MMPrompt from '../../components/MMPrompt';
import web3 from '../../ethereum/web3';
import cryptoByte from '../../ethereum/cryptoByte';
import BigNumber from 'bignumber.js';
import { Link } from '../../routes';

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

let headerEl, pausedEl, isValidAccount;
let decimals, symbol, currentAccount;
let amount, fac, dec, currentAmount;
let allowances = {};

class ChangeAllowance extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    pausedHeight: 0,
    allowancesLoaded: false,
    speAddr: '',
    amount: '',
    speAddrErr: false,
    amountErr: false,
    msgErr: '',
    loading: false,
    succes: true,
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

    await this.getAllowanceInfo();
  }

  getCryptoByteInfo = async () => {
    decimals = await cryptoByte.methods.decimals().call();
    symbol = await cryptoByte.methods.symbol().call();
    currentAccount = (await web3.eth.getAccounts())[0];

    if (typeof currentAccount !== 'undefined') {
      isValidAccount = true;
    }
  };

  getAllowanceInfo = async () => {
    this.setState({ allowancesLoaded: false });
    if (isValidAccount) {
      const events = await cryptoByte.getPastEvents('Approval', {
        fromBlock: 0,
        toBlock: 'latest',
        filter: {
          owner: currentAccount
        }
      });
      for (let i = 0; i < events.length; i++) {
        allowances[
          events[i].returnValues.spender
        ] = await cryptoByte.methods
          .allowance(currentAccount, events[i].returnValues.spender)
          .call();
      }

      for (let key of Object.keys(allowances)) {
        if (allowances[key] === '0') {
          delete allowances[key];
        }
      }
    }
    this.setState({ allowancesLoaded: true });
  };

  renderAllowances = () => {
    const items = [];

    for (let key in allowances) {
      items.push(
        <Table.Row key={key}>
          <Table.Cell
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis'
            }}
          >
            <Link href={`/account/${key}`}>
              <a title={key}>{key}</a>
            </Link>
          </Table.Cell>
          <Table.Cell title={allowances[key] / 10 ** decimals}>
            {(allowances[key] / 10 ** decimals).toLocaleString('en-US') +
              ' ' +
              symbol}
          </Table.Cell>
          <Table.Cell>
            <Button
              fluid
              onClick={() => {
                this.setState({ speAddr: key, speAddrErr: false });
              }}
              style={{ overflow: 'auto' }}
            >
              Change this address' allowance
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    }

    return items.length > 0 ? (
      <Table.Body>{items}</Table.Body>
    ) : (
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan="3">
            Looks like you don't allow anyone any {symbol}.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  };

  onSubmit = async () => {
    this.setState({ loading: true, msgErr: '', success: false });
    try {
      if (this.state.speAddrErr || this.state.speAddr === '') {
        throw { message: 'Invalid spender address.' };
      }

      if (this.state.amountErr || this.state.amount === '') {
        throw { message: 'Amount must be a positive number.' };
      }

      amount = BigNumber(this.state.amount);
      fac = BigNumber(this.state.dropdownValue);
      dec = BigNumber('1e+' + decimals);
      fac = fac.times(dec);
      amount = amount.times(fac);

      currentAmount = BigNumber(
        allowances[web3.utils.toChecksumAddress(this.state.speAddr)]
      );

      if (amount.isGreaterThan(currentAmount)) {
        await cryptoByte.methods
          .increaseAllowance(
            web3.utils.toChecksumAddress(this.state.speAddr),
            amount.minus(currentAmount).toFixed()
          )
          .send({
            from: currentAccount
          });
      } else if (amount.isLessThan(currentAmount)) {
        await cryptoByte.methods
          .decreaseAllowance(
            web3.utils.toChecksumAddress(this.state.speAddr),
            currentAmount.minus(amount).toFixed()
          )
          .send({
            from: currentAccount
          });
      } else if (amount.isEqualTo(currentAmount)) {
        throw { message: 'New amount is the same as current amount.' };
      } else {
        await cryptoByte.methods
          .approve(
            web3.utils.toChecksumAddress(this.state.speAddr),
            amount.toFixed()
          )
          .send({
            from: currentAccount
          });
      }

      this.setState({ loading: false, success: true });
      this.getAllowanceInfo();
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
          <title>Crypto Byte - Change allowance</title>
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
              You can change the amount of tokens, that you allow another
              account to spend with the form below.
            </Header>
            <Grid stackable divided inverted>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Form inverted onSubmit={this.onSubmit}>
                    <Form.Input
                      error={this.state.speAddrErr}
                      label="Spender address"
                    >
                      <Input
                        placeholder="0x0000000000000000000000000000000000000000"
                        value={this.state.speAddr}
                        onChange={event => {
                          this.setState({ speAddr: event.target.value });

                          if (
                            !event.target.value.match(
                              /^(0x||0X)[a-fA-F0-9]{40}$/g
                            ) &&
                            !(event.target.value === '')
                          ) {
                            this.setState({
                              speAddrErr: {
                                content: 'Please enter a valid address.'
                              }
                            });
                          } else {
                            this.setState({ speAddrErr: false });
                          }
                        }}
                      />
                    </Form.Input>

                    <Form.Input
                      label="Amount to approve"
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

                    {this.state.amount &&
                      this.state.speAddr &&
                      !this.state.amountErr &&
                      !this.state.speAddrErr && (
                        <Message info style={{ overflow: 'auto' }}>
                          <p>
                            This is going to change your allowance to address{' '}
                            <b>
                              {web3.utils.toChecksumAddress(this.state.speAddr)}
                            </b>{' '}
                            from{' '}
                            <b>
                              {allowances[
                                web3.utils.toChecksumAddress(this.state.speAddr)
                              ]
                                ? this.numberWithCommas(
                                    (
                                      allowances[
                                        web3.utils.toChecksumAddress(
                                          this.state.speAddr
                                        )
                                      ] /
                                      10 ** decimals /
                                      this.state.dropdownValue
                                    ).toString()
                                  )
                                : 0}{' '}
                              {this.state.dropdownKey}
                            </b>{' '}
                            to{' '}
                            <b>
                              {this.numberWithCommas(this.state.amount)}{' '}
                              {this.state.dropdownKey}
                            </b>
                            .
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
                </Grid.Column>

                <Grid.Column>
                  <Table unstackable inverted striped celled fixed>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell colSpan="3">
                          You currently allow {symbol} to:
                        </Table.HeaderCell>
                      </Table.Row>
                      <Table.Row columns={2}>
                        <Table.HeaderCell textAlign="center">
                          Address
                        </Table.HeaderCell>
                        <Table.HeaderCell textAlign="center">
                          Value
                        </Table.HeaderCell>
                        <Table.HeaderCell />
                      </Table.Row>
                    </Table.Header>

                    {this.state.allowancesLoaded ? (
                      this.renderAllowances()
                    ) : (
                      <Table.Body>
                        <Table.Row>
                          <Table.Cell colSpan="3">
                            <Loader active inline="centered" inverted />
                          </Table.Cell>
                        </Table.Row>
                      </Table.Body>
                    )}
                  </Table>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Container>
        </Visibility>
      </Layout>
    );
  }
}
export default ChangeAllowance;
