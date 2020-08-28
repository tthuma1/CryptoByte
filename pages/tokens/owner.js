import { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Container,
  Header,
  Card,
  Icon,
  Button,
  Image,
  Segment,
  Message,
  Visibility,
} from 'semantic-ui-react';
import MMPrompt from '../../components/MMPrompt';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import { Link, Router } from '../../routes';
import web3 from '../../ethereum/web3';
import Jdenticon from '../../components/Jdenticon';
import axios from 'axios';

let currentAccount, headerEl, pausedEl;
let vikingAmount = process.env.VIKING_AMOUNT;

class TokensOfOwner extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    pausedHeight: 0,
    images: {},
    buyLoading: false,
    jdentHeigth: 220,
  };

  static async getInitialProps({ query }) {
    try {
      let owner = web3.utils.toChecksumAddress(query.owner);
      let tokens = [];
      const count = await cryptoByte721.methods.balanceOf(owner).call();

      for (let i = 0; i < count; i++) {
        let token = await cryptoByte721.methods
          .tokenOfOwnerByIndex(owner, i)
          .call();
        tokens.push(token);
      }

      let tokenInfo = {};
      for (let i = 0; i < tokens.length; i++) {
        let id = tokens[i];
        tokenInfo[id] = {};

        tokenInfo[id]['price'] = await cryptoByte721.methods
          .getTokenPrice(id)
          .call();
      }
      tokens.sort(function (a, b) {
        return a - b;
      });

      return { tokens, owner, tokenInfo, count, isValidAccount: true };
    } catch {
      return { isValidAccount: false };
    }
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
    let images = {};
    for (let i = 0; i < this.props.count; i++) {
      let id = this.props.tokens[i];
      try {
        await axios.get(`../static/images/ERC721/${id}.jpg`);
        images[id] = true;
      } catch (error) {
        images[id] = false;
      }
    }
    await this.setState({ images });

    this.setState({ mounted: true });
  }

  buyToken = async (event) => {
    let id = event.target.name;
    event.preventDefault();

    this.setState({ buyLoading: true });

    try {
      await cryptoByte721.methods.buyToken(id).send({
        from: currentAccount,
        value: this.props.tokenInfo[id]['price'],
      });

      Router.replaceRoute('/tokens');
    } catch {}

    this.setState({ buyLoading: false });
  };

  updateImage = async (e, { calculations }) => {
    this.setState({ jdentHeigth: calculations.height - 50 });
  };

  renderTokens() {
    const items = this.props.tokens.map((id) => {
      id = Number(id);
      return (
        <Card key={id}>
          {this.state.images[id] ? (
            <Visibility onUpdate={this.updateImage}>
              <Image src={`/static/images/ERC721/${id}.jpg`} wrapped />
            </Visibility>
          ) : (
            <Container
              textAlign="center"
              style={{
                background: 'rgba(0,0,0,.05)',
                overflow: 'auto',
                paddingTop: '25px',
                paddingBottom: '25px',
              }}
            >
              <Jdenticon value={id} size={this.state.jdentHeigth} />
            </Container>
          )}
          <Card.Content>
            <Card.Header>
              {id <= vikingAmount
                ? 'Viking Collection #' + id
                : 'Classic Token #' + (Number(id) - vikingAmount)}
            </Card.Header>
            <Card.Description>
              <b>
                {Number(this.props.tokenInfo[id]['price'])
                  ? 'Token price: ' +
                    web3.utils.fromWei(
                      this.props.tokenInfo[id]['price'],
                      'ether'
                    ) +
                    ' ETH'
                  : 'Token not for sale'}
              </b>
            </Card.Description>
            <Card.Meta style={{ overflow: 'auto' }}>
              Owner : {this.props.owner}
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Link route={`/token/${id}`}>
              <a>
                <Button>
                  View Details
                  <Icon name="chevron circle right" />
                </Button>
              </a>
            </Link>

            {Number(this.props.tokenInfo[id]['price']) &&
            this.props.owner != currentAccount ? (
              <Button
                name={id}
                primary
                onClick={this.buyToken}
                //loading={this.state.buyLoading}
                disabled={this.state.buyLoading}
                style={{ marginTop: '5px' }}
              >
                Buy token
                <Icon name="shopping cart right" />
              </Button>
            ) : (
              ''
            )}
          </Card.Content>
        </Card>
      );
    });

    return <Card.Group itemsPerRow={2}>{items}</Card.Group>;
  }

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <MMPrompt />

        <Container
          textAlign="center"
          style={{
            marginTop: !this.state.pausedHeight
              ? this.state.headerHeight + 20
              : 20,
          }}
        >
          {this.props.isValidAccount ? (
            <div>
              <Header as="h2" inverted dividing>
                {this.props.owner}{' '}
                <span style={{ color: '#E8E8E8' }}>owns</span>{' '}
                {this.props.count}{' '}
                <span style={{ color: '#E8E8E8' }}>
                  token{this.props.count != 1 ? 's' : ''}.
                </span>
              </Header>
              {this.renderTokens()}
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
                If you're seeing this message, you most likely aren't logged in
                your{' '}
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
      </Layout>
    );
  }
}

export default TokensOfOwner;
