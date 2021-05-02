import { Component } from 'react';
import Layout from '../components/Layout';
import {
  Transition,
  Header,
  Icon,
  Container,
  Segment,
  Divider,
  Grid,
  Message,
  Image,
} from 'semantic-ui-react';
import cryptoByte721 from '../ethereum/cryptoByte721';
import { Link } from '../routes';
import web3 from '../ethereum/web3';
import Head from 'next/head';
import { Media, MediaContextProvider } from '../components/Media';

let headerEl, name, symbol;
let mintPrice = '0';
let totalSupply = '0';

class CryptoByteIndex extends Component {
  state = {
    topDivVisible: false,
    pulseOn: true,
    mounted: false,
    headerHeight: 0,
  };

  async componentDidMount() {
    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        this.setState({
          topDivVisible: true,
          headerHeight: headerEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    setInterval(this.pulse, 1600);
    await this.getCryptoByteInfo();

    this.setState({ mounted: true });
  }

  getCryptoByteInfo = async () => {
    name = await (await cryptoByte721).methods.name().call();
    symbol = await (await cryptoByte721).methods.symbol().call();
    mintPrice = await (await cryptoByte721).methods.getMintPrice().call();
    mintPrice = (await web3).utils.fromWei(mintPrice, 'ether');
    totalSupply = await (await cryptoByte721).methods.totalSupply().call();
  };

  pulse = () => {
    this.setState({ pulseOn: false });
    this.setState({ pulseOn: true });
  };

  scrollInfo = async () => {
    const el = document.getElementById('info');
    const yCoordinate = el.getBoundingClientRect().top + window.pageYOffset;
    const yOffset = -this.state.headerHeight;

    await window.scrollTo({
      top: yCoordinate + yOffset,
      behavior: 'smooth',
    });
  };

  render() {
    return (
      <Layout mounted={this.state.mounted} isHome>
        <Head>
          <title>Crypto Byte Collectible - Home</title>
          <meta
            name="description"
            content="Official website of Crypto Byte Collectible tokens - your unique collectible ERC721 (NFT) tokens. Interact with a smart contract deployed on the Ethereum blockchain."
          />
          <meta name="robots" content="index, follow" />
        </Head>

        <Transition
          visible={this.state.topDivVisible}
          animation="scale"
          duration={1000}
        >
          <div
            style={{
              minHeight: '100vh',
              width: '100vw',
              backgroundColor: '#111',
              backgroundImage:
                'url(../static/images/crypto-byte-2-transparent2.png)',
              backgroundAttachment: 'fixed',
              backgroundRepeat: 'no-repeat',
              backgroundPositionY: this.state.headerHeight,
              backgroundSize: 'contain',
            }}
          >
            <MediaContextProvider>
              <Media greaterThan="mobile">
                <Header
                  as="h1"
                  inverted
                  textAlign="center"
                  style={{
                    paddingTop: this.state.headerHeight + 50,
                    textShadow:
                      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                    marginLeft: '5px',
                    marginRight: '5px',
                    fontSize: '2.2rem',
                  }}
                >
                  Welcome to Crypto Byte Collectible!
                  <Header.Subheader
                    style={{ textShadow: '0px 0px 0', fontSize: '1.25rem' }}
                  >
                    Your unique NFT token.
                  </Header.Subheader>
                </Header>
              </Media>

              <Media at="mobile">
                <Header
                  as="h1"
                  inverted
                  textAlign="center"
                  style={{
                    paddingTop: this.state.headerHeight + 50,
                    textShadow:
                      '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                    marginLeft: '5px',
                    marginRight: '5px',
                    paddingTop: '50%',
                    fontSize: '2.2rem',
                  }}
                >
                  Welcome to Crypto Byte Collectible!
                  <Header.Subheader
                    style={{ textShadow: '0px 0px 0', fontSize: '1.25rem' }}
                  >
                    Your unique NFT token.
                  </Header.Subheader>
                </Header>
              </Media>
            </MediaContextProvider>

            <MediaContextProvider>
              <Media greaterThan="mobile">
                <Header
                  as="h2"
                  inverted
                  icon
                  block
                  textAlign="center"
                  style={{
                    marginTop: '57vh',
                    marginBottom: '1%',
                    width: '30%',
                    background: 'linear-gradient(to bottom, #30336b, #4286f4)',
                    border: '0',
                  }}
                >
                  General token info
                  <Transition
                    visible={this.state.pulseOn}
                    animation="pulse"
                    duration={1000}
                  >
                    <Icon
                      onClick={this.scrollInfo}
                      name="arrow alternate circle down"
                      link
                      style={{
                        paddingTop: '5px',
                        fontSize: '2em',
                        color: '#1ecbe1',
                      }}
                    />
                  </Transition>
                </Header>
              </Media>

              <Media at="mobile">
                <Header
                  as="h3"
                  inverted
                  icon
                  block
                  textAlign="center"
                  style={{
                    marginTop: '35vh',
                    marginBottom: '1%',
                    width: '75%',
                    background: 'linear-gradient(to bottom, #30336b, #4286f4)',
                    border: '0',
                  }}
                >
                  General token info
                  <Transition
                    visible={this.state.pulseOn}
                    animation="pulse"
                    duration={1000}
                  >
                    <Icon
                      onClick={this.scrollInfo}
                      name="arrow alternate circle down"
                      link
                      style={{
                        paddingTop: '5px',
                        fontSize: '2em',
                        color: '#1ecbe1',
                      }}
                    />
                  </Transition>
                </Header>
              </Media>
            </MediaContextProvider>
          </div>
        </Transition>

        <Container textAlign="center" id="info">
          <Segment
            inverted
            style={{ backgroundColor: 'rgba(0, 0, 0, 0)', marginTop: '20px' }}
          >
            <MediaContextProvider>
              <Media greaterThan="tablet">
                <video height="425" autoPlay muted>
                  <source src="/static/videos/final.mp4" type="video/mp4" />
                </video>
              </Media>

              <Media lessThan="computer">
                <video width="100%" autoPlay muted>
                  <source src="/static/videos/final.mp4" type="video/mp4" />
                </video>
              </Media>
            </MediaContextProvider>
            <Header as="h2">What is Crypto Byte Collectible?</Header>
            <p style={{ fontSize: '16px' }}>
              It's an ERC721 token smart contract stored on the Ethereum
              blockchain. With it you can generate NFT tokens that are
              guaranteed to be unique and forever yours - stored on the
              blockchain.
              <br />
              You can see some general information about Crypto Byte Collectible
              bellow.
            </p>
            <Divider horizontal>
              <Header as="h1">
                <Icon name="ethereum" color="grey" style={{ margin: '0' }} />
              </Header>
            </Divider>
            <Grid columns={2} celled="internally" stackable>
              <Grid.Row>
                <Grid.Column>
                  <p>
                    Token name: <b>{name}</b>
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <p>
                    Symbol: <b>{symbol}</b>
                  </p>
                </Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <p>
                    Price to create a new token: <b>{mintPrice} ETH</b>
                  </p>
                </Grid.Column>
                <Grid.Column>
                  <p>
                    Current amount of existing tokens:{' '}
                    <b>{totalSupply.toLocaleString('en-US')}</b>
                  </p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
            <Message compact floating style={{ marginTop: '5vh' }}>
              <Message.Header>Important Note:</Message.Header>
              <p>
                In order to interact with the Crypto Byte contract, you'll need
                to have the{' '}
                <Link route="https://metamask.io/">
                  <a target="_blank"> MetaMask</a>
                </Link>{' '}
                browser extension or MetaMask mobile browser installed.
              </p>
              <Image
                src="/static/images/metamask-logo.jpg"
                as="a"
                size="small"
                href="https://metamask.io/"
                target="_blank"
              />
            </Message>
          </Segment>
        </Container>
      </Layout>
    );
  }
}

export default CryptoByteIndex;
