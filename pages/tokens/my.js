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
import cryptoByte721Infura from '../../ethereum/cryptoByte721Infura';
import { Link, Router } from '../../routes';
import web3 from '../../ethereum/web3';
import Jdenticon from '../../components/Jdenticon';
import axios from 'axios';
import Head from 'next/head';

let currentAccount, headerEl, accountBalance;
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
    footerHeight: 0,
    images: {},
    buyLoading: {},
    jdentHeigth: 220,
    tokenInfo: {},
    mmprompt: false,
    tokens: [],
    balance: 0,
    isValidAccount: false,
    supply: 0,
  };

  static async getInitialProps({ query }) {
    try {
      let owner = (await web3).utils.toChecksumAddress(query.owner);
      return { owner };
    } catch {
      return { owner: '' };
    }
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

    if (this.props.owner != '') {
      // with props
      if (currentAccount == this.props.owner) {
        // with props and metamask
        this.setState({ isOwner: true });
      } else {
        // only props, no metamask
        this.setState({ isOwner: false });
      }
    } else if (currentAccount) {
      // no props, logged with metamask
      this.setState({ isOwner: true });
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

    await this.getOwnerInfo();
    await this.getTokenIds();

    this.setState({ mounted: true });

    this.getTokenInfo();
  }

  getOwnerInfo = async () => {
    if (typeof this.state.isOwner === 'undefined') {
      this.setState({ isValidAccount: false });
    } else if (this.state.isOwner) {
      const balance = await cryptoByte721Infura.methods
        .balanceOf(currentAccount)
        .call();

      this.setState({ balance, isValidAccount: true });
    } else {
      const balance = await cryptoByte721Infura.methods
        .balanceOf(this.props.owner)
        .call();

      this.setState({ balance, isValidAccount: true });
    }
  };

  getTokenIds = async () => {
    const supply = await cryptoByte721Infura.methods.totalSupply().call();
    this.setState({ supply });

    let tokens = [];
    for (let i = 0; i < this.state.balance; i++) {
      let token = await cryptoByte721Infura.methods
        .tokenOfOwnerByIndex(
          this.state.isOwner ? currentAccount : this.props.owner,
          i
        )
        .call();
      tokens.push(token);

      tokens.sort(function (a, b) {
        return a - b;
      });
      this.setState({ tokens });
    }
  };

  getTokenInfo = async () => {
    let tokenInfo = {};
    let images = {};
    for (let i = 0; i < this.state.balance; i++) {
      let id = Number(this.state.tokens[i]);
      tokenInfo[id] = {};

      tokenInfo[id]['price'] = await (await cryptoByte721).methods
        .getTokenPrice(id)
        .call();

      tokenInfo[id]['priceETH'] = (await web3).utils.fromWei(
        tokenInfo[id]['price'],
        'ether'
      );

      // check if token has image and save it in state
      try {
        await axios.get(`/static/images/ERC721/${id}_w.jpg`);
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

      Router.replaceRoute(`/tokens/${this.props.owner}`);
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
    this.setState({ jdentHeigth: calculations.height - 50 });
  };

  renderTokens() {
    let items = [];
    let classicAll = [];
    for (let id = 1; id <= this.state.supply; id++) {
      if (specialTokens.indexOf(String(id)) < 0) {
        classicAll.push(id);
      }
    }

    items.push(
      this.makeCards(viking),
      this.makeCards(specialEdition),
      this.makeCards(classicAll)
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

      if (this.state.tokens.indexOf(String(id)) >= 0) {
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
                  style={{ height: this.state.jdentHeigth + 50 }}
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
                    Owner:{' '}
                    {this.state.isOwner ||
                    typeof this.state.isOwner === 'undefined'
                      ? currentAccount
                      : this.props.owner}
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
                !this.state.isOwner ? (
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
        <MMPrompt visible={this.state.mmprompt} />

        <Container
          textAlign="center"
          style={{
            marginTop: this.state.headerHeight + 20,
          }}
        >
          {this.state.isValidAccount ? (
            <div>
              <Header as="h2" inverted dividing>
                <span style={{ wordBreak: 'break-all' }}>
                  {this.state.isOwner ||
                  typeof this.state.isOwner === 'undefined'
                    ? currentAccount
                    : this.props.owner}{' '}
                </span>
                <span style={{ color: '#E8E8E8' }}>owns</span>{' '}
                {this.state.balance}{' '}
                <span style={{ color: '#E8E8E8' }}>
                  token{this.state.balance != 1 ? 's' : ''}.
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
