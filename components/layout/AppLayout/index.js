import { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import throttle from "lodash/throttle";
import isEmpty from "lodash/isEmpty";
import { useWeb3React } from "@web3-react/core";
import Dropdown from 'react-bootstrap/Dropdown';
import { ToastContainer, toast } from "react-toastify";
import { Tooltip } from "react-tippy";
import ReactTooltip from "react-tooltip";

import { showSignMessage } from "utils/helper";
import { getLocalURL } from "utils/urls";
import { setCookie } from "utils/cookies";
import { ThemeContext } from "context/ThemeContext";
import useShortcuts from "hooks/useShortcuts";
import useOutsideAlerter from "hooks/useOutsideAlerter";

import Logo from "components/Logo";

import "react-toastify/dist/ReactToastify.css";
import "react-tippy/dist/tippy.css";

import styles from "./AppLayout.module.scss";
import MenuFilter from "components/MenuFilter";

const AppLayout = (props) => {
  const router = useRouter();
  const [searchResult, setSearchResult] = useState([]);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const mobileSearchBoxRef = useRef(null);
  const {account, children} = props;

  const getUrl = () => {
    const url = router.pathname.split('/');
    return url.length > 1 ? `/${url[1]}` : '/';
  }

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

  const handleLogout = async (evt) => {
    evt.preventDefault();
    await fetch("/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });
    setCookie("wallet", "", -1);
    setCookie("cp_usign", "", -1);
    router.push("/settings");
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

    const mobileElem = mobileInputRef.current;
    if(document.activeElement === mobileElem) {
      mobileElem.blur();
      setMobileSearchVisible(false);
    }
  });

  useOutsideAlerter(searchBoxRef, () => {
    setSearchResultVisible(false);
  });

  useOutsideAlerter(mobileSearchBoxRef, () => {
    setSearchMobileResultVisible(false);
  });

  const handleSettingsClick = (evt) => {
    evt.preventDefault();
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
    showSignMessage(afterSign, signFailure)(evt);
  }

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
        setSearchMobileResultVisible(true);

        if (searchResult.length === 0) {
          setLoading(true);
        }
        // perform search.
        performSearch(value);
      } else {
        setSearchResultVisible(false);
        setSearchMobileResultVisible(false);
      }
    },
    500,
    { leading: false }
  );

  const menuItems = [{
    url: "/home",
    text: 'Home',
    icon: 'dashboard'
  }, {
    url: '/trending',
    text: 'Trending',
    icon: 'trending_up'
  }, {
    url: '/search',
    text: 'Search',
    icon: 'search'
  }, {
    url: '/messages',
    text: 'Messages',
    icon: 'inbox'
  }, {
    url: '/notifications',
    text: 'Notifications',
    icon: 'favorite'
  },{
    url: '/create',
    text: 'Publish',
    icon: 'add_circle'
  }]

  const moreMenuItems = [{
    url: `/${account.username}`,
    text: account.name,
    image: {
      url: account.photo,
      name: account.name
    },
    icon: 'inbox'
  },{
    url: '/settings',
    text: 'Settings',
    icon: 'settings',
    action: handleSettingsClick
  },{
    url: '/messages',
    text: 'Logout',
    action: handleLogout,
    icon: 'logout'
  }]

  return (
    <div className={styles.appLayout}>
      <div className={styles.sideMenu}>
        <div className={styles.container}>
          <div className={styles.menu}>
            <Link href="/">
              <a className={styles.logoLink}>
                <Logo
                  className={styles.logo}
                />
              </a>
            </Link>
            <MenuFilter items={menuItems} />
          </div>
          <div className={styles.account}>
            <MenuFilter items={moreMenuItems} />
          </div>
        </div>
      </div>
      <div className={styles.wrap}>
        <div className={styles.content}>
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
