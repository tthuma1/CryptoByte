import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { Link } from '../routes';
import web3 from '../ethereum/web3';
import cryptoByte721 from '../ethereum/cryptoByte721';

let currentAccount;

class Header extends React.Component {
  state = {
    isAdmin: 'none',
    visibleFull: 'hidden',
    pausedMounted: false,
    hasMounted: false,
  };

  async componentDidMount() {
    currentAccount = (await web3.eth.getAccounts())[0];

    if (
      (await web3.eth.net.getNetworkType()) === process.env.NETWORK_TYPE &&
      typeof currentAccount !== 'undefined'
    ) {
      const isMinter = await cryptoByte721.methods
        .isMinter(currentAccount)
        .call();

      if (isMinter) {
        this.setState({ isAdmin: 'flex' });
      }
    }

    const interval = setInterval(() => {
      if (!this.state.hasMounted && this.props.mounted == true) {
        this.props.updateState(true);
        this.setState({ visibleFull: 'visible', hasMounted: true });
      }

      if (this.props.mounted == false) {
        this.props.updateState(false);
        this.setState({ visibleFull: 'hidden' });
      }
    }, 500);
  }

  hideAll() {
    this.setState({ visibleFull: 'hidden' });
    this.props.updateState(false);
  }

  render() {
    return (
      <div>
        <Menu
          stackable
          inverted
          fixed="top"
          id="header"
          style={{
            visibility: this.state.visibleFull,
          }}
        >
          <Link href="/">
            <a className="item">
              <img src="/static/favicon2.png" />
            </a>
          </Link>
          <Link href="/">
            <a className="item">Home</a>
          </Link>
          <Dropdown item text="Collectible Tokens">
            <Dropdown.Menu>
              <Link href="/tokens">
                <a
                  className="item"
                  onClick={() => {
                    if (!(location.pathname == '/tokens')) {
                      this.hideAll();
                    } else {
                      this.hideAll();
                      location.reload();
                    }
                  }}
                >
                  All Tokens
                </a>
              </Link>
              <Link href={`/tokens/${currentAccount}`}>
                <a
                  className="item"
                  onClick={() => {
                    this.hideAll();
                  }}
                >
                  My Tokens
                </a>
              </Link>
              <Link href="/create_tokens">
                <a className="item">Create New Tokens</a>
              </Link>
            </Dropdown.Menu>
          </Dropdown>
          <Link href="/media">
            <a className="item">Media</a>
          </Link>

          <Menu.Menu
            position="right"
            style={{
              backgroundColor: '#444444',
              display: this.state.isAdmin,
            }}
          >
            <Link route="/">
              <a className="item">Admin Page</a>
            </Link>
          </Menu.Menu>
        </Menu>
      </div>
    );
  }
}

export default Header;
