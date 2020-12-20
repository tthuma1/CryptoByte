import { Component } from 'react';
import Layout from '../components/Layout';
import { Container, Header, Accordion } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import { Link } from '../routes';
import Head from 'next/head';

let headerEl;

let currentAccount = (() => {
  return web3.eth.getAccounts();
})();

console.log();
let panels;

currentAccount.then((value) => {
  panels = [
    {
      key: '1',
      title: 'What is a Crypto Byte Collectible token?',
      content: {
        content: (
          <div>
            <p>
              It is a unique ERC721 compliant token created and stored on the
              Ethereum blockchain.
            </p>
            <p>Token symbol: CRBC</p>
          </div>
        ),
      },
    },
    {
      key: '2',
      title: 'What is ERC721?',
      content:
        'ERC721 is a free open standard which describes how to build non-fungible or unique tokens on the Ethereum blockchain.',
    },
    {
      key: '3',
      title: 'What is the purpose of Crypto Byte Collectible?',
      content: {
        content: (
          <div>
            <p>
              As any other physical collectibles (stamps, coins, etc.) you can
              collect CRBC tokens in digital form.
            </p>
            <p>You can collect, sell or gift CRBC tokens.</p>
          </div>
        ),
      },
    },
    {
      key: '4',
      title: 'What do I need to log in to Crypto Byte collectible website?',
      content: {
        content: (
          <div>
            <p>
              To login all you need is{' '}
              <Link route="https://metamask.io/">
                <a target="_blank">MetaMask</a>
              </Link>{' '}
              desktop browser extension.
            </p>
            <p>
              No other personal information is required. Install the browser
              extension only from MetaMask's original web page. Never share your
              MetaMask recovery phrase with anyone. The Crypto Byte team will{' '}
              <b>never</b> ask for it.
            </p>
          </div>
        ),
      },
    },
    {
      key: '5',
      title: 'Which browsers support MetaMask?',
      content: {
        content: (
          <div>
            <p>Chrome, Firefox and Brave browser.</p>
            <p>
              Note: for security reasons always install browser extensions from
              verified sources.
            </p>
          </div>
        ),
      },
    },
    {
      key: '6',
      title: 'Can I create my own CRBC token?',
      content: {
        content: (
          <div>
            <p>
              Yes, you can create new tokens in{' '}
              <Link route="/create_tokens">
                <a>Create New Tokens</a>
              </Link>{' '}
              section for 0.1 ETH.
            </p>
            <ul>
              <li>Log in with your MetaMask account</li>
              <li>
                Go to{' '}
                <Link route="/create_tokens">
                  <a>Create New Tokens</a>
                </Link>{' '}
                tab
              </li>
              <li>Click on Create</li>
            </ul>
          </div>
        ),
      },
    },
    {
      key: '7',
      title: 'Can I change the price of my CRBC token?',
      content: {
        content: (
          <div>
            <p>
              Yes, you can change the price of your token as many times as you
              want.
            </p>
            <ul>
              <li>Log in with your MetaMask account</li>
              <li>
                Go to{' '}
                <Link route={`/tokens/${value[0]}`}>
                  <a>My Tokens</a>
                </Link>{' '}
                tab
              </li>
              <li>Click on View Details</li>
              <li>Click on Change price or remove from sale</li>
              <li>Enter new token price</li>
            </ul>
            <p>
              If you want to remove token from sale click on Remove from sale
              button.
            </p>
          </div>
        ),
      },
    },
    {
      key: '8',
      title: 'Can I add my own design on new CRBC token?',
      content: {
        content: (
          <p>
            Yes, please contact us at{' '}
            <a href="mailto:info@crypto-byte.com">info@crypto-byte.com</a> for
            more information.
          </p>
        ),
      },
    },
    {
      key: '9',
      title:
        'Can I purchase Crypto Byte Collectible tokens on my mobile phone or tablet?',
      content: 'No, it is not yet supported.',
    },
    {
      key: '10',
      title: 'How do I see my token ownership?',
      content: {
        content: (
          <p>
            You can see it in{' '}
            <Link route={`/tokens/${value[0]}`}>
              <a>My Tokens</a>
            </Link>{' '}
            section and more important you can see it on the Ethereum
            blockchain.
          </p>
        ),
      },
    },
    {
      key: '11',
      title: 'Who pays gas?',
      content: {
        content: (
          <div>
            <p>With every transaction, the client pays a gas fee.</p>
            <p>
              Gas is the fee you pay when you submit transactions to the
              Ethereum network.{' '}
            </p>
            <p>
              Note: because gas fees are constantly changing, we recommend
              checking{' '}
              <Link route="https://www.ethgasstation.info/">
                <a target="_blank">ETH Gas Station</a>
              </Link>{' '}
              for the latest gas price.
            </p>
          </div>
        ),
      },
    },
  ];
});

class FAQ extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
    activeIndex: 0,
  };

  async componentDidMount() {
    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        this.setState({
          headerHeight: headerEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    this.setState({ mounted: true });
  }

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Head>
          <title>Crypto Byte Collectible - FAQ</title>
          <meta
            name="description"
            content="Frequently asked questions about Crypto Byte Collectible tokens."
          />
          <meta name="robots" content="index, follow" />
        </Head>

        <Container
          style={{
            marginTop: this.state.headerHeight + 20,
          }}
        >
          <Header as="h2" inverted dividing textAlign="center">
            Frequently asked questions about Crypto Byte Collectible tokens.
          </Header>

          <Accordion panels={panels} styled fluid exclusive={false} />
        </Container>
      </Layout>
    );
  }
}

export default FAQ;
