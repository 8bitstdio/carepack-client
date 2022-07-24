import { useState, useEffect } from "react";
import { useWeb3React, Web3ReactProvider } from "@web3-react/core";
import Head from "next/head";
import { isEmpty } from "lodash";

import Web3 from "web3";

import useShortcuts from "hooks/useShortcuts";
import Layout from "../components/layout";
import NavBar from "components/navbar";
import HelpMenu from "components/HelpMenu";
import { INPUT, TEXTAREA } from "utils/constants";

import "react-tippy/dist/tippy.css";
import "../styles/globals.css";

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

  const getCurrentAccount = () =>
    isEmpty(pageProps.viewer) ? pageProps.account : pageProps.viewer;

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
        <Layout>
          <Component {...pageProps} {...props} />
          {helpMenuVisible && renderHelpMenu()}
        </Layout>
      </Web3ReactProvider>
    </>
  );
}

export default CarePack;
