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
  Placeholder,
} from 'semantic-ui-react';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import { Link, Router } from '../../routes';
import web3 from '../../ethereum/web3';
import Jdenticon from '../../components/Jdenticon';
import axios from 'axios';
import MMPrompt from '../../components/MMPrompt';
import Head from 'next/head';

let headerEl, currentAccount, accountBalance;
let viking = process.env.VIKING_AMOUNT.split(',');
let vikingAmount = viking.length;
let specialEdition = process.env.SPECIAL_EDITION.split(',');
let specialEditionAmount = specialEdition.length;
let specialTokens = viking.concat(specialEdition);
let specialTokensAmount = vikingAmount + specialEditionAmount;

class AllTokens extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    images: {},
    buyLoading: {},
    jdentHeigth: 174,
    tokenInfo: {},
    mmprompt: false,
  };

  static async getInitialProps() {
    const supply = await (await cryptoByte721).methods.totalSupply().call();
    return { supply };
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
    for (let id = 1; id <= this.props.supply; id++) {
      tokenInfo[id] = {};

      tokenInfo[id]['owner'] = await (await cryptoByte721).methods
        .ownerOf(id)
        .call();

      tokenInfo[id]['price'] = await (await cryptoByte721).methods
        .getTokenPrice(id)
        .call();

      tokenInfo[id]['priceETH'] = (await web3).utils.fromWei(
        tokenInfo[id]['price'],
        'ether'
      );

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

  buyToken = async (id) => {
    this.setState((prevState) => {
      let buyLoading = Object.assign({}, prevState.buyLoading);
      buyLoading[id] = true;
      return { buyLoading };
    });

    try {
      if (accountBalance < this.state.tokenInfo[id]['priceETH']) {
        alert(
          'Insufficient funds! At least ' +
            this.state.tokenInfo[id]['priceETH'] +
            ' ETH + gas is required for the transaction.'
        );

        throw 'Insufficient funds!';
      }

      await (await cryptoByte721).methods.buyToken(id).send({
        from: currentAccount,
        value: this.state.tokenInfo[id]['price'],
      });

      Router.replaceRoute('/tokens');
    } catch (err) {
      if (err != 'Insufficient funds!') {
        this.setState({ mmprompt: true });

        setTimeout(() => {
          this.setState({ mmprompt: false });
        }, 100);
      }
    }

    this.setState((prevState) => {
      let buyLoading = Object.assign({}, prevState.buyLoading);
      buyLoading[id] = false;
      return { buyLoading };
    });
  };

  updateImage = async (e, { calculations }) => {
    this.setState({
      jdentHeigth: calculations.height - 40,
    });
  };

  renderTokens() {
    let items = [];
    let classic = [];
    for (let id = 1; id <= this.props.supply; id++) {
      if (specialTokens.indexOf(String(id)) < 0) {
        classic.push(id);
      }
    }

    items.push(
      this.makeCards(viking),
      this.makeCards(specialEdition),
      this.makeCards(classic)
    );

    return (
      <Card.Group itemsPerRow={3} stackable>
        {items}
      </Card.Group>
    );
  }

  makeCards(ids) {
    let items = [];
    for (let i = 0; i < ids.length; i++) {
      let id = ids[i];

      items.push(
        <Card key={id}>
          {this.state.tokenInfo[id] ? (
            this.state.images[id] ? (
              id == 1 ? (
                <Visibility onUpdate={this.updateImage}>
                  <Image src={`/static/images/ERC721/${id}_w.jpg`} />
                </Visibility>
              ) : (
                <Image src={`/static/images/ERC721/${id}_w.jpg`} />
              )
            ) : (
              <div
                style={{
                  background: 'rgba(0,0,0,.05)',
                }}
              >
                <Container
                  textAlign="center"
                  style={{
                    paddingTop: '20px',
                    paddingBottom: '20px',
                  }}
                >
                  <Jdenticon value={id} size={this.state.jdentHeigth} />
                </Container>
              </div>
            )
          ) : (
            <Placeholder fluid>
              <Placeholder.Image
                style={{ height: this.state.jdentHeigth + 40 }}
              />
            </Placeholder>
          )}
          <Card.Content>
            <Card.Header>
              {viking.indexOf(String(id)) >= 0
                ? 'Viking Collection #' + (i + 1)
                : specialEdition.indexOf(String(id)) >= 0
                ? 'Special Edition #' + (i + 1)
                : 'CRBC Token #' + (i + 1)}
            </Card.Header>

            {this.state.tokenInfo[id] ? (
              <div>
                <Card.Description>
                  <b>
                    {Number(this.state.tokenInfo[id]['price'])
                      ? 'Token price: ' +
                        this.state.tokenInfo[id]['priceETH'] +
                        ' ETH'
                      : 'Token not for sale'}
                  </b>
                </Card.Description>
                <Card.Meta
                  style={{ wordWrap: 'break-word', fontSize: '0.9em' }}
                >
                  Owner
                  {currentAccount == this.state.tokenInfo[id]['owner'] ? (
                    <b style={{ color: 'rgba(0,0,0,.68)' }}> (You)</b>
                  ) : (
                    ''
                  )}
                  : {this.state.tokenInfo[id]['owner']}
                </Card.Meta>
              </div>
            ) : (
              <Placeholder style={{ marginTop: '10px' }}>
                <Placeholder.Header>
                  <Placeholder.Line length="very short" />
                  <Placeholder.Line length="medium" />
                </Placeholder.Header>
                <Placeholder.Paragraph>
                  <Placeholder.Line length="short" />
                </Placeholder.Paragraph>
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
              this.state.tokenInfo[id]['owner'] != currentAccount ? (
                <Button
                  primary
                  onClick={() => {
                    this.buyToken(id);
                  }}
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
          <title>Crypto Byte Collectible - All Tokens</title>
          <meta
            name="description"
            content="View all existing Crypto Byte Collectible tokens and buy the ones that are up for sale."
          />
          <meta name="robots" content="index, follow" />
        </Head>
        <MMPrompt visible={this.state.mmprompt} />

        <Container
          textAlign="center"
          style={{
            marginTop: this.state.headerHeight + 20,
          }}
        >
          <Header as="h2" dividing inverted>
            There are currently {this.props.supply} existing tokens.
          </Header>
          <p style={{ color: '#fff', fontSize: '1.2em' }}>
            Each customer who purchases one collectible token receives 10,000
            CBTN.
          </p>
          {this.renderTokens()}
        </Container>
      </Layout>
    );
  }
}

export default AllTokens;
