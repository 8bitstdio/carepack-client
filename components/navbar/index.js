import {useEffect} from 'react';
import Link from "next/link";
import { useRouter } from "next/router";
import { useWeb3React } from "@web3-react/core";

import LoginButton from "../LoginButton";
import styles from "./navbar.module.scss";
import Logo from '../../assets/logo';
import Button from '../button';

const NavBar = (props) => {
  const { account } = useWeb3React();
  const router = useRouter();

  const handleScroll = () => {
    const navbar = document.getElementById("navbar");
    if (window.scrollY > 0) {
      navbar.classList.add(styles.sticky);
    } else {
      navbar.classList.remove(styles.sticky);
    }
  }

  useEffect(() =>{
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const renderMenu = () => {
    const items = [{
      name: 'Home',
      icon: 'dashboard',
      href: '/home',
    }, {
      name: 'Partners',
      icon: 'handshake',
      href: '/partners',
    }, {
      name: 'Explore',
      icon: 'explore',
      href: '/explore',
    }];

    return items.map(({name, icon, href}, index) => {
      return (
        <li key={index} className={styles.item}>
          <Link href={href}>
            <a
              className={
                router.pathname === href ? 
                `${styles.link} ${styles.selected} material-symbols-outlined` : 
                `${styles.link} material-symbols-outlined`}
                title={name}>
              {icon}
            </a>
          </Link>
        </li>
      )
    });
  }

  const getMode = () => {
    const {mode} = props;
    return mode === 'full' ? `${styles.wrap} ${styles.full}` : styles.wrap;
  }

  return (
    <div id="navbar" className={styles.main}>
      <div className={getMode()}>
        <Link href="/">
          <a className={styles.logo_link}>
            <Logo className={styles.logo_img} color="#1B212E" />
          </a>
        </Link>
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
