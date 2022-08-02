import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import throttle from "lodash/throttle";
import isEmpty from "lodash/isEmpty";
import { useWeb3React } from "@web3-react/core";
import { ToastContainer, toast } from "react-toastify";

import { showSignMessage } from "utils/helper";
import { getLocalURL } from "utils/urls";
import { setCookie } from "utils/cookies";
import useShortcuts from "hooks/useShortcuts";
import useOutsideAlerter from "hooks/useOutsideAlerter";

import Logo from "assets/Logo";

import "react-toastify/dist/ReactToastify.css";
import "react-tippy/dist/tippy.css";

import styles from "./AppLayout.module.scss";
import LoginButton from "components/LoginButton";

const AppLayout = (props) => {
  const router = useRouter();
  const [searchResultVisible, setSearchResultVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const { deactivate } = useWeb3React();
  const { account, slug, appUrl, children, apps, hasBackButton, title } = props;
  const isLoggedIn = !isEmpty(account);

  const arrayContains = (needle, haystack) => haystack[0] === needle[0];
  const getSlug = () => (slug === undefined ? [appUrl] : [appUrl, ...slug]);
  const cleanHref = (href) => href.split("/").splice(1, href.split("/").length);
  const checkSlug = (href, isExact = false) => {
    return isExact
      ? `/${href.split("/")[1]}/${slug}` === href
      : arrayContains(getSlug(), cleanHref(href));
  };

  useShortcuts("/", () => {
    const elem = inputRef.current;
    if (
      document.activeElement !== elem &&
      document.activeElement.nodeName != "INPUT" &&
      document.activeElement.nodeName != "TEXTAREA"
    ) {
      elem.focus();
    }
  });

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    setCookie("wallet", "", -1);
    setCookie("cp_usign", "", -1);
  };

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
      router.reload();
    } else {
      handleLogout();
      router.reload();
    }
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", (accounts) => {
      handleLogin(accounts[0]);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      handleSearch.cancel();
    };
  }, []);

  useShortcuts("Escape", () => {
    const elem = inputRef.current;
    document.activeElement === elem && elem.blur();
  });

  useOutsideAlerter(searchBoxRef, () => {
    setSearchResultVisible(false);
  });

  const renderMenu = (items) =>
    items.map(({ name, href, icon, action }, index) => {
      let hasAction = false;
      let onClick = () => {};
      if (icon === "logout") {
        hasAction = true;
        onClick = action(() => {
          deactivate();
          toast("Signed off successfully", {
            type: "success",
          });
          router.reload();
        });
      }

      const afterSign = () => {
        router.push("/settings");
      };

      const signFailure = () => {
        toast("Signature request was not accepted.", {
          type: "error",
          autoClose: 2000,
          position: "top-right",
        });
      };

      if (icon === "settings") {
        hasAction = true;
        onClick = action(showSignMessage(afterSign, signFailure));
      }

      const url = name === "Profile" ? `/${account?.username}` : href;

      return (
        <li key={index} className={styles.appItem}>
          <Link href={name === "Profile" ? `/${account?.username}` : href}>
            <a
              className={
                checkSlug(url)
                  ? `${styles.appLink} ${styles.selected}`
                  : `${styles.appLink}`
              }
              onClick={hasAction ? onClick : action}
              title={name}
            >
              <i className={`${styles.icon} material-symbols-outlined`}>
                {icon}
              </i>
              <span className={styles.appName}>{name}</span>
            </a>
          </Link>
        </li>
      );
    });

  const performSearch = async (query) => {
    const response = await fetch(
      `${getLocalURL()}/api/account/typeahead?query=${query}`
    );
    const { data } = await response.json();
    setSearchResult(data);
    setLoading(false);
  };

  const handleSearch = throttle(
    async (e) => {
      const value = e.target.value;
      if (value.length > 0) {
        setSearchResultVisible(true);

        if (searchResult.length === 0) {
          setLoading(true);
        }
        // perform search.
        performSearch(value);
      } else {
        setSearchResultVisible(false);
      }
    },
    500,
    { leading: false }
  );

  const handleSearchFocus = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      setSearchResultVisible(true);
    }
  };

  const goToProfile = () => {
    setSearchResultVisible(!searchResultVisible);
    setSearchResult([]);
    inputRef.current.value = "";
  };

  const showResults = () => {
    return searchResult.map((item, index) => (
      <li key={index} className={styles.item}>
        <Link href={`/${item.username}`}>
          <a className={styles.link} onClick={goToProfile}>
            <div className={styles.image}>
              <Image
                src={item.photo}
                height="40"
                width="40"
                className={styles.photo}
                layout="fixed"
                alt="profile"
              />
            </div>
            <div className={styles.details}>
              <div className={styles.name}>{item.name}</div>
              {item.isVerified && (
                <div className={styles.verified}>
                  <Image
                    src="/images/verify.png"
                    height="16"
                    width="16"
                    className={styles.photo}
                    layout="fixed"
                    alt="profile"
                  />
                </div>
              )}
            </div>
          </a>
        </Link>
      </li>
    ));
  };

  return (
    <div className={styles.appLayout}>
      <div className={styles.wrap}>
        <div className={styles.sidebar}>
          <Link href="/">
            <a className={styles.logoLink}>
              <Logo className={styles.logo_img} color="#000" />
            </a>
          </Link>
          {!isLoggedIn && (
            <span className={styles.loginButton}>
              <LoginButton />
            </span>
          )}
          {isLoggedIn && <ul className={styles.appList}>{renderMenu(apps)}</ul>}
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <div className={styles.title}>
              {hasBackButton && (
                <i
                  className={`${styles.icon} material-symbols-outlined`}
                  onClick={() => router.back()}
                >
                  arrow_back
                </i>
              )}
              <h1>{title}</h1>
            </div>
            <div ref={searchBoxRef} className={styles.searchBox}>
              <input
                type="text"
                name="q"
                className={styles.input}
                placeholder="Search Carepack"
                autoComplete="off"
                onChange={handleSearch}
                onFocus={handleSearchFocus}
                ref={inputRef}
              />
              {searchResultVisible && (
                <ul className={styles.result}>
                  {showResults()}
                  {loading && (
                    <li className={styles.loading}>
                      <i className={`${styles.icon} material-symbols-outlined`}>
                        sync
                      </i>
                    </li>
                  )}
                </ul>
              )}
            </div>
          </div>
          {children}
        </div>
      </div>
      <ToastContainer
        position="bottom-left"
        autoClose={2000}
        hideProgressBar={false}
        theme="dark"
      />
    </div>
  );
};

export default AppLayout;
