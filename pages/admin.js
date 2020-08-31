import { Component } from 'react';
import Head from 'next/head';

class Admin extends Component {
  render() {
    return (
      <div>
        <Head>
          <meta name="robots" content="no index, no follow" />
        </Head>
        <p>Welcome to admin page.</p>{' '}
      </div>
    );
  }
}

export default Admin;
