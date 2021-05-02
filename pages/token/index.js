import { Component } from 'react';
import Layout from '../../components/Layout';
import {
  Container,
  Image,
  Card,
  Icon,
  Button,
  Message,
  Placeholder,
  Grid,
  Visibility,
} from 'semantic-ui-react';
import Jdenticon from '../../components/Jdenticon';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import axios from 'axios';
import MMPrompt from '../../components/MMPrompt';
import Head from 'next/head';
import { Media, MediaContextProvider } from '../../components/Media';

let currentAccount, headerEl, accountBalance;
let viking = process.env.VIKING_AMOUNT.split(',');
let vikingAmount = viking.length;
let specialEdition = process.env.SPECIAL_EDITION.split(',');
let specialEditionAmount = specialEdition.length;
let specialTokens = viking.concat(specialEdition);
let specialTokensAmount = vikingAmount + specialEditionAmount;

class TokenDetails extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    image: false,
    video: false,
    description: false,
    buyLoading: false,
    msgErr: '',
    tokenInfo: {},
    jdentHeigth: 310,
    imgHeight: 344,
    mmprompt: false,
    supply: 0,
    classicAll: [],
  };

  static async getInitialProps({ query }) {
    return { id: Number(query.id) };
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

    tokenInfo['owner'] = await (await cryptoByte721).methods
      .ownerOf(this.props.id)
      .call();
    tokenInfo['price'] = await (await cryptoByte721).methods
      .getTokenPrice(this.props.id)
      .call();
    tokenInfo['priceETH'] = (await web3).utils.fromWei(
      tokenInfo['price'],
      'ether'
    );

    // get list of all Classic CRBC Tokens
    const supply = await (await cryptoByte721).methods.totalSupply().call();
    this.setState({ supply });
    let classicAll = [];
    for (let id = 1; id <= this.state.supply; id++) {
      if (specialTokens.indexOf(String(id)) < 0) {
        classicAll.push(id);
      }
    }
    this.setState({ classicAll });

    // check if token has image and save it in state
    try {
      await axios.get(`/static/images/ERC721/${this.props.id}_w.jpg`);
      this.setState({ image: true });
    } catch (err) {}

    try {
      await axios.get(`/static/videos/ERC721/${this.props.id}.mp4`);
      this.setState({ video: true });
    } catch (err) {}

    try {
      let { data } = await axios.get(
        `/static/descriptions/${this.props.id}.txt`
      );
      this.setState({ description: data });
    } catch (err) {}

    this.setState({ tokenInfo });
  };

  buyToken = async () => {
    this.setState({ buyLoading: true, msgErr: '' });
    try {
      if (accountBalance < this.state.tokenInfo['priceETH']) {
        alert(
          'Insufficient funds! At least ' +
            this.state.tokenInfo['priceETH'] +
            ' ETH + gas is required for the transaction.'
        );

        throw 'Insufficient funds!';
      }

      await (await cryptoByte721).methods.buyToken(this.props.id).send({
        from: currentAccount,
        value: this.state.tokenInfo['price'],
      });

      Router.replaceRoute(`/token/${this.props.id}`);
    } catch (err) {
      if (err != 'Insufficient funds!') {
        this.setState({
          msgErr: "You aren't logged in your MetaMask account.",
          mmprompt: true,
        });

        setTimeout(() => {
          this.setState({ mmprompt: false });
        }, 100);
      } else {
        // if insufficient funds
        this.setState({
          msgErr: err,
        });
      }
    }

    this.setState({ buyLoading: false });
  };

  handleUpdateImg = (e, { calculations }) => {
    this.setState({ imgHeight: calculations.height });
  };

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Head>
          <title>Crypto Byte Collectible - Token #{this.props.id}</title>
          <meta
            name="description"
            content="View details about a Crypto Byte Collectible token."
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
          <Visibility>
            <Card fluid>
              {this.state.tokenInfo['owner'] ? (
                this.state.image ? (
                  this.state.video ? ( // has image and video
                    <div
                      style={{
                        background: 'rgba(0,0,0,.05)',
                      }}
                    >
                      <Grid columns="2" stackable>
                        <Grid.Column
                          style={{
                            paddingRight: '0px',
                            height: this.state.imgHeight,
                            marginBottom: '-5px',
                          }}
                        >
                          <Visibility onUpdate={this.handleUpdateImg}>
                            <Image
                              src={`/static/images/ERC721/${this.props.id}_w.jpg`}
                              wrapped
                            />
                          </Visibility>
                        </Grid.Column>
                        <Grid.Column
                          style={{ paddingLeft: '0px', marginBottom: '-5px' }}
                        >
                          <video width="100%" autoPlay loop muted>
                            <source
                              src={`/static/videos/ERC721/${this.props.id}.mp4`}
                              type="video/mp4"
                            />
                          </video>
                        </Grid.Column>
                      </Grid>
                    </div>
                  ) : this.state.description ? ( // has image and description
                    <MediaContextProvider>
                      <Media greaterThan="mobile">
                        <Container
                          style={{
                            background: 'rgba(0,0,0,.05)',
                            paddingTop: '5px',
                            paddingBottom: '5px',
                          }}
                        >
                          <Grid columns="2" stackable>
                            <Grid.Column>
                              <Visibility onUpdate={this.handleUpdateImg}>
                                <Image
                                  src={`/static/images/ERC721/${this.props.id}_w.jpg`}
                                  size="big"
                                  wrapped
                                />
                              </Visibility>
                            </Grid.Column>
                            <Grid.Column
                              textAlign="left"
                              style={{ paddingTop: '5%' }}
                            >
                              <p style={{ whiteSpace: 'pre-line' }}>
                                {this.state.description}
                              </p>
                            </Grid.Column>
                          </Grid>
                        </Container>
                      </Media>
                      <Media at="mobile">
                        <div
                          style={{
                            background: 'rgba(0,0,0,.05)',
                            paddingBottom: '5px',
                          }}
                        >
                          <Grid columns="2" stackable>
                            <Grid.Column>
                              <Visibility onUpdate={this.handleUpdateImg}>
                                <Image
                                  src={`/static/images/ERC721/${this.props.id}_w.jpg`}
                                  size="big"
                                  wrapped
                                />
                              </Visibility>
                            </Grid.Column>
                            <Grid.Column textAlign="left">
                              <p
                                style={{
                                  whiteSpace: 'pre-line',
                                  marginTop: '-0.5rem',
                                  marginBottom: '1rem',
                                }}
                              >
                                {this.state.description}
                              </p>
                            </Grid.Column>
                          </Grid>
                        </div>
                      </Media>
                    </MediaContextProvider>
                  ) : (
                    // only has an image
                    <div
                      style={{
                        background: 'rgba(0,0,0,.05)',
                      }}
                    >
                      <Image
                        src={`/static/images/ERC721/${this.props.id}_w.jpg`}
                        size="big"
                        wrapped
                      />
                    </div>
                  )
                ) : this.state.description ? ( // only has description
                  <MediaContextProvider>
                    <Media greaterThan="mobile">
                      <div
                        style={{
                          background: 'rgba(0,0,0,.05)',
                          paddingTop: '5px',
                          paddingBottom: '5px',
                        }}
                      >
                        <Grid columns="2" stackable>
                          <Grid.Column>
                            <Jdenticon value={this.props.id} size="40vh" />
                          </Grid.Column>
                          <Grid.Column
                            textAlign="left"
                            style={{ paddingTop: '5%' }}
                          >
                            <p style={{ whiteSpace: 'pre-line' }}>
                              {this.state.description}
                            </p>
                          </Grid.Column>
                        </Grid>
                      </div>
                    </Media>
                    <Media at="mobile">
                      <div
                        style={{
                          background: 'rgba(0,0,0,.05)',
                          paddingTop: '5px',
                          paddingBottom: '5px',
                        }}
                      >
                        <Grid columns="2" stackable>
                          <Grid.Column>
                            <Jdenticon value={this.props.id} size="40vh" />
                          </Grid.Column>
                          <Grid.Column textAlign="left">
                            <Container>
                              <p
                                style={{
                                  whiteSpace: 'pre-line',
                                  marginTop: '-2rem',
                                  marginBottom: '1rem',
                                }}
                              >
                                {this.state.description}
                              </p>
                            </Container>
                          </Grid.Column>
                        </Grid>
                      </div>
                    </Media>
                  </MediaContextProvider>
                ) : (
                  // doens't have anything
                  <div
                    style={{
                      background: 'rgba(0,0,0,.05)',
                      paddingTop: '5px',
                      paddingBottom: '5px',
                    }}
                  >
                    <Jdenticon value={this.props.id} size="40vh" />
                  </div>
                )
              ) : (
                <Placeholder fluid>
                  <Placeholder.Image
                    style={{ height: this.state.jdentHeigth }}
                  />
                </Placeholder>
              )}

              <Card.Content>
                <Card.Header>
                  {viking.indexOf(String(this.props.id)) >= 0
                    ? 'Viking Collection #' +
                      (viking.indexOf(String(this.props.id)) + 1)
                    : specialEdition.indexOf(String(this.props.id)) >= 0
                    ? 'Special Edition #' +
                      (specialEdition.indexOf(String(this.props.id)) + 1)
                    : 'CRBC Token #' +
                      (this.state.classicAll.indexOf(this.props.id) + 1)}
                </Card.Header>

                {this.state.tokenInfo['owner'] ? (
                  <div>
                    <Card.Description>
                      <b>
                        {Number(this.state.tokenInfo['price'])
                          ? 'Token price: ' +
                            this.state.tokenInfo['priceETH'] +
                            ' ETH'
                          : 'Token not for sale'}
                      </b>
                    </Card.Description>
                    <Card.Meta style={{ overflowWrap: 'break-word' }}>
                      Owner
                      {currentAccount == this.state.tokenInfo['owner'] ? (
                        <b style={{ color: 'rgba(0,0,0,.68)' }}> (You)</b>
                      ) : (
                        ''
                      )}
                      : {this.state.tokenInfo['owner']}
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
                <Grid columns={3} stackable>
                  <MediaContextProvider>
                    {typeof window !== 'undefined' &&
                      window.screen.width > 786 && ( // if on computer, show back button on the left
                        <Grid.Column textAlign="left">
                          <Media greaterThan="tablet">
                            <Link route="/tokens">
                              <a
                                onClick={() => {
                                  this.setState({ mounted: false });
                                }}
                              >
                                <Button>
                                  <Icon name="arrow alternate circle left" />{' '}
                                  Back
                                </Button>
                              </a>
                            </Link>
                          </Media>
                        </Grid.Column>
                      )}

                    {this.state.tokenInfo['owner'] &&
                    this.state.tokenInfo['owner'] == currentAccount ? (
                      <>
                        <Grid.Column textAlign="center">
                          <Link route={`/sell/${this.props.id}`}>
                            <a
                              onClick={() => {
                                this.setState({ mounted: false });
                              }}
                            >
                              <Button style={{ marginBottom: '.5rem' }}>
                                {Number(this.state.tokenInfo['price'])
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
                        </Grid.Column>

                        <Grid.Column
                          textAlign={
                            window.screen.width > 786 ? 'right' : 'center'
                          }
                        >
                          {this.state.image && (
                            <>
                              <p>
                                <a
                                  href={`/static/images/ERC721/${this.props.id}.jpg`}
                                  download
                                >
                                  <Button>
                                    <Icon name="download" /> Download image
                                  </Button>
                                </a>
                              </p>
                              <p>
                                <a
                                  href={`/static/images/ERC721/${this.props.id}.gif`}
                                  download
                                >
                                  <Button>
                                    <Icon name="download" /> Download GIF
                                  </Button>
                                </a>
                              </p>
                            </>
                          )}
                        </Grid.Column>
                      </>
                    ) : (
                      ''
                    )}

                    {this.state.tokenInfo['owner'] != currentAccount &&
                    Number(this.state.tokenInfo['price']) ? (
                      <>
                        <Grid.Column textAlign="center">
                          <Button
                            primary
                            onClick={this.buyToken}
                            loading={this.state.buyLoading}
                            disabled={this.state.buyLoading}
                          >
                            Buy token
                            <Icon name="shopping cart right" />
                          </Button>
                        </Grid.Column>
                      </>
                    ) : (
                      ''
                    )}

                    <Grid.Column textAlign="center">
                      <Media lessThan="computer">
                        <Link route="/tokens">
                          <a
                            onClick={() => {
                              this.setState({ mounted: false });
                            }}
                          >
                            <Button>
                              <Icon name="arrow alternate circle left" /> Back
                            </Button>
                          </a>
                        </Link>
                      </Media>
                    </Grid.Column>
                  </MediaContextProvider>
                </Grid>
              </Card.Content>
            </Card>
          </Visibility>

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
