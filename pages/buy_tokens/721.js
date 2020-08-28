import { Component } from 'react';
import Layout from '../../components/Layout';
import MMPrompt from '../../components/MMPrompt';
import {
  Container,
  Header,
  Form,
  Message,
  Button,
  Segment,
} from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import BigNumber from 'bignumber.js';
import Jdenticon from '../../components/Jdenticon';
import { Router } from '../../routes';

let headerEl, pausedEl, currentAccount;
let priceETH = 0;
let vikingAmount = process.env.VIKING_AMOUNT;

class BuyToken721 extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    pausedHeight: 0,
    msgErr: false,
    success: false,
    id: 0,
    initialId: 0,
    loading: false,
  };

  async componentDidMount() {
    currentAccount = (await web3.eth.getAccounts())[0];

    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        pausedEl = document.getElementById('pausedmsg');
        this.setState({
          headerHeight: headerEl.clientHeight,
          pausedHeight: pausedEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    window.addEventListener('pausedClosed', (_e) => {
      this.setState({ pausedHeight: 0 });
    });

    priceETH = await cryptoByte721.methods.getMintPrice().call();
    priceETH = BigNumber(priceETH).div('1e+18');

    this.setState({
      initialId: Number(await cryptoByte721.methods.totalSupply().call()) + 1,
      id: Number(await cryptoByte721.methods.totalSupply().call()) + 1,
    });

    setInterval(async () => {
      this.setState({
        id: Number(await cryptoByte721.methods.totalSupply().call()) + 1,
      });

      if (this.state.id != this.state.initialId) {
        location.reload();
      }
    }, 15000);

    this.setState({ mounted: true });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    this.setState({ loading: true, msgErr: '', success: false });

    try {
      await cryptoByte721.methods.safeMint(currentAccount).send({
        from: currentAccount,
        value: web3.utils.toWei(priceETH.toFixed(), 'ether'),
      });

      this.setState({ loading: false, success: true });
      Router.pushRoute(`/token/${this.state.id}`);
    } catch (err) {
      this.setState({ loading: false, msgErr: err.message });
    }
  };

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <MMPrompt />

        <Container
          style={{
            marginTop: !this.state.pausedHeight
              ? this.state.headerHeight + 20
              : 20,
          }}
        >
          <Header as="h3" inverted dividing textAlign="center">
            You can create new Crypto Byte Collectible tokens with ETH with the
            form below.
          </Header>

          <Form inverted onSubmit={this.onSubmit}>
            <Form.Group widths="equal">
              <Form.Field>
                <label />
                <Segment textAlign="center" style={{ padding: 0 }}>
                  <div
                    style={{ background: 'rgba(0,0,0,.05)', overflow: 'auto' }}
                  >
                    <Jdenticon size={270} value={this.state.id} />
                  </div>
                </Segment>
                <Message>
                  The ID of your newly created token will be{' '}
                  <b>#{this.state.id - vikingAmount}</b>.
                  <br />
                  Above image will be used to identify your token. If you'd like
                  to use a custom image, please contact us at{' '}
                  <b>
                    <a href="mailto:info@crypto-byte.com">
                      info@crypto-byte.com
                    </a>
                  </b>
                </Message>
              </Form.Field>

              <Form.Field>
                <label />
                <Message>
                  The creation of a new token is going to cost you{' '}
                  <b>{priceETH.toFixed()} ETH</b>.
                  <br />
                  Gas isn't included in the price above.
                </Message>
              </Form.Field>
            </Form.Group>

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
              Create
            </Button>
          </Form>
        </Container>
      </Layout>
    );
  }
}

export default BuyToken721;
