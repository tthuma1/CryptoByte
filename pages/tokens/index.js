import { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Container,
  Header,
  Card,
  Icon,
  Button,
  Image,
  Visibility,
} from 'semantic-ui-react';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import { Link, Router } from '../../routes';
import web3 from '../../ethereum/web3';
import Jdenticon from '../../components/Jdenticon';
import axios from 'axios';

let headerEl, pausedEl;
let currentAccount;
let vikingAmount = process.env.VIKING_AMOUNT;

class AllTokens extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    pausedHeight: 0,
    images: {},
    buyLoading: false,
    jdentHeigth: 136,
  };

  static async getInitialProps() {
    let tokens = [];
    const supply = await cryptoByte721.methods.totalSupply().call();

    for (let i = 0; i < supply; i++) {
      let token = await cryptoByte721.methods.tokenByIndex(i).call();
      tokens.push(token);
    }

    let tokenInfo = {};
    for (let i = 0; i < tokens.length; i++) {
      let id = tokens[i];
      tokenInfo[id] = {};

      tokenInfo[id]['owner'] = await cryptoByte721.methods.ownerOf(id).call();

      tokenInfo[id]['price'] = await cryptoByte721.methods
        .getTokenPrice(id)
        .call();
    }
    tokens.sort(function (a, b) {
      return a - b;
    });

    return { tokens, supply, tokenInfo };
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
    for (let i = 0; i < this.props.supply; i++) {
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
    this.setState({ jdentHeigth: calculations.height - 40 });
  };

  renderTokens() {
    const items = this.props.tokens.map((id) => {
      id = Number(id);
      return (
        <Card key={id}>
          {this.state.images[id] ? (
            id == 1 ? (
              <Visibility onUpdate={this.updateImage}>
                <Image src={`/static/images/ERC721/${id}.jpg`} wrapped />
              </Visibility>
            ) : (
              <Image src={`/static/images/ERC721/${id}.jpg`} wrapped />
            )
          ) : (
            <Container
              textAlign="center"
              style={{
                background: 'rgba(0,0,0,.05)',
                overflow: 'auto',
                paddingTop: '20px',
                paddingBottom: '20px',
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
            <Card.Meta style={{ overflow: 'auto', fontSize: '0.9em' }}>
              Owner
              {currentAccount == this.props.tokenInfo[id]['owner'] ? (
                <b style={{ color: 'rgba(0,0,0,.68)' }}> (You)</b>
              ) : (
                ''
              )}
              : {this.props.tokenInfo[id]['owner']}
            </Card.Meta>
          </Card.Content>
          <Card.Content extra>
            <Link route={`/token/${id}`}>
              <a
                onClick={() => {
                  this.setState({ mounted: false });
                }}
              >
                <Button>
                  View Details
                  <Icon name="chevron circle right" />
                </Button>
              </a>
            </Link>

            {Number(this.props.tokenInfo[id]['price']) &&
            this.props.tokenInfo[id]['owner'] != currentAccount ? (
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

    return <Card.Group itemsPerRow={3}>{items}</Card.Group>;
  }

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
          <Header as="h2" dividing inverted>
            There are currently {this.props.supply} existing tokens.
          </Header>
          {this.renderTokens()}
        </Container>
      </Layout>
    );
  }
}

export default AllTokens;
