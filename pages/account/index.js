import { Component } from 'react';
import Layout from '../../components/Layout';
import { Link } from '../../routes';
import Head from 'next/head';
import {
  Button,
  Header,
  Visibility,
  Container,
  Transition,
  Table,
  Grid,
  Loader,
  Segment,
  Message,
} from 'semantic-ui-react';
import MMPrompt from '../../components/MMPrompt';
import web3 from '../../ethereum/web3';
import cryptoByte from '../../ethereum/cryptoByte';

let headerEl, pausedEl, isOwner, isValidAccount;
let decimals, symbol, balance;
let allowances = {};
let allowances2 = {};

class AccountIndex extends Component {
  state = {
    mounted: false,
    transVisible: false,
    headerHeight: 0,
    pausedHeight: 0,
    allowancesLoaded: false,
    allowancesLoaded2: false,
  };

  static async getInitialProps({ query }) {
    try {
      query.address = web3.utils.toChecksumAddress(query.address);
    } catch {}
    return { address: query.address };
  }

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

    await this.getAccountInfo();

    window.addEventListener('pausedClosed', (_e) => {
      this.setState({ pausedHeight: 0 });
    });

    this.setState({ mounted: true });

    await this.getAllowanceInfo();
    await this.getAllowanceInfo2();
  }

  getAccountInfo = async () => {
    decimals = await cryptoByte.methods.decimals().call();
    symbol = await cryptoByte.methods.symbol().call();

    if (typeof this.props.address !== 'undefined') {
      isValidAccount = !!this.props.address.match(/^0x[a-fA-F0-9]{40}$/g);
    }

    if (isValidAccount) {
      balance = await cryptoByte.methods.balanceOf(this.props.address).call();
    }

    const MMAddress = (await web3.eth.getAccounts())[0];
    if (MMAddress === this.props.address) {
      isOwner = true;
    }
  };

  getAllowanceInfo = async () => {
    if (isValidAccount) {
      const events = await cryptoByte.getPastEvents('Approval', {
        fromBlock: 0,
        toBlock: 'latest',
        filter: {
          spender: this.props.address,
        },
      });
      for (let i = 0; i < events.length; i++) {
        allowances[
          events[i].returnValues.owner
        ] = await cryptoByte.methods
          .allowance(events[i].returnValues.owner, this.props.address)
          .call();
      }

      for (let key of Object.keys(allowances)) {
        if (allowances[key] === '0') {
          delete allowances[key];
        }
      }
      this.setState({ allowancesLoaded: true });
    }
  };

  getAllowanceInfo2 = async () => {
    if (isValidAccount) {
      const events = await cryptoByte.getPastEvents('Approval', {
        fromBlock: 0,
        toBlock: 'latest',
        filter: {
          owner: this.props.address,
        },
      });
      for (let i = 0; i < events.length; i++) {
        allowances2[
          events[i].returnValues.spender
        ] = await cryptoByte.methods
          .allowance(this.props.address, events[i].returnValues.spender)
          .call();
      }

      for (let key of Object.keys(allowances2)) {
        if (allowances2[key] === '0') {
          delete allowances2[key];
        }
      }
      this.setState({ allowancesLoaded2: true });
    }
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
              textOverflow: 'ellipsis',
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
        </Table.Row>
      );
    }

    return items.length > 0 ? (
      <Table.Body>{items}</Table.Body>
    ) : (
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan="2">
            Looks like nobody allows you any {symbol}.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  };

  renderAllowances2 = () => {
    const items = [];

    for (let key in allowances2) {
      items.push(
        <Table.Row key={key}>
          <Table.Cell
            style={{
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
            }}
          >
            <Link href={`/account/${key}`}>
              <a title={key}>{key}</a>
            </Link>
          </Table.Cell>
          <Table.Cell title={allowances2[key] / 10 ** decimals}>
            {(allowances2[key] / 10 ** decimals).toLocaleString('en-US') +
              ' ' +
              symbol}
          </Table.Cell>
        </Table.Row>
      );
    }

    return items.length > 0 ? (
      <Table.Body>{items}</Table.Body>
    ) : (
      <Table.Body>
        <Table.Row>
          <Table.Cell colSpan="2">
            Looks like you don't allow anyone any {symbol}.
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  };

  updateContent = () => {
    this.setState({ headerHeight: headerEl.clientHeight });
  };

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Head>
          <title>My Account - {this.props.address}</title>
        </Head>
        <MMPrompt />

        <Visibility onUpdate={this.updateContent}>
          <Transition
            visible={this.state.transVisible}
            animation="slide down"
            duration={500}
          >
            <Container
              textAlign="center"
              style={{
                marginTop: !this.state.pausedHeight
                  ? this.state.headerHeight + 20
                  : 20,
              }}
            >
              {isValidAccount ? (
                <div>
                  <Header
                    id="style-7"
                    as="h2"
                    dividing
                    inverted
                    style={{ overflow: 'auto' }}
                  >
                    <p style={{ color: '#E8E8E8' }}>
                      You're looking at information for account
                    </p>
                    {'\n'}
                    {this.props.address}
                  </Header>

                  <Grid stackable divided inverted>
                    <Grid.Row columns={3}>
                      <Grid.Column>
                        <Table unstackable>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                Overview
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>
                          <Table.Body>
                            <Table.Row>
                              <Table.Cell>Balance: </Table.Cell>
                              <Table.Cell title={balance / 10 ** decimals}>
                                {(balance / 10 ** decimals).toLocaleString(
                                  'en-US'
                                )}
                                {' ' + symbol}
                              </Table.Cell>
                            </Table.Row>
                          </Table.Body>
                        </Table>
                      </Grid.Column>

                      <Grid.Column>
                        <Table unstackable inverted striped celled fixed>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell textAlign="center" colSpan="2">
                                List of allowances
                              </Table.HeaderCell>
                            </Table.Row>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                Allowed {symbol} by:
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>

                          {this.state.allowancesLoaded ? (
                            this.renderAllowances()
                          ) : (
                            <Table.Body>
                              <Table.Row>
                                <Table.Cell colSpan="2">
                                  <Loader active inline="centered" inverted />
                                </Table.Cell>
                              </Table.Row>
                            </Table.Body>
                          )}

                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell colSpan="2">
                                Allows {symbol} to:
                              </Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>

                          {this.state.allowancesLoaded2 ? (
                            this.renderAllowances2()
                          ) : (
                            <Table.Body>
                              <Table.Row>
                                <Table.Cell colSpan="2">
                                  <Loader active inline="centered" inverted />
                                </Table.Cell>
                              </Table.Row>
                            </Table.Body>
                          )}
                        </Table>
                      </Grid.Column>

                      {isOwner && (
                        <Grid.Column textAlign="left">
                          <Segment
                            inverted
                            style={{
                              backgroundColor: 'rgba(0, 0, 0, 0)',
                              padding: '0',
                            }}
                          >
                            <Header as="h4">
                              Use the buttons below to interact with the
                              contract.
                            </Header>
                            Tranfer tokens from your account to another:
                            <br />
                            <Link route={`/manage/transfer`}>
                              <a>
                                <Button>Transfer</Button>
                              </a>
                            </Link>
                            <br />
                            <br />
                            Change the amount of tokens, that you allow another
                            account to spend (or approve a new account):
                            <br />
                            <Link route={`/manage/change_allowance`}>
                              <a>
                                <Button>Change Allowance</Button>
                              </a>
                            </Link>
                            <br />
                            <br />
                            Transfer tokens that you are allowed by another
                            account:
                            <br />
                            <Link route={`/manage/transfer_allowed`}>
                              <a>
                                <Button>Transfer Allowed</Button>
                              </a>
                            </Link>
                            <br />
                          </Segment>
                        </Grid.Column>
                      )}
                    </Grid.Row>
                  </Grid>
                </div>
              ) : (
                <div>
                  <Message negative>
                    <Message.Header>Oops, something went wrong!</Message.Header>
                    <p>
                      Looks like the account you're searching for doesn't exist.
                    </p>
                  </Message>
                  <Segment inverted clearing>
                    If you're seeing this message, you most likely aren't logged
                    in your{' '}
                    <Link route="https://metamask.io/">
                      <a target="_blank"> MetaMask</a>
                    </Link>{' '}
                    account.
                    <br />
                    To view MetaMask use instructions, click on this button.{' '}
                    <MMPrompt
                      trigger={
                        <Button size="small" compact>
                          View Instructions
                        </Button>
                      }
                      visible={false}
                    />
                  </Segment>
                </div>
              )}
            </Container>
          </Transition>
        </Visibility>
      </Layout>
    );
  }
}

export default AccountIndex;
