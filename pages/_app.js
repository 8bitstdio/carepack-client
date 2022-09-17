import { useState, useEffect } from "react";
import { Web3ReactProvider } from "@web3-react/core";
import Head from "next/head";
import Script from "next/script";

import Web3 from "web3";

import useShortcuts from "hooks/useShortcuts";
import Layout from "../components/layout";
import HelpMenu from "components/HelpMenu";
import { INPUT, TEXTAREA } from "utils/constants";

import "react-tippy/dist/tippy.css";
import 'bootstrap/dist/css/bootstrap.min.css';

import "../styles/globals.css";
import ThemeProvider from "context/ThemeContext";

function getLibrary(provider) {
  return new Web3(provider);
}

function CarePack({ Component, pageProps, props }) {
  const [helpMenuVisible, setHelpMenuVisible] = useState(false);
  useShortcuts("?", () => {
    const node = document.activeElement.nodeName;
    if (node !== INPUT && node !== TEXTAREA) {
      setHelpMenuVisible(!helpMenuVisible);
    }
  });

  useShortcuts("Escape", () => {
    if (helpMenuVisible === true) {
      setHelpMenuVisible(false);
    }
  });

  const hideHelpMenu = () => {
    setHelpMenuVisible(false);
  };

  const renderHelpMenu = () => {
    return <HelpMenu onCurtainClick={hideHelpMenu} />;
  };

  return (
    <>
      <Head>
        <title>CarePack: Social Partnerships</title>
        <meta name="description" content="Carepack is Partnership platform" />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="stylesheet"
          href="https://fonts.sandbox.google.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </Head>
      <Web3ReactProvider getLibrary={getLibrary}>
        <ThemeProvider>
          <Layout>
            <Component {...pageProps} {...props} />
            {helpMenuVisible && renderHelpMenu()}
          </Layout>
        </ThemeProvider>
      </Web3ReactProvider>
    </>
  );
}

export default CarePack;
