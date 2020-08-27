import React from 'react';
import { Menu, Dropdown } from 'semantic-ui-react';
import { Link } from '../routes';
import cryptoByte from '../ethereum/cryptoByte';
import web3 from '../ethereum/web3';
import Paused from '../components/Paused';

let currentAccount, height, isPaused;

class Header extends React.Component {
  state = {
    isAdmin: 'none',
    visibleFull: 'hidden',
    pausedMounted: false,
    hasMounted: false,
  };

  async componentDidMount() {
    this.setState({ hasMounted: false });
    currentAccount = (await web3.eth.getAccounts())[0];

    if (
      (await web3.eth.net.getNetworkType()) === process.env.NETWORK_TYPE &&
      typeof currentAccount !== 'undefined'
    ) {
      const isMinter = await cryptoByte.methods.isMinter(currentAccount).call();
      const isPauser = await cryptoByte.methods.isPauser(currentAccount).call();

      if (isMinter || isPauser) {
        this.setState({ isAdmin: 'flex' });
      }
    }

    isPaused = await cryptoByte.methods.paused().call();

    const interval = setInterval(() => {
      if (!this.state.hasMounted && this.props.mounted == true) {
        this.props.updateState(true);
        this.setState({ visibleFull: 'visible' });
        this.state.hasMounted = true;
      }

      if (this.props.mounted == false) {
        this.props.updateState(false);
        this.setState({ visibleFull: 'hidden' });
      }
    }, 500);

    height = document.getElementById('header').clientHeight;
    window.addEventListener('resize', () => {
      height = document.getElementById('header').clientHeight;
    });
  }

  hideAll() {
    this.setState({ visibleFull: 'hidden' });
    this.props.updateState(false);
  }

  render() {
    return (
      <div>
        {this.state.visibleFull === 'visible' && (
          <Paused
            headerHeight={height}
            isPaused={true} /*isPaused={isPaused}*/
          />
        )}
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
              <img src="/static/favicon.ico" />
            </a>
          </Link>
          <Link href="/">
            <a className="item">Home</a>
          </Link>
          {/*<Link href={`/account/${currentAccount}`}>
            <a className="item">My Account</a>
          </Link>
          <Link href="/buy_tokens/20">
            <a className="item">Buy Tokens</a>
        </Link>*/}
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
              <Link href="/buy_tokens/721">
                <a className="item">Create New Tokens</a>
              </Link>
            </Dropdown.Menu>
          </Dropdown>
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
