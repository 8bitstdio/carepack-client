import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core";
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

import Button from "../button";
import { injected } from "../../utils/injector";
import { getCookie, setCookie } from "../../utils/cookies";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";
import { showSignMessage } from "utils/helper";

import styles from "./LoginButton.module.scss";

const LoginButton = (props) => {
  const router = useRouter();
  const menuRef = useRef(null);

  const { activate, deactivate, account } = useWeb3React();
  const [connected, setConnected] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [login, setLogin] = useState(false);

  useOutsideAlerter(menuRef, () => {
    setMenuVisible(false);
  });

  async function connect(e) {
    e && e?.preventDefault();
    try {
      if (window.ethereum) {
        await activate(injected);
        setConnected(true);
        setLogin(true);
      } else {
        window.open("https://metamask.io/download.html");
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  async function disconnect(e) {
    e && e?.preventDefault();
    try {
      handleLogout(async () => {
        await deactivate();
        // push page to home
        router.reload();
      });
    } catch (ex) {
      console.log(ex);
    }
  }

  const handleLogin = async (wallet) => {
    setCookie("active_wallet", wallet, 100000);
    if (isEmpty(wallet)) return;
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet,
      }),
    });
    const data = await res.json();

    if (data.success) {
      setLogin(true);
      router.push(window.location.href);
    } else {
      setLogin(true);
      router.push("/signup/create");
    }
    setLogin(true);
  };

  const handleLogout = async (callback) => {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    setLogin(false);
    setCookie("wallet", "", -1);
    setCookie("cp_usign", "", -1);
    callback && callback();
  };

  useEffect(() => {
    const wallet = getCookie("wallet");
    if (wallet) {
      connect(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const wallet = getCookie("wallet");
    if (login && isEmpty(wallet)) {
      handleLogin(account);
    }
    window.ethereum.on("accountsChanged", (accounts) => {
      handleLogin(accounts[0]);
      router.reload();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, account, login]);

  const renderAccount = () => {
    return account?.photo ? (
      <span className={styles.icon}>
        <Image src={account?.photo} alt="account" width={40} height={40} />
      </span>
    ) : (
      <span className={`${styles.icon} material-symbols-outlined`}>
        account_circle
      </span>
    );
  };

  const afterSign = () => {
    router.push("/settings");
    setMenuVisible(false);
  };

  const signFailure = () => {
    setMenuVisible(false);
    toast("Request not signed. Sign to continue.", {
      type: "error",
      autoClose: 2000,
      position: "top-right",
    });
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  const renderMenu = () => {
    return (
      <div
        ref={menuRef}
        className={styles.userMenu}
        expanded={menuVisible ? "true" : "false"}
      >
        <div
          role="link"
          className={styles.avatar}
          onClick={() => setMenuVisible(!menuVisible)}
        >
          {renderAccount()}
        </div>
        {menuVisible && (
          <ul className={styles.menu}>
            <li className={styles.item}>
              <Link
                passHref
                href={`/${props.account.username}`}
                className={styles.link}
                onClick={closeMenu}
              >
                <span className="material-symbols-outlined">person</span>
                <span className={styles.text}>Profile</span>
              </Link>
            </li>
            <li className={styles.item}>
              <Link
                href={`/settings`}
                className={styles.link}
                onClick={showSignMessage(afterSign, signFailure)}
                passHref
              >
                <span className="material-symbols-outlined">settings</span>
                <span className={styles.text}>Settings</span>
              </Link>
            </li>
            <li className={styles.item}>
              <Link
                href="/"
                className={styles.link}
                onClick={disconnect}
                passHref
              >
                <span className="material-symbols-outlined">logout</span>
                <span className={styles.text}>Logout</span>
              </Link>
            </li>
          </ul>
        )}
      </div>
    );
  };

  const afterLogin = () => {
    return props.hasMenu || props.account ? (
      renderMenu()
    ) : (
      <Button asLink href="/" onClick={(evt) => evt.preventDefault()}>
        Connecting...
      </Button>
    );
  };

  return (
    <>
      {login || !isEmpty(props.account) ? (
        afterLogin()
      ) : (
        <Button href="/" asLink onClick={connect}>
          Connect
        </Button>
      )}
    </>
  );
};

export default LoginButton;
