import React, { Component } from 'react';
import { Modal, Button, Header, Image } from 'semantic-ui-react';
import { Link } from '../routes';
import { Media, MediaContextProvider } from './Media';

class MMPrompt extends Component {
  state = { modalOpen: false };

  async componentDidMount() {
    setInterval(() => {
      if (this.props.visible == true) {
        this.handleOpen();
      }
    }, 100);
  }

  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  handleOpen = () => {
    this.setState({ modalOpen: true });
  };

  render() {
    return (
      <MediaContextProvider>
        <Media greaterThan="tablet">
          <Modal
            size="small"
            open={this.state.modalOpen}
            trigger={this.props.trigger}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
          >
            <Modal.Header>
              <Image
                src="/static/images/download-metamask-dark.png"
                as="a"
                href="https://metamask.io/"
                target="_blank"
                size="tiny"
              />{' '}
              Use MetaMask to interact with the smart contract
            </Modal.Header>

            <Modal.Content image>
              <Image size="medium" src="/static/images/metamask-network.png" />
              <Modal.Description>
                <p>
                  To interact with the Crypto Byte Collectible smart contract,
                  you'll need to have the{' '}
                  <Link route="https://metamask.io/">
                    <a target="_blank">MetaMask</a>
                  </Link>{' '}
                  browser extension.
                  <br />
                  Make sure you're connected to the Ethereum Mainnet.
                </p>
                <p>
                  Once you have completed these steps you may have to click the
                  Log In With MetaMask button in the top right corner of your
                  screen.
                </p>
              </Modal.Description>
            </Modal.Content>

            <Modal.Actions>
              <Button color="green" inverted onClick={this.handleClose}>
                Close
              </Button>
            </Modal.Actions>
          </Modal>
        </Media>

        {/* tablet/phone view */}

        <Media lessThan="tablet">
          <Modal
            open={this.state.modalOpen}
            trigger={this.props.trigger}
            onClose={this.handleClose}
            onOpen={this.handleOpen}
          >
            <Modal.Header>
              <Image
                src="/static/images/download-metamask-dark.png"
                as="a"
                href="https://metamask.io/"
                target="_blank"
                size="tiny"
              />{' '}
              Use MetaMask to interact with the smart contract
            </Modal.Header>

            <Modal.Content image scrolling>
              <Modal.Description>
                <p>
                  To interact with the Crypto Byte Collectible smart contract,
                  you'll need to have the{' '}
                  <Link route="https://metamask.io/">
                    <a target="_blank">MetaMask</a>
                  </Link>{' '}
                  browser extension.
                  <br />
                  Make sure you're connected to the Ethereum Mainnet.
                </p>
              </Modal.Description>
              <Image size="medium" src="/static/images/metamask-network.png" />
              <p style={{ paddingBottom: '1rem' }}>
                Once you have completed these steps you may have to click the
                Log In With MetaMask button in the top right corner of your
                screen.
              </p>
            </Modal.Content>

            <Modal.Actions>
              <Button color="green" inverted onClick={this.handleClose}>
                Close
              </Button>
            </Modal.Actions>
          </Modal>
        </Media>
      </MediaContextProvider>
    );
  }
}

export default MMPrompt;
