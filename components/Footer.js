import { Component } from 'react';
import { Icon, Grid, Container } from 'semantic-ui-react';
import { Media, MediaContextProvider } from './Media';

class Footer extends Component {
  state = {
    contractAddr:
      window.location.pathname.search('/ERC20') == 0 // if true, we are at ERC20 section of page
        ? process.env.ADDRESS_20 // if we are at ERC20 section of page, display ERC20 contract address in footer
        : process.env.ADDRESS_721, // otherwise display ERC721 contract address
  };

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
                  href={`https://etherscan.io/token/${this.state.contractAddr}`}
                  target="_blank"
                >
                  {this.state.contractAddr}
                </a>
              </Grid.Column>
              <Grid.Column textAlign="left">
                Contact us:{' '}
                <a href="mailto:info@crypto-byte.com">info@crypto-byte.com</a>
              </Grid.Column>
            </Grid.Row>

            <Grid.Row style={{ fontSize: '23px' }}>
              <Grid.Column textAlign="center">
                <a href="https://www.reddit.com/r/crypto_byte/" target="_blank">
                  <Icon name="reddit" size="big" style={{ color: '#ccc' }} />
                </a>

                <a href="https://twitter.com/crypto_byte721" target="_blank">
                  <Icon
                    name="twitter square"
                    size="big"
                    style={{ color: '#ccc', margin: '0px 30px' }}
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
                href={`https://etherscan.io/token/${this.state.contractAddr}`}
                target="_blank"
              >
                {this.state.contractAddr}
              </a>
            </Grid.Column>
            <Grid.Column>
              Contact us:{' '}
              <a href="mailto:info@crypto-byte.com">info@crypto-byte.com</a>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <Grid
          //centered
          style={{
            backgroundColor: 'rgba(255,255,255,.05)',
            color: 'white',
            fontSize: '23px',
          }}
          columns={5}
        >
          <Grid.Row style={{ paddingBottom: '5px' }}>
            {/* empy column for better positioning */}
            <Grid.Column width={2}></Grid.Column>
            <Grid.Column width={4}>
              <a href="https://www.reddit.com/r/crypto_byte/" target="_blank">
                <Icon name="reddit" size="big" style={{ color: '#ccc' }} />
              </a>
            </Grid.Column>
            <Grid.Column width={4}>
              <a href="https://twitter.com/crypto_byte721" target="_blank">
                <Icon
                  name="twitter square"
                  size="big"
                  style={{ color: '#ccc' }}
                />
              </a>
            </Grid.Column>
            <Grid.Column width={4}>
              <a href="https://t.me/Crypto_ByteERC721" target="_blank">
                <Icon name="telegram" size="big" style={{ color: '#ccc' }} />
              </a>
            </Grid.Column>
            {/* empy column for better positioning */}
            <Grid.Column width={2}></Grid.Column>
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
