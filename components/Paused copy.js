import React from 'react';
import { Message, Container } from 'semantic-ui-react';

class Paused extends React.Component {
  state = { visible: true };

  handleDismiss = (_e) => {
    this.setState({ visible: false });
    const pausedClosed = new CustomEvent('pausedClosed');
    dispatchEvent(pausedClosed);
  };

  render() {
    return (
      <Container id="pausedmsg" fluid textAlign="center">
        {this.props.isPaused && (
          <Message
            negative
            onDismiss={this.handleDismiss}
            hidden={!this.state.visible}
            style={{
              marginTop: this.props.headerHeight,
            }}
            attached="bottom"
          >
            <Message.Header>Crypto Byte is currently paused!</Message.Header>
            <p>No transactions can be made at the moment.</p>
          </Message>
        )}
      </Container>
    );
  }
}

export default Paused;
