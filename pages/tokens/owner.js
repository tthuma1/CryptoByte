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
  Placeholder,
} from 'semantic-ui-react';
import MMPrompt from '../../components/MMPrompt';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import { Link, Router } from '../../routes';
import web3 from '../../ethereum/web3';
import Jdenticon from '../../components/Jdenticon';
import axios from 'axios';
import Head from 'next/head';

let currentAccount, headerEl;
let viking = process.env.VIKING_AMOUNT.split(',');
let vikingAmount = viking.length;
let specialEdition = process.env.SPECIAL_EDITION.split(',');
let specialEditionAmount = specialEdition.length;
let specialTokens = viking.concat(specialEdition);
let specialTokensAmount = vikingAmount + specialEditionAmount;

class TokensOfOwner extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    images: {},
    buyLoading: {},
    jdentHeigth: 220,
    tokenInfo: {},
  };

  static async getInitialProps({ query }) {
    try {
      let owner = web3.utils.toChecksumAddress(query.owner);
      const balance = await cryptoByte721.methods.balanceOf(owner).call();

      let tokens = [];
      for (let i = 0; i < balance; i++) {
        let token = await cryptoByte721.methods
          .tokenOfOwnerByIndex(owner, i)
          .call();
        tokens.push(token);
      }
      tokens.sort(function (a, b) {
        return a - b;
      });

      return { tokens, owner, balance, isValidAccount: true };
    } catch {
      return { isValidAccount: false };
    }
  }

  async componentDidMount() {
    currentAccount = (await web3.eth.getAccounts())[0];

    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        this.setState({
          transVisible: true,
          headerHeight: headerEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    this.setState({ mounted: true });

    this.getTokenInfo();
  }

  getTokenInfo = async () => {
    let tokenInfo = {};
    let images = {};
    for (let i = 0; i < this.props.balance; i++) {
      let id = Number(this.props.tokens[i]);
      tokenInfo[id] = {};

      tokenInfo[id]['price'] = await cryptoByte721.methods
        .getTokenPrice(id)
        .call();

      // check if token has image and save it in state
      try {
        await axios.get(`../static/images/ERC721/${id}_w.jpg`);
        images[id] = true;
      } catch (error) {
        images[id] = false;
      }

      this.setState({ tokenInfo, images });
    }
  };

  buyToken = async (event) => {
    var id = event.target.name;
    event.preventDefault();

    this.setState((prevState) => {
      let buyLoading = Object.assign({}, prevState.buyLoading);
      buyLoading[id] = true;
      return { buyLoading };
    });

    try {
      await cryptoByte721.methods.buyToken(id).send({
        from: currentAccount,
        value: this.state.tokenInfo[id]['price'],
      });

      Router.replaceRoute(`/tokens/${this.props.owner}`);
    } catch {}

    this.setState((prevState) => {
      let buyLoading = Object.assign({}, prevState.buyLoading);
      buyLoading[id] = false;
      return { buyLoading };
    });
  };

  updateImage = async (e, { calculations }) => {
    this.setState({ jdentHeigth: calculations.height - 50 });
  };

  renderTokens() {
    let items = [];
    let classic = [];
    for (let id = 1; id <= this.props.balance; id++) {
      if (specialTokens.indexOf(String(id)) < 0) {
        classic.push(id);
      }
    }

    items.push(
      this.makeCards(viking),
      this.makeCards(specialEdition),
      this.makeCards(classic)
    );

    return <Card.Group itemsPerRow={3}>{items}</Card.Group>;
  }

  makeCards(ids) {
    let items = [];
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];

      items.push(
        <Card key={id}>
          {this.state.tokenInfo[id] ? (
            this.state.images[id] ? (
              id == this.state.images[Object.keys(this.state.images)[0]] ? (
                <Visibility onUpdate={this.updateImage}>
                  <Image src={`/static/images/ERC721/${id}_w.jpg`} wrapped />
                </Visibility>
              ) : (
                <Image src={`/static/images/ERC721/${id}_w.jpg`} wrapped />
              )
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
            )
          ) : (
            <Placeholder fluid>
              <Placeholder.Image
                style={{ height: this.state.jdentHeigth + 50 }}
              />
            </Placeholder>
          )}
          <Card.Content>
            <Card.Header>
              {viking.indexOf(String(id)) >= 0
                ? 'Viking Collection #' + id
                : specialEdition.indexOf(String(id)) >= 0
                ? 'Special Edition #' + (id - vikingAmount)
                : 'CRBC Token #' + (id - specialTokensAmount)}
            </Card.Header>

            {this.state.tokenInfo[id] ? (
              <div>
                <Card.Description>
                  <b>
                    {Number(this.state.tokenInfo[id]['price'])
                      ? 'Token price: ' +
                        web3.utils.fromWei(
                          this.state.tokenInfo[id]['price'],
                          'ether'
                        ) +
                        ' ETH'
                      : 'Token not for sale'}
                  </b>
                </Card.Description>
                <Card.Meta style={{ overflow: 'auto' }}>
                  Owner : {this.props.owner}
                </Card.Meta>
              </div>
            ) : (
              <Placeholder style={{ marginTop: '10px' }}>
                <Placeholder.Header>
                  <Placeholder.Line length="very short" />
                  <Placeholder.Line length="medium" />
                </Placeholder.Header>
              </Placeholder>
            )}
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

            {this.state.tokenInfo[id] ? (
              Number(this.state.tokenInfo[id]['price']) &&
              this.props.owner != currentAccount ? (
                <Button
                  name={id}
                  primary
                  onClick={this.buyToken}
                  loading={this.state.buyLoading[id]}
                  disabled={this.state.buyLoading[id]}
                  style={{ marginTop: '5px' }}
                >
                  Buy token
                  <Icon name="shopping cart right" />
                </Button>
              ) : (
                ''
              )
            ) : (
              ''
            )}
          </Card.Content>
        </Card>
      );
    }

    return items;
  }

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Head>
          <title>Crypto Byte Collectible - Your Tokens</title>
          <meta
            name="description"
            content="View and manage all Crypto Byte Collectible tokens that you own."
          />
          <meta name="robots" content="index, follow" />
        </Head>
        <MMPrompt />

        <Container
          textAlign="center"
          style={{
            marginTop: this.state.headerHeight + 20,
          }}
        >
          {this.props.isValidAccount ? (
            <div>
              <Header as="h2" inverted dividing>
                {this.props.owner}{' '}
                <span style={{ color: '#E8E8E8' }}>owns</span>{' '}
                {this.props.balance}{' '}
                <span style={{ color: '#E8E8E8' }}>
                  token{this.props.balance != 1 ? 's' : ''}.
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
