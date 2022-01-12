import App from 'next/app';
import fetch from 'node-fetch';
import { Provider } from '@shopify/app-bridge-react';
import Copy from '../partials/copy';
import Guide from '../partials/guide';
import Support from '../partials/support';
import "../scss/main.scss";

class MyApp extends App {

  render() {

    const { Component, pageProps, host } = this.props;
    return (
      <Provider
        config={{
          apiKey: API_KEY,
          host: host
        }}
      >
        <Guide />
        <main>
          <Support />
          <Component {...pageProps} />
        </main>
        <Copy />
      </Provider>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  };
};

export default MyApp;
