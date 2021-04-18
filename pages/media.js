import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Container, Header, Image } from 'semantic-ui-react';
import Head from 'next/head';
import { Media, MediaContextProvider } from '../components/Media';

let headerEl;

class MediaPage extends Component {
  state = {
    mounted: false,
    headerHeight: 0,
  };

  async componentDidMount() {
    headerEl = document.getElementById('header');

    const headerVisible = setInterval(() => {
      if (headerEl.style.visibility === 'visible') {
        this.setState({
          headerHeight: headerEl.clientHeight,
        });
        clearInterval(headerVisible);
      }
    }, 100);

    this.setState({ mounted: true });
  }

  render() {
    return (
      <Layout mounted={this.state.mounted}>
        <Head>
          <title>Crypto Byte Collectible - Media</title>
          <meta
            name="description"
            content="Media related to Crypto Byte Collectible tokens."
          />
          <meta name="robots" content="index, follow" />
        </Head>

        <Container
          textAlign="center"
          style={{
            marginTop: this.state.headerHeight + 20,
            color: 'rgba(255,255,255,.9)',
          }}
        >
          <Image
            src="/static/images/custom-design.jpg"
            size="medium"
            centered
            style={{
              marginBottom: '4vh',
              marginTop: '2vh',
            }}
          />

          <Header as="h2" inverted>
            How Crypto Byte Collectible tokens are made.
          </Header>

          <MediaContextProvider>
            <Media greaterThan="tablet">
              <video height="450" controls style={{ marginBottom: '4vh' }}>
                <source src="/static/videos/film_crbc.mp4" type="video/mp4" />
              </video>

              <video height="450" controls style={{ marginBottom: '4vh' }}>
                <source
                  src="/static/videos/GIF_viking_final.mp4"
                  type="video/mp4"
                />
              </video>
            </Media>

            <Media lessThan="computer">
              <video width="100%" controls style={{ marginBottom: '4vh' }}>
                <source src="/static/videos/film_crbc.mp4" type="video/mp4" />
              </video>

              <video width="100%" controls style={{ marginBottom: '4vh' }}>
                <source
                  src="/static/videos/GIF_viking_final.mp4"
                  type="video/mp4"
                />
              </video>
            </Media>
          </MediaContextProvider>

          <Image src="/static/images/comic.jpg" size="large" centered />
        </Container>
      </Layout>
    );
  }
}

export default MediaPage;
