import { Component } from 'react';
import { Icon, Grid } from 'semantic-ui-react';

class Footer extends Component {
  render() {
    return (
      <Grid
        style={{
          marginTop: '10vh',
          backgroundColor: 'rgba(255,255,255,.05)',
          color: 'white',
        }}
      >
        <Grid.Row columns={2}>
          <Grid.Column textAlign="right">
            <span>Contract address:</span>{' '}
            <a
              href={`https://etherscan.io/token/${process.env.ADDRESS_721}`}
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

        <Grid.Row columns={1} style={{ fontSize: '23px' }}>
          <Grid.Column textAlign="center">
            <a href="https://www.reddit.com/r/crypto_byte/" target="_blank">
              <Icon
                name="reddit"
                size="big"
                style={{ color: '#ccc', marginRight: '30px' }}
              />
            </a>

            <a href="https://twitter.com/crypto_byte721" target="_blank">
              <Icon
                name="twitter square"
                size="big"
                style={{ color: '#ccc', marginRight: '30px' }}
              />
            </a>

            <a href="https://t.me/Crypto_ByteERC721" target="_blank">
              <Icon name="telegram" size="big" style={{ color: '#ccc' }} />
            </a>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column textAlign="center">
            <p style={{ color: '#ccc' }}>
              This website does not use any third-party cookies.
            </p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Footer;
