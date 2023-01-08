import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import useShortcuts from "hooks/useShortcuts";

import LoginButton from "../LoginButton";

import styles from "./navbar.module.scss";
import Logo from "components/Logo";
import SearchBox from "components/SearchBox";

const NavBar = (props) => {
  const router = useRouter();
  const inputRef = useRef(null);

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

  const handleScroll = () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 0) {
      navbar.classList.add(styles.sticky);
    } else {
      navbar.classList.remove(styles.sticky);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const renderMenu = () => {
    const items = [
      {
        name: "Search",
        icon: "search",
        href: "/",
      },
      {
        name: "Home",
        icon: "public",
        href: "/home",
      },
    ];

    return items.map(({ name, icon, href }, index) => {
      const path = `/${router.pathname.split("/")[1]}`;
      return (
        <li
          key={index}
          className={
            index === 0 ? `${styles.item} ${styles.searchIcon}` : styles.item
          }
        >
          <Link
            href={href}
            className={
              path === href
                ? `${styles.link} ${styles.selected} material-symbols-outlined`
                : `${styles.link} material-symbols-outlined`
            }
            title={name}
          >
            {icon}
          </Link>
        </li>
      );
    });
  };

  const getMode = () =>
    props.mode === "full" ? `${styles.wrap} ${styles.full}` : styles.wrap;

  return (
    <div id="navbar" className={styles.main}>
      <div className={getMode()}>
        <Link passHref href="/" className={styles.logo_link}>
          <Logo className={styles.logo_img} />
        </Link>
        <div className={styles.search}>
          <SearchBox placeholder="Search Carepack" />
        </div>
        <ul role="navigation" className={styles.nav}>
          {renderMenu()}
          <li className={styles.item}>
            <LoginButton account={props.account} />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
