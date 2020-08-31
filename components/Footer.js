import { Component } from 'react';
import { Icon, Grid } from 'semantic-ui-react';

class Footer extends Component {
  render() {
    return (
      <Grid
        columns={2}
        style={{
          marginTop: '10vh',
          backgroundColor: 'rgba(255,255,255,.05)',
          color: 'white',
        }}
      >
        <Grid.Row>
          <Grid.Column textAlign="right">
            <span>Contract address:</span>{' '}
            <a
              href={`https://etherscan.io/address/${process.env.ADDRESS_721}`}
              target="_blank"
            >
              {process.env.ADDRESS_721}
            </a>
          </Grid.Column>
          <Grid.Column textAlign="left">
            Contact us:{' '}
            <a href="mailto:info@crypto-byte.com">info@crypto-byte.com</a>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row style={{ fontSize: '23px' }}>
          <Grid.Column textAlign="right">
            <a href="https://www.reddit.com/r/crypto_byte/" target="_blank">
              <Icon name="reddit" size="big" style={{ color: '#ccc' }} />
            </a>
          </Grid.Column>
          <Grid.Column textAlign="left">
            <a href="https://t.me/Crypto_ByteERC721" target="_blank">
              <Icon name="telegram" size="big" style={{ color: '#ccc' }} />
            </a>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Footer;
