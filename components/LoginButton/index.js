import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useWeb3React } from "@web3-react/core"
import isEmpty from "lodash/isEmpty";
import { useRouter } from "next/router";

import Button from "../button";
import { injected } from '../../utils/injector';
import { getCookie, setCookie } from "../../utils/cookies";
import useOutsideAlerter from "../../hooks/useOutsideAlerter";

import styles from './LoginButton.module.scss';

const LoginButton = (props) => {
    const router = useRouter();
    const menuRef = useRef(null);

    const { activate, deactivate, account } = useWeb3React();
    const [connected, setConnected] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const [login, setLogin] =  useState(false);

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
                window.open('https://metamask.io/download.html');
            }
        } catch (ex) {
            console.log(ex)
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
        if (isEmpty(wallet)) return;
        const res = await fetch('/api/auth', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wallet,
            })
        });
        const data = await res.json();

        if (data.success) {
            setCookie('wallet', wallet);
            setLogin(true);
        } else {
            setCookie('wallet', wallet);
            setLogin(true);
            router.push('/signup/create');
        }

        setCookie('wallet', wallet);
        setLogin(true);
    }

    const handleLogout = async (callback) => {
        await fetch('/api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });
        setLogin(false);
        setCookie('wallet', '', -1);
        callback && callback();
    }

    useEffect(() => {
        const wallet = getCookie('wallet');
        if (wallet) {
            connect(null);
        }
    }, []);

    useEffect(() => {
        const wallet = getCookie('wallet');
        if (login && isEmpty(wallet)) {
            handleLogin(account);
        }
    }, [connected, account, login])

    const renderAccount = () => {
        return account?.avatar ? (
            <span className={styles.icon}>
                <Image src={account?.avatar} alt='account' width={40} height={40} />
            </span>
        ) : (
            <span className={`${styles.icon} material-symbols-outlined`}>
                account_circle
            </span>
        );
    }

    const renderMenu = () => {
        return (
            <div ref={menuRef} className={styles.userMenu} expanded={true}>
                <div role="link" className={styles.avatar} onClick={() => setMenuVisible(!menuVisible)}>
                    {renderAccount()}
                </div>
                {menuVisible && <ul className={styles.menu}>
                    <li className={styles.item}>
                        <Link href={`/account`}>
                            <a className={styles.link}>
                                <span className="material-symbols-outlined">
                                    person
                                </span>
                                <span className={styles.text}>Profile</span>
                            </a>
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link href={`/account/wallet`}>
                            <a className={styles.link}>
                                <span className="material-symbols-outlined">
                                    account_balance_wallet
                                </span>
                                <span className={styles.text}>Wallet</span>
                            </a>
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link href={`/account/settings`}>
                            <a className={styles.link}>
                                <span className="material-symbols-outlined">
                                    settings
                                </span>
                                <span className={styles.text}>Settings</span>
                            </a>
                        </Link>
                    </li>
                    <li className={styles.item}>
                        <Link href='/'>
                            <a className={styles.link} onClick={disconnect}>
                                <span className="material-symbols-outlined">
                                    logout
                                </span>
                                <span className={styles.text}>Logout</span>
                            </a>
                        </Link>
                    </li>
                </ul>}
            </div>
        );
    }
    
    return (
        <>
            { (login || !isEmpty(props.account)) ?
                renderMenu() :
                <Button href="/" asLink onClick={connect}>Sign in</Button>
            }
        </>
    );
}

export default LoginButton;
