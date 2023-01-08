import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import throttle from "lodash/throttle";
import isEmpty from "lodash/isEmpty";
import { ToastContainer, toast } from "react-toastify";

import { showSignMessage } from "utils/helper";
import { getLocalURL } from "utils/urls";
import { setCookie } from "utils/cookies";
import useShortcuts from "hooks/useShortcuts";
import useOutsideAlerter from "hooks/useOutsideAlerter";

import Logo from "components/Logo";

import "react-toastify/dist/ReactToastify.css";
import "react-tippy/dist/tippy.css";

import styles from "./AppLayout.module.scss";
import MenuFilter from "components/MenuFilter";

const AppLayout = (props) => {
  const router = useRouter();
  const [searchResultVisible, setSearchResultVisible] = useState(false);
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const mobileInputRef = useRef(null);
  const searchBoxRef = useRef(null);
  const { account, children } = props;

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
    if (document.activeElement === mobileElem) {
      mobileElem.blur();
      setMobileSearchVisible(false);
    }
  });

  useOutsideAlerter(searchBoxRef, () => {
    setSearchResultVisible(false);
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
  };

  const performSearch = async (query) => {
    const response = await fetch(
      `${getLocalURL()}/api/account/typeahead?query=${query}`
    );
    const { data } = await response.json();
    setSearchResult(data);
    setLoading(false);
  };

  const goToProfile = () => {
    setSearchResultVisible(!searchResultVisible);
    setSearchResult([]);
    inputRef.current.value = "";
  };

  const showResults = () => {
    return searchResult.map((item, index) => (
      <li key={index} className={styles.item}>
        <Link
          href={`/${item.username}`}
          className={styles.link}
          onClick={goToProfile}
          passHref
        >
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
        </Link>
      </li>
    ));
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

  const menuItems = [
    {
      url: "/search",
      text: "Search",
      icon: "search",
    },
    {
      url: "/home",
      text: "Home",
      icon: "home",
    },
    {
      url: "/podcasts",
      text: "Podcasts",
      icon: "podcasts",
    },
    {
      url: "/gaming",
      text: "Gaming",
      icon: "videogame_asset",
    },
    {
      url: "/sports",
      text: "Sports",
      icon: "sports_basketball",
    },
    {
      url: "/subscriptions",
      text: "Subscriptions",
      icon: "subscriptions",
    },
    {
      url: "/upload",
      text: "Upload",
      icon: "upload",
    },
  ];

  const moreMenuItems = [
    {
      url: `/${account.username}`,
      text: account.name,
      image: {
        url: account.photo,
        name: account.name,
      },
      icon: "inbox",
    },
    {
      url: "/settings",
      text: "Settings",
      icon: "settings",
      action: handleSettingsClick,
    },
    {
      url: "/logout",
      text: "Logout",
      action: handleLogout,
      icon: "logout",
    },
  ];

  const renderSidemenu = () => {
    return (
      <div className={styles.sideMenu}>
        <div className={styles.container}>
          <div className={styles.menu}>
            <Link href="/" passHref className={styles.logoLink}>
                <Logo className={styles.logo} />
            </Link>
            <MenuFilter items={menuItems} />
          </div>
          <div className={styles.account}>
            <MenuFilter items={moreMenuItems} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.appLayout}>
      <div className={styles.container}>
        <div className={styles.wrap}>
          {renderSidemenu()}
          <div className={styles.content}>{children}</div>
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
