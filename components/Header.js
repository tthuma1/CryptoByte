import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { Link } from '../routes';
//import web3 from '../ethereum/web3';
import { ethers } from 'ethers';
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
    try {
      currentAccount = ethers.utils.getAddress(
        (await ethereum.request({ method: 'eth_accounts' }))[0]
      );

      if (
        (await ethereum.request({ method: 'eth_chainId' })) ===
          process.env.NETWORK_VERSION &&
        typeof currentAccount !== 'undefined'
      ) {
        const isMinter = await cryptoByte721.isMinter(currentAccount);

        if (isMinter) {
          this.setState({ isAdmin: 'flex' });
        }
      }
    } catch {}

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

  /*hideAll() {
    this.setState({ visibleFull: 'hidden' });
    this.props.updateState(false);
  }*/

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
                  /*onClick={() => {
                    if (!(location.pathname == '/tokens')) {
                      this.hideAll();
                    } else {
                      this.hideAll();
                      location.reload();
                    }
                  }}*/
                >
                  All Tokens
                </a>
              </Link>
              <Link href={`/tokens/${currentAccount}`}>
                <a
                  className="item"
                  /*onClick={() => {
                    this.hideAll();
                  }}*/
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
          <Link href="/faq">
            <a className="item">FAQ</a>
          </Link>

          {/*
          <Dropdown item text="ERC20 Token">
            <Dropdown.Menu>
              <Link href="/ERC20">
                <a className="item">General Info</a>
              </Link>
              <Link href="/ERC20/buy">
                <a className="item">Buy Tokens</a>
              </Link>
              <Link href="/ERC20/transfer">
                <a className="item">Transfer Tokens</a>
              </Link>
            </Dropdown.Menu>
          </Dropdown>
          */}

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
