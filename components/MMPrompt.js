import React from 'react';
import { Modal, Button, Header, Image } from 'semantic-ui-react';
import { Link } from '../routes';
import web3 from '../ethereum/web3';

let isMetaMask;

class MMPrompt extends React.Component {
  state = {
    modalOpen: true,
    visibility: 'hidden',
  };

  async componentDidMount() {
    isMetaMask = await web3.currentProvider.isMetaMask;
    if (isMetaMask || this.props.visible === false) {
      this.handleClose();
    }
  }

  handleClose = () => {
    this.setState({ modalOpen: false });
  };
  handleOpen = () => {
    this.setState({ modalOpen: true });
  };

  render() {
    return (
      <Modal
        size="small"
        open={this.state.modalOpen}
        trigger={this.props.trigger}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
      >
        <Header as="h3">
          <Image
            src="/static/images/download-metamask-dark.png"
            as="a"
            href="https://metamask.io/"
            target="_blank"
          />
          Use MetaMask to interact with the smart contract
        </Header>
        <Modal.Content image scrolling>
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
              Make sure you're connected to the Main Ethereum Network.
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.handleClose}>
            Close
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default MMPrompt;
