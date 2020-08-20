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
          Use MetaMask to interact with the contract
        </Header>
        <Modal.Content image scrolling>
          <Image size="medium" src="/static/images/metamask-network.png" />
          <Modal.Description>
            <p>
              If you would like to interact with the Crypto Byte contract,
              you'll need to have{' '}
              <Link route="https://metamask.io/">
                <a target="_blank"> MetaMask</a>
              </Link>{' '}
              installed in your browser.
              <br />
              Then also make sure you're connected to the Rinkeby Test Net.
            </p>
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button color="green" inverted onClick={this.handleClose}>
            OK
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default MMPrompt;
