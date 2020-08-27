import { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Container,
  Image,
  Card,
  Icon,
  Button,
  Message,
} from 'semantic-ui-react';
import Jdenticon from '../../components/Jdenticon';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import axios from 'axios';

let currentAccount, headerEl, pausedEl;
let vikingAmount = process.env.VIKING_AMOUNT;

class TokenDetails extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    pausedHeight: 0,
    image: false,
    buyLoading: false,
    msgErr: '',
  };

  static async getInitialProps({ query }) {
    let tokenInfo = {};
    let id = query.id;

    tokenInfo['owner'] = await cryptoByte721.methods.ownerOf(id).call();
    tokenInfo['price'] = await cryptoByte721.methods.getTokenPrice(id).call();

    return { id: query.id, tokenInfo };
  }

  async componentDidMount() {
    currentAccount = (await web3.eth.getAccounts())[0];

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

    // check if token has image and save it in state
    try {
      await axios.get(`/static/images/ERC721/${this.props.id}.jpg`);
      await this.setState({ image: true });
    } catch (error) {
      await this.setState({ image: false });
    }

    this.setState({ mounted: true });
  }

  buyToken = async (event) => {
    event.preventDefault();

    this.setState({ buyLoading: true, msgErr: '' });
    let price = await cryptoByte721.methods.getTokenPrice(this.props.id).call();

    try {
      await cryptoByte721.methods.buyToken(this.props.id).send({
        from: currentAccount,
        value: price,
      });

      Router.replaceRoute(`/token/${this.props.id}`);
    } catch (err) {
      this.setState({ msgErr: err.message });
    }

    this.setState({ buyLoading: false });
  };

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Container
          textAlign="center"
          style={{
            marginTop: !this.state.pausedHeight
              ? this.state.headerHeight + 20
              : 20,
          }}
        >
          <Card fluid>
            {this.state.image ? (
              <Container
                textAlign="center"
                style={{ background: 'rgba(0,0,0,.05)', overflow: 'auto' }}
              >
                <Image
                  src={`/static/images/ERC721/${this.props.id}.jpg`}
                  size="big"
                  wrapped
                />
              </Container>
            ) : (
              <Container
                textAlign="center"
                style={{ background: 'rgba(0,0,0,.05)', overflow: 'auto' }}
              >
                <Jdenticon value={this.props.id} size={270} />
              </Container>
            )}

            <Card.Content>
              <Card.Header>
                {Number(this.props.id) <= vikingAmount
                  ? 'Viking Collection #' + this.props.id
                  : 'Classic Token #' + (Number(this.props.id) - vikingAmount)}
              </Card.Header>
              <Card.Description>
                <b>
                  {Number(this.props.tokenInfo['price'])
                    ? 'Token price: ' +
                      web3.utils.fromWei(
                        this.props.tokenInfo['price'],
                        'ether'
                      ) +
                      ' ETH'
                    : 'Token not for sale'}
                </b>
              </Card.Description>
              <Card.Meta style={{ overflow: 'auto' }}>
                Owner
                {currentAccount == this.props.tokenInfo['owner']
                  ? ' (You)'
                  : ''}
                : {this.props.tokenInfo['owner']}
              </Card.Meta>
            </Card.Content>
            <Card.Content extra>
              {this.props.tokenInfo['owner'] == currentAccount ? (
                <div>
                  <Link route={`/sell/${this.props.id}`}>
                    <a
                      onClick={() => {
                        this.setState({ mounted: false });
                      }}
                    >
                      <Button>
                        {Number(this.props.tokenInfo['price'])
                          ? 'Change price or remove from sale'
                          : 'Put up for sale'}
                        <Icon name="tag right" />
                      </Button>
                    </a>
                  </Link>
                  <Link route={`/gift/${this.props.id}`}>
                    <a
                      onClick={() => {
                        this.setState({ mounted: false });
                      }}
                    >
                      <Button>
                        Gift token
                        <Icon name="gift right" />
                      </Button>
                    </a>
                  </Link>
                </div>
              ) : (
                ''
              )}

              {this.props.tokenInfo['owner'] != currentAccount &&
              Number(this.props.tokenInfo['price']) ? (
                <Button
                  primary
                  onClick={this.buyToken}
                  loading={this.state.buyLoading}
                  disabled={this.state.buyLoading}
                >
                  Buy token
                  <Icon name="shopping cart right" />
                </Button>
              ) : (
                ''
              )}
            </Card.Content>
          </Card>
          {this.state.msgErr && (
            <Message negative compact>
              <Message.Header>Something went wrong!</Message.Header>
              {this.state.msgErr}
            </Message>
          )}
        </Container>
      </Layout>
    );
  }
}
export default TokenDetails;
