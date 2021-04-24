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
import Head from 'next/head';

let currentAccount, headerEl, accountBalance;

class GiftToken extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    recAddr: '',
    recAddrErr: false,
    msgErr: false,
    loading: false,
    success: false,
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

    this.setState({ mounted: true });
  }

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, msgErr: '' });
    try {
      if (this.state.recAddrErr || this.state.recAddr === '') {
        throw { message: 'Invalid receiver address.' };
      }

      if (accountBalance == 0) {
        alert('Insufficient funds!');

        throw 'Insufficient funds!';
      }

      await (await cryptoByte721).methods
        .safeTransferFrom(currentAccount, this.state.recAddr, this.props.id)
        .send({
          from: currentAccount,
        });

      this.setState({ loading: false, success: true });
    } catch (err) {
      this.setState({
        loading: false,
        msgErr:
          err.message == 'Invalid receiver address.'
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
          <title>Crypto Byte Collectible - Gift Tokens</title>
          <meta
            name="description"
            content="Gift your Crypto Byte Collectible tokens for free."
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
            You can gift your ERC721 tokens with the form below.
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
                  onChange={(event) => {
                    this.setState({ recAddr: event.target.value });

                    if (
                      !event.target.value.match(/^(0x||0X)[a-fA-F0-9]{40}$/g) &&
                      !(event.target.value === '')
                    ) {
                      this.setState({
                        recAddrErr: {
                          content: 'Please enter a valid address.',
                        },
                      });
                    } else {
                      this.setState({ recAddrErr: false });
                    }
                  }}
                />
              </Form.Input>
            </Form.Group>

            <Message info>
              <p>
                This is going to transact the ERC721 token with{' '}
                <b>ID {this.props.id}</b> from your account.
                <br />
                Once the transaction is done, you can't get your token back. To
                avoid any inconveniences, please double check the receiver
                address (and you should also <b>never</b> hand type addresses).
              </p>
            </Message>

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
      </Layout>
    );
  }
}

export default GiftToken;
