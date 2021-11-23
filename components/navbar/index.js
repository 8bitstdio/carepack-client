import Link from 'next/link';

import Logo from '../../assets/logo';
import LoginButton from '../LoginButton';

import styles from './navbar.module.scss';

const NavBar = (props) => {
    return (
        <div className={styles.main}>
            <div className={styles.wrap}>
                <Link href='/' className={styles.logo_link}>
                    <Logo
                        color='#212121'
                        height='40px'
                        width='130px'
                    />
                </Link>
                <ul role='navigation' className={styles.nav}>
                    <li>
                        <Link href="/explore">
                            Explore
                        </Link>
                    </li>
                    <li>
                        <Link href="/partnerships">
                            Partnerships
                        </Link>
                    </li>
                    <li>
                        <Link href="/payments">
                            Payments
                        </Link>
                    </li>
                    <li>
                        <Link href="/account">
                            Settings
                        </Link>
                    </li>
                    <li>
                        <LoginButton
                            {...props}
                        />
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default NavBar;
