import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import isEmpty from "lodash/isEmpty";
import { useWeb3React } from "@web3-react/core";
import { ToastContainer, toast } from "react-toastify";

import { showSignMessage } from "utils/helper";
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
  const inputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const { deactivate } = useWeb3React();
  const { account, slug, appUrl, children, apps, hasBackButton, title } = props;
  const isLoggedIn = !isEmpty(account);

  const arrayContains = (needle, haystack) => haystack[0] === needle[0];
  const getSlug = () => (slug === undefined ? [appUrl] : [appUrl, ...slug]);
  const cleanHref = (href) => href.split("/").splice(1, href.split("/").length);
  const checkSlug = (href, isExact = false) =>
    isExact
      ? `/${href.split("/")[1]}/${slug}` === href
      : arrayContains(getSlug(), cleanHref(href));

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

  useShortcuts("Escape", () => {
    const elem = inputRef.current;
    document.activeElement === elem && elem.blur();
  });

  useOutsideAlerter(searchBoxRef, () => {
    setSearchResultVisible(false);
  });

  const renderApps = () =>
    apps.map(({ name, href, icon, action }, index) => {
      let hasAction = false;
      let onClick = () => {};
      if (icon === "logout") {
        hasAction = true;
        onClick = action(() => {
          deactivate();
          toast("Signed off successfully", {
            type: "success",
          });
          router.push("/");
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

      return (
        <li key={index} className={styles.appItem}>
          <Link href={name === "account" ? `/${account?.username}` : href}>
            <a
              className={
                checkSlug(href)
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

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      setSearchResultVisible(true);
    } else {
      setSearchResultVisible(false);
    }
  };

  const handleSearchFocus = (e) => {
    const value = e.target.value;
    if (value.length > 0) {
      setSearchResultVisible(true);
    }
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
          {isLoggedIn && <ul className={styles.appList}>{renderApps()}</ul>}
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
                <div className={styles.result}>Search Result</div>
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
