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
} from 'semantic-ui-react';
import Jdenticon from '../../components/Jdenticon';
import cryptoByte721 from '../../ethereum/cryptoByte721';
import web3 from '../../ethereum/web3';
import { Link, Router } from '../../routes';
import axios from 'axios';
import MMPrompt from '../../components/MMPrompt';
import Head from 'next/head';

let currentAccount, headerEl;
let viking = process.env.VIKING_AMOUNT.split(',');
let vikingAmount = viking.length;
let specialEdition = process.env.SPECIAL_EDITION.split(',');
let specialEditionAmount = specialEdition.length;
let specialTokens = vikingAmount + specialEditionAmount;

class TokenDetails extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    image: false,
    buyLoading: false,
    msgErr: '',
    tokenInfo: {},
    jdentHeigth: 310,
  };

  static async getInitialProps({ query }) {
    return { id: Number(query.id) };
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

    tokenInfo['owner'] = await cryptoByte721.methods
      .ownerOf(this.props.id)
      .call();
    tokenInfo['price'] = await cryptoByte721.methods
      .getTokenPrice(this.props.id)
      .call();

    // check if token has image and save it in state
    try {
      await axios.get(`/static/images/ERC721/${this.props.id}.jpg`);
      await this.setState({ image: true });
    } catch (error) {
      await this.setState({ image: false });
    }

    this.setState({ tokenInfo });
  };

  buyToken = async (event) => {
    event.preventDefault();

    this.setState({ buyLoading: true, msgErr: '' });
    try {
      await cryptoByte721.methods.buyToken(this.props.id).send({
        from: currentAccount,
        value: this.state.tokenInfo['price'],
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
        <Head>
          <title>Crypto Byte Collectible - Token #{this.props.id}</title>
          <meta
            name="description"
            content="View details about a Crypto Byte Collectible token."
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
          <Card fluid>
            {this.state.tokenInfo['owner'] ? (
              this.state.image ? (
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
                  style={{
                    background: 'rgba(0,0,0,.05)',
                    overflow: 'auto',
                    paddingTop: '15px',
                    paddingBottom: '15px',
                  }}
                >
                  <Jdenticon
                    value={this.props.id}
                    size={this.state.jdentHeigth}
                  />
                </Container>
              )
            ) : (
              <Placeholder fluid>
                <Placeholder.Image style={{ height: this.state.jdentHeigth }} />
              </Placeholder>
            )}

            <Card.Content>
              <Card.Header>
                {viking.indexOf(String(this.props.id)) >= 0
                  ? 'Viking Collection #' + this.props.id
                  : specialEdition.indexOf(String(this.props.id)) >= 0
                  ? 'Special Edition #' + (this.props.id - vikingAmount)
                  : 'CRBC Token #' + (this.props.id - specialTokens)}
              </Card.Header>

              {this.state.tokenInfo['owner'] ? (
                <div>
                  <Card.Description>
                    <b>
                      {Number(this.state.tokenInfo['price'])
                        ? 'Token price: ' +
                          web3.utils.fromWei(
                            this.state.tokenInfo['price'],
                            'ether'
                          ) +
                          ' ETH'
                        : 'Token not for sale'}
                    </b>
                  </Card.Description>
                  <Card.Meta style={{ overflow: 'auto' }}>
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
              <Container textAlign="left">
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
              </Container>

              {this.state.tokenInfo['owner'] &&
              this.state.tokenInfo['owner'] == currentAccount ? (
                <div style={{ marginTop: '-35.6px' }}>
                  <Link route={`/sell/${this.props.id}`}>
                    <a
                      onClick={() => {
                        this.setState({ mounted: false });
                      }}
                    >
                      <Button>
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

                  {this.state.image && (
                    <Container
                      textAlign="right"
                      style={{ marginTop: '-35.6px' }}
                    >
                      <a
                        href={`/static/images/ERC721/${this.props.id}.jpg`}
                        download
                      >
                        <Button>
                          <Icon name="download" /> Download image
                        </Button>
                      </a>
                    </Container>
                  )}
                </div>
              ) : (
                ''
              )}

              {this.state.tokenInfo['owner'] != currentAccount &&
              Number(this.state.tokenInfo['price']) ? (
                <div style={{ marginTop: '-35.6px' }}>
                  <Button
                    primary
                    onClick={this.buyToken}
                    loading={this.state.buyLoading}
                    disabled={this.state.buyLoading}
                  >
                    Buy token
                    <Icon name="shopping cart right" />
                  </Button>
                </div>
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
