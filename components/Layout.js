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

  updateState = () => {
    this.setState({ allMounted: true });
  };

  render() {
    return (
      <div>
        <Head>
          <link
            rel="stylesheet"
            href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css"
          />
          <title>Crypto Byte</title>
          <link
            rel="shortcut icon"
            type="image/ico"
            href="/static/favicon.ico"
          />
          <meta charSet="UTF-8" />
          <meta name="description" content="Official website of Crypto Byte." />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
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
      </div>
    );
  }
}

export default Layout;
