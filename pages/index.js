import { Component } from 'react';
import MMPrompt from '../components/MMPrompt';
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
  Button,
} from 'semantic-ui-react';
import cryptoByte721 from '../ethereum/cryptoByte721';
import { Link } from '../routes';
import web3 from '../ethereum/web3';
import Head from 'next/head';

let headerEl, name, symbol, currentAccount, pausedEl;
let mintPrice = '0';
let totalSupply = '0';

class CryptoByteIndex extends Component {
  state = {
    topDivVisible: false,
    pulseOn: true,
    mounted: false,
    headerHeight: 0,
    pausedHeight: 0,
  };

  async componentDidMount() {
    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        pausedEl = document.getElementById('pausedmsg');
        this.setState({
          topDivVisible: true,
          headerHeight: headerEl.clientHeight,
          pausedHeight: pausedEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    setInterval(this.pulse, 1600);
    await this.getCryptoByteInfo();
    window.addEventListener('pausedClosed', (_e) => {
      this.setState({ pausedHeight: 0 });
    });

    this.setState({ mounted: true });
  }

  getCryptoByteInfo = async () => {
    name = await cryptoByte721.methods.name().call();
    symbol = await cryptoByte721.methods.symbol().call();
    mintPrice = await cryptoByte721.methods.getMintPrice().call();
    totalSupply = await cryptoByte721.methods.totalSupply().call();
    currentAccount = (await web3.eth.getAccounts())[0];
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
          <title>Crypto Byte - Home</title>
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
              backgroundPositionY:
                this.state.headerHeight + this.state.pausedHeight,
              backgroundSize: 'contain',
            }}
          >
            <Header
              as="h1"
              inverted
              textAlign="center"
              style={{
                paddingTop: !this.state.pausedHeight
                  ? this.state.headerHeight + 50
                  : 20,
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
                Your unique ERC721 token.
              </Header.Subheader>
            </Header>

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
              Learn how to get started!
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
          </div>
        </Transition>

        <Container textAlign="center" id="info">
          <Segment
            inverted
            style={{ backgroundColor: 'rgba(0, 0, 0, 0)', marginTop: '20px' }}
          >
            <video height="425" autoPlay muted>
              <source src="/static/videos/final.mp4" type="video/mp4" />
            </video>
            <Header as="h2">What is Crypto Byte Collectible?</Header>
            <p style={{ fontSize: '16px' }}>
              It's an ERC721 token smart contract, stored on the Ethereum
              blockchain. With it you can generate tokens that are guaranteed to
              be unique and forever yours - stored on the blockchain.
              <br />
              You can see some general information about Crypto Byte Collectible
              bellow.
            </p>

            <Divider horizontal>
              <Header as="h1">
                <Icon name="ethereum" color="grey" />
              </Header>
            </Divider>

            <Grid columns={2} celled="internally">
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
                    Price to buy new token:{' '}
                    <b>{web3.utils.fromWei(mintPrice, 'ether')} ETH</b>
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
                to have{' '}
                <Link route="https://metamask.io/">
                  <a target="_blank"> MetaMask</a>
                </Link>{' '}
                installed in your browser.
              </p>
            </Message>

            <div style={{ marginBottom: '8vh' }}>
              <Header
                as="h2"
                inverted
                style={{
                  marginTop: '11vh',
                }}
              >
                <Divider />
                How to use Crypto Byte Collectible?
              </Header>
              <p style={{ fontSize: '16px' }}>
                To start off, you'll need to have{' '}
                <Link route="https://metamask.io/">
                  <a target="_blank"> MetaMask</a>
                </Link>{' '}
                installed in your browser. To see how to use MetaMask, click on
                this button.{' '}
                <MMPrompt
                  trigger={
                    <Button size="small" compact>
                      View Instructions
                    </Button>
                  }
                  visible={false}
                />
                <br />
                Your MetaMask account will be used to login you to Crypto Byte's
                webpage.
              </p>
              <Divider horizontal style={{ color: 'DarkGray' }}>
                THEN
              </Divider>
              <p style={{ fontSize: '16px' }}>
                Once you have your account set up, you can start by buying a
                brand new token. Use the menu at the top to navigate to{' '}
                <Link route={'/buy_tokens/721'}>
                  <a>Buy New Tokens</a>
                </Link>{' '}
                page. Once there, you can buy your first token for{' '}
                {web3.utils.fromWei(mintPrice, 'ether')} ETH.
              </p>
              <Divider horizontal style={{ color: 'DarkGray' }}>
                THEN
              </Divider>
              <p style={{ fontSize: '16px' }}>
                To get a full list of tokens you own, navigate to{' '}
                <Link href={`/tokens/${currentAccount}`}>
                  <a>My Tokens</a>
                </Link>{' '}
                page. There you can put your tokens up for sale or gift them to
                someone.
                <br />
                To get a list of all existing tokens, navigate to{' '}
                <Link href="/tokens">
                  <a>All Tokens</a>
                </Link>{' '}
                page. If any tokens are up for sale, you can buy them there.
              </p>
            </div>
          </Segment>
        </Container>
        <div
          style={{
            backgroundColor: 'rgba(255,255,255,.05)',
            color: 'white',
            padding: '2vh',
            textAlign: 'center',
          }}
        >
          Contact:{' '}
          <a
            href="mailto:erc721.collectible@gmail.com"
            style={{ color: 'white' }}
          >
            erc721.collectible@gmail.com
          </a>
          <span style={{ marginLeft: '5vw' }}>Etherscan:</span>{' '}
          <a
            href={`https://rinkeby.etherscan.io/address/${process.env.ADDRESS_721}`}
            target="_blank"
          >
            {process.env.ADDRESS_721}
          </a>
        </div>
      </Layout>
    );
  }
}

export default CryptoByteIndex;
