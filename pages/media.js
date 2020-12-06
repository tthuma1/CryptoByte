import React, { Component } from 'react';
import Layout from '../components/Layout';
import { Container, Header } from 'semantic-ui-react';
import Head from 'next/head';

let headerEl;

class Media extends Component {
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
          <Header as="h2" dividing inverted>
            How Crypto Byte Collectible tokens are made.
          </Header>

          <video
            height="450"
            controls
            style={{ marginBottom: '4vh', marginTop: '2vh' }}
          >
            <source src="/static/videos/film_crbc.mp4" type="video/mp4" />
          </video>

          <img
            src="/static/images/custom-design.jpg"
            height="400"
            style={{
              marginBottom: '4vh',
            }}
          />

          <br />

          <img src="/static/images/comic.jpg" height="700" />
        </Container>
      </Layout>
    );
  }
}

export default Media;
