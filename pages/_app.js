import { Web3ReactProvider} from '@web3-react/core'
import Head from 'next/head'

import Web3 from 'web3'
import Layout from '../components/layout'

import '../styles/globals.css'

function getLibrary(provider) {
  return new Web3(provider)
}

function MyApp({ Component, pageProps, props }) {
  return (
    <>
      <Head>
        <link rel="stylesheet" href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Layout>
          <Component {...pageProps} {...props} />
        </Layout>
      </Web3ReactProvider>
    </>
  );
}

export default MyApp
