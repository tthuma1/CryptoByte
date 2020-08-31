import React from 'react';
import Head from 'next/head';
import Header from './Header';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { allMounted: false };
    try {
      ethereum.on('accountsChanged', (_accounts) => {
        location.reload();
        ethereum.on('chainChanged', (chainId) => {
          location.reload();
        });
      });
    } catch {}
  }

  updateState = (isMounted) => {
    if (isMounted) {
      this.setState({ allMounted: true });
    } else {
      this.setState({ allMounted: false });
    }
  };

  render() {
    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
          <meta name="viewport" content="width=1024" />
          <title>Crypto Byte Collectible</title>
          <link
            rel="shortcut icon"
            type="image/ico"
            href="/static/favicon.ico"
          />
          <meta charSet="UTF-8" />
          <meta
            name="description"
            content="Official website of Crypto Byte Collectible tokens - your unique collectible ERC721 tokens. Interact with a smart contract deployed on the Ethereum blockchain."
          />
          <meta
            name="keywords"
            content="Crypto, Byte, Collectible, Ethereum, Ether, ETH, ERC721, token, tokens"
          />
          <meta name="robots" content="index, follow" />
        </Head>
        <style>
          {`
html, body {
  background-color: #03080c;
  scroll-behavior: smooth;
}
          `}
        </style>

        {!this.props.isHome ? (
          <style>
            {`
html, body {
  background: linear-gradient(to top, #111, #333);
  background-attachment: fixed;
}
          `}
          </style>
        ) : (
          ''
        )}

        {!this.state.allMounted && <LoadingScreen />}

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header mounted={this.props.mounted} updateState={this.updateState} />

          <div style={{ flex: 1 }}>
            {this.state.allMounted && this.props.children}
          </div>

          {this.state.allMounted && <Footer />}
        </div>
      </div>
    );
  }
}

export default Layout;
