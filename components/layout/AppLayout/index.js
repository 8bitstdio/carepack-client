import Link from 'next/link';
import { useRouter } from 'next/router';
import { useWeb3React } from '@web3-react/core';
import { ToastContainer, toast } from 'react-toastify';

import Logo from 'assets/Logo';

import 'react-toastify/dist/ReactToastify.css';
import 'react-tippy/dist/tippy.css'

import styles from './AppLayout.module.scss';

const AppLayout = (props) => {
    const router = useRouter();
    const {deactivate} = useWeb3React();
    const {
        account,
        slug,
        appUrl,
        appName,
        children,
        menu,
        apps,
        showMessages,
        renderThreads,
    } = props;

    const arrayContains = (needle, haystack) => haystack[0] === needle[0];
    const getSlug = () => slug === undefined ? [appUrl] : [appUrl, ...slug];
    const cleanHref = href => href.split('/').splice(1, href.split('/').length);
    const checkSlug = (href, isExact=false) => isExact ? `/${href.split('/')[1]}/${slug}` === href : arrayContains(getSlug(), cleanHref(href));

    const renderApps = () => apps.map(({name, href, icon, action}, index) => {
        let onClick = () => {};
        if (icon === 'logout') {
            onClick = action(() => {
                deactivate();
                toast('Signed off successfully', {
                    type: 'success'
                });
                router.push('/');
            });
        }

        return (
        <li key={index} className={styles.appItem}>
            <Link href={name === 'account' ? `/${account?.username}` : href}>
                <a
                    className={
                        checkSlug(name === 'account' ? `/${account?.username}` : href) ?
                            `${styles.appLink} ${styles.selected}` :
                            `${styles.appLink}`
                    }
                    onClick={onClick}
                    title={name}>
                    <i className={`${styles.icon} material-symbols-outlined`}>
                        {icon}
                    </i>
                </a>
            </Link>
        </li>)
    });

    const renderMenu = () => menu.map(({name, href, icon}, index) => (
        <li key={index} className={styles.filterItem}>
            <Link href={href}>
                <a
                    className={
                        checkSlug(href, true) ?
                            `${styles.link} ${styles.selected}` :
                            `${styles.link}`
                    }
                    title={name}>
                    <i className={`${styles.icon} material-symbols-outlined`}>
                        {icon}
                    </i>
                    {name}
                </a>
            </Link>
        </li>
    ));

    return (
        <div className={styles.appLayout}>
            <div className={styles.wrap}>
                <div className={styles.appSideBar}>
                    <ul className={styles.appList}>
                        {renderApps()}
                    </ul>
                </div>
                <div className={styles.sidebar}>
                    <div className={styles.logo}>
                        <Logo className={styles.logo_img} color="#222222" />
                    </div>
                    <ul className={styles.filter}>
                        <li className={styles.title}>
                            <span className={styles.text}>{appName}</span>
                        </li>
                        {renderMenu()}
                    </ul>
                    {showMessages  && (<ul className={styles.filter}>
                        <li className={styles.title}>
                            <span className={styles.text}>Direct Messages</span>
                            <Link href="/messages/create">
                                <a className={styles.link}>
                                    <span className={`${styles.icon} material-symbols-outlined`}>
                                        add
                                    </span>
                                </a>
                            </Link>
                        </li>
                        {renderThreads && renderThreads()}
                    </ul>)}
                </div>
                <div className={styles.content}>
                    {children}
                </div>
            </div>
            <ToastContainer
                position='bottom-left'
                autoClose={2000}
                hideProgressBar={false}
                theme='dark'
            />
        </div>
    );
}

export default AppLayout;
