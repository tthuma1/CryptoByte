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
import cryptoByte721Signer from '../../ethereum/cryptoByte721Signer';
import { Link, Router } from '../../routes';
import { ethers } from 'ethers';
import Jdenticon from '../../components/Jdenticon';
import axios from 'axios';
import MMPrompt from '../../components/MMPrompt';
import Head from 'next/head';

let headerEl;
let currentAccount;
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
    supply: 0,
    images: {},
    buyLoading: {},
    jdentHeigth: 174,
    jdentWidth: 357,
    tokenInfo: {},
    mmprompt: false,
  };

  async componentDidMount() {
    try {
      currentAccount = ethers.utils.getAddress(
        (await ethereum.request({ method: 'eth_accounts' }))[0]
      );
    } catch {}

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
    const supply = (await cryptoByte721.totalSupply()).toString();
    this.setState({ supply });

    let tokenInfo = {};
    let images = {};
    for (let id = 1; id <= this.state.supply; id++) {
      tokenInfo[id] = {};

      tokenInfo[id]['owner'] = await cryptoByte721.ownerOf(id);

      tokenInfo[id]['price'] = await cryptoByte721.getTokenPrice(id);

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
      await (
        await cryptoByte721Signer.buyToken(id, {
          value: this.state.tokenInfo[id]['price'],
        })
      ).wait();

      window.location.reload();
    } catch {
      this.setState({ mmprompt: true });

      setTimeout(() => {
        this.setState({ mmprompt: false });
      }, 100);
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
      jdentWidth: calculations.width,
    });
  };

  renderTokens() {
    let items = [];
    let classic = [];
    for (let id = 1; id <= this.state.supply; id++) {
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
              id == 1 ? (
                <Visibility onUpdate={this.updateImage}>
                  <Image src={`/static/images/ERC721/${id}_w.jpg`} />
                </Visibility>
              ) : (
                <Image src={`/static/images/ERC721/${id}_w.jpg`} />
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
                        ethers.utils
                          .formatEther(this.state.tokenInfo[id]['price'])
                          .toString() +
                        ' ETH'
                      : 'Token not for sale'}
                  </b>
                </Card.Description>
                <Card.Meta style={{ overflow: 'auto', fontSize: '0.9em' }}>
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
            There are currently {this.state.supply} existing tokens.
          </Header>
          {this.renderTokens()}
        </Container>
      </Layout>
    );
  }
}

export default AllTokens;
