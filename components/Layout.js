import React from 'react';
import Head from 'next/head';
import Header from './Header';
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
          <title>Crypto Byte</title>
          <link
            rel="shortcut icon"
            type="image/ico"
            href="/static/favicon.ico"
          />
          <meta charSet="UTF-8" />
          <meta name="description" content="Official website of Crypto Byte." />
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
        <Header mounted={this.props.mounted} updateState={this.updateState} />

        {this.state.allMounted && this.props.children}
        {/*this.state.allMounted && (
          <div
            style={{
              marginTop: '8vh',
              backgroundColor: 'rgba(255,255,255,.05)',
              color: 'white',
              padding: '2vh',
              textAlign: 'center',
            }}
          >
            Contact:{' '}
            <a href="mailto:info@crypto-byte.com">info@crypto-byte.com</a>
            <span style={{ marginLeft: '5vw' }}>Contract address:</span>{' '}
            <a
              href={`https://rinkeby.etherscan.io/address/${process.env.ADDRESS_721}`}
              target="_blank"
            >
              {process.env.ADDRESS_721}
            </a>
          </div>
          )*/}
      </div>
    );
  }
}

export default Layout;
