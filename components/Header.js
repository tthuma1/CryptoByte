import React, { Component } from 'react';
import { Menu, Dropdown, Sidebar, Icon, Button } from 'semantic-ui-react';
import { Link } from '../routes';
import web3 from '../ethereum/web3';
import { Media, MediaContextProvider } from './Media';

let currentAccount;

class Header extends React.Component {
  state = {
    visibleFull: 'hidden',
    pausedMounted: false,
    hasMounted: false,
  };

  async componentDidMount() {
    currentAccount = (await web3.eth.getAccounts())[0];

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

  /*
  hideAll() {
    this.setState({ visibleFull: 'hidden' });
    this.props.updateState(false);
  }
  */

  render() {
    return (
      <MediaContextProvider>
        <Media greaterThan="tablet">
          <DesktopHeader visibleFull={this.state.visibleFull}>
            {this.props.children}
          </DesktopHeader>
        </Media>

        <Media as={true} lessThan="computer">
          <MobileHeader visibleFull={this.state.visibleFull}>
            {this.props.children}
          </MobileHeader>
        </Media>
      </MediaContextProvider>
    );
  }
}

class DesktopHeader extends Component {
  state = { MMreq: false };

  render() {
    return (
      <div>
        <Menu
          inverted
          fixed="top"
          id="header"
          style={{
            visibility: this.props.visibleFull,
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
                    if (location.pathname == '/tokens') {
                      location.reload();
                    }
                  }}
                >
                  All Tokens
                </a>
              </Link>
              <Link href="/tokens/my">
                <a className="item">My Tokens</a>
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

          <Menu.Menu position="right">
            {typeof currentAccount === 'undefined' && (
              <Menu.Item
                className="item"
                disabled={this.state.MMreq}
                style={{ padding: '0' }}
                onClick={() => {
                  try {
                    this.setState({ MMreq: true });
                    // Request account access
                    ethereum.request({ method: 'eth_requestAccounts' });
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <Button
                  disabled={this.state.MMreq}
                  loading={this.state.MMreq}
                  //fluid
                  style={{
                    height: '100%',
                    borderRadius: '0px',
                    color: 'rgba(255,255,255,.9)',
                    backgroundColor: '#444',
                    fontWeight: 'normal',
                  }}
                >
                  Log In With MetaMask
                </Button>
              </Menu.Item>
            )}
          </Menu.Menu>
        </Menu>
        {this.props.children}
      </div>
    );
  }
}

class MobileHeader extends Component {
  state = { open: false };

  handleHide = (ev) => {
    // prevent automatic closing (caused by MMPrompt)
    if (ev.x >= 150) {
      this.setState({ open: false });
    }
  };

  handleOpen = () => this.setState({ open: true });

  render() {
    return (
      <div>
        <Sidebar
          as={Menu}
          animation="overlay"
          inverted
          onHide={this.handleHide}
          vertical
          width="thin"
          visible={this.state.open}
        >
          <Link href="/">
            <a className="item">
              <img src="/static/favicon2.png" width="40px" height="40px" />
            </a>
          </Link>
          <Link href="/">
            <a className="item">Home</a>
          </Link>

          {/*<Dropdown item text="Collectible Tokens" pointing="left">
            <Dropdown.Menu>*/}
          <Menu.Item>
            Collectible Tokens
            <Menu.Menu>
              <Link href="/tokens">
                <a
                  className="item"
                  onClick={() => {
                    if (location.pathname == '/tokens') {
                      location.reload();
                    }
                  }}
                >
                  All Tokens
                </a>
              </Link>
              <Link href="/tokens/my">
                <a className="item">My Tokens</a>
              </Link>
              <Link href="/create_tokens">
                <a className="item">Create New Tokens</a>
              </Link>
            </Menu.Menu>
          </Menu.Item>
          {/*</Dropdown.Menu>
          </Dropdown>*/}

          <Link href="/media">
            <a className="item">Media</a>
          </Link>
          <Link href="/faq">
            <a className="item">FAQ</a>
          </Link>
        </Sidebar>

        <Menu
          inverted
          fixed="top"
          id="header"
          style={{
            visibility: this.props.visibleFull,
          }}
        >
          <Menu.Item onClick={this.handleOpen}>
            <Icon name="sidebar" size="large" id="sidebar-toggle" />
          </Menu.Item>

          <Menu.Menu position="right">
            {typeof currentAccount === 'undefined' && (
              <Menu.Item
                className="item"
                disabled={this.state.MMreq}
                style={{ padding: '0' }}
                onClick={() => {
                  try {
                    this.setState({ MMreq: true });
                    // Request account access
                    ethereum.request({ method: 'eth_requestAccounts' });
                  } catch (error) {
                    console.log(error);
                  }
                }}
              >
                <Button
                  disabled={this.state.MMreq}
                  loading={this.state.MMreq}
                  //fluid
                  style={{
                    height: '100%',
                    borderRadius: '0px',
                    color: 'rgba(255,255,255,.9)',
                    backgroundColor: '#444',
                    fontWeight: 'normal',
                  }}
                >
                  Log In With MetaMask
                </Button>
              </Menu.Item>
            )}
          </Menu.Menu>
        </Menu>

        <Sidebar.Pushable style={{ visibility: this.props.visibleFull }}>
          <Sidebar.Pusher
            dimmed={this.state.open}
            style={{
              display: 'flex',
              flexDirection: 'column',
              minHeight: '100vh',
            }}
          >
            {this.props.children}
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    );
  }
}

export default Header;
