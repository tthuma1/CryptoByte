import { Component } from 'react';
import { Icon, Grid, Container } from 'semantic-ui-react';
import { Media, MediaContextProvider } from './Media';

class Footer extends Component {
  render() {
    return (
      <MediaContextProvider>
        <Media greaterThan="tablet">
          <Grid
            style={{
              marginTop: '10vh',
              backgroundColor: 'rgba(255,255,255,.05)',
              color: 'white',
            }}
            stackable
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
                  <Icon
                    name="telegram"
                    size="big"
                    style={{ color: '#ccc', marginRight: '30px' }}
                  />
                </a>

                <a
                  href="https://github.com/CryptoByteCollectible/CryptoByte"
                  target="_blank"
                >
                  <Icon name="github" size="big" style={{ color: '#ccc' }} />
                </a>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row>
              <Grid.Column textAlign="center">
                <p style={{ color: '#ccc' }}>
                  This website does not collect any cookies.
                </p>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Media>
        <Media lessThan="computer">
          <MobileFooter />
        </Media>
      </MediaContextProvider>
    );
  }
}

// seperate version for mobile because else grid acts weird
class MobileFooter extends Component {
  render() {
    return (
      <div>
        <Grid
          as={Container}
          style={{
            marginTop: '10vh',
            backgroundColor: 'rgba(255,255,255,.05)',
            color: 'white',
          }}
          stackable
          textAlign="center"
        >
          <Grid.Row columns={2}>
            <Grid.Column
              style={{
                wordBreak: 'break-all',
              }}
            >
              <span>Contract address:</span>{' '}
              <a
                href={`https://etherscan.io/token/${process.env.ADDRESS_721}`}
                target="_blank"
              >
                {process.env.ADDRESS_721}
              </a>
            </Grid.Column>
            <Grid.Column>
              Contact us:{' '}
              <a href="mailto:info@crypto-byte.com">info@crypto-byte.com</a>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid
          centered
          style={{
            backgroundColor: 'rgba(255,255,255,.05)',
            color: 'white',
            fontSize: '23px',
          }}
          columns={4}
        >
          <Grid.Row style={{ paddingBottom: '5px' }}>
            <Grid.Column textAlign="right">
              <a href="https://www.reddit.com/r/crypto_byte/" target="_blank">
                <Icon name="reddit" size="big" style={{ color: '#ccc' }} />
              </a>
            </Grid.Column>

            <Grid.Column textAlign="left">
              <a href="https://twitter.com/crypto_byte721" target="_blank">
                <Icon
                  name="twitter square"
                  size="big"
                  style={{ color: '#ccc' }}
                />
              </a>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row style={{ paddingTop: '5px' }}>
            <Grid.Column textAlign="right">
              <a href="https://t.me/Crypto_ByteERC721" target="_blank">
                <Icon name="telegram" size="big" style={{ color: '#ccc' }} />
              </a>
            </Grid.Column>

            <Grid.Column textAlign="left">
              <a
                href="https://github.com/CryptoByteCollectible/CryptoByte"
                target="_blank"
              >
                <Icon name="github" size="big" style={{ color: '#ccc' }} />
              </a>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid style={{ backgroundColor: 'rgba(255,255,255,.05)' }}>
          <Grid.Column textAlign="center">
            <p style={{ color: '#ccc', marginBottom: '10px' }}>
              This website does not collect any cookies.
            </p>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default Footer;
