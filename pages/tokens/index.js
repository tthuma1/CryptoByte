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

let headerEl;
let currentAccount;
let vikingAmount = Number(process.env.VIKING_AMOUNT);
let specialEdition = Number(process.env.SPECIAL_EDITION);
let specialTokens = vikingAmount + specialEdition;

class AllTokens extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    images: {},
    buyLoading: {},
    jdentHeigth: 136,
    tokenInfo: {},
  };

  static async getInitialProps() {
    const supply = await cryptoByte721.methods.totalSupply().call();
    return { supply };
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
    for (let id = 1; id <= this.props.supply; id++) {
      tokenInfo[id] = {};

      tokenInfo[id]['owner'] = await cryptoByte721.methods.ownerOf(id).call();

      tokenInfo[id]['price'] = await cryptoByte721.methods
        .getTokenPrice(id)
        .call();

      // check if token has image and save it in state
      try {
        await axios.get(`../static/images/ERC721/${id}.jpg`);
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

      Router.replaceRoute('/tokens');
    } catch {}

    this.setState((prevState) => {
      let buyLoading = Object.assign({}, prevState.buyLoading);
      buyLoading[id] = false;
      return { buyLoading };
    });
  };

  updateImage = async (e, { calculations }) => {
    this.setState({ jdentHeigth: calculations.height - 40 });
  };

  renderTokens() {
    let items = [];
    for (let id = 1; id <= this.props.supply; id++) {
      items.push(
        <Card key={id}>
          {this.state.tokenInfo[id] ? (
            this.state.images[id] ? (
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
              {id <= vikingAmount
                ? 'Viking Collection #' + id
                : id <= vikingAmount + specialEdition
                ? 'Special Edition #' + (id - vikingAmount)
                : 'Classic Token #' + (id - specialTokens)}
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

    return <Card.Group itemsPerRow={3}>{items}</Card.Group>;
  }

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <MMPrompt />

        <Container
          textAlign="center"
          style={{
            marginTop: this.state.headerHeight + 20,
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
