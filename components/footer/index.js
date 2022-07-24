import Link from 'next/link';

import styles from './footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.wrap}>
                <span className={styles.copyright}>
                    &copy; {new Date().getFullYear()} CarePack, Inc.
                </span>
                <ul>
                    <li>
                        <Link href="/">Home</Link>
                    </li>
                    <li>
                        <Link href="/terms">Terms</Link>
                    </li>
                    <li>
                        <Link href="/privacy">
                            Privacy
                        </Link>
                    </li>
                    <li>
                        <Link href="/about">About</Link>
                    </li>
                </ul>
                <span className={styles.madeIn}>
                    Made with <span className={styles.heart}>&hearts;</span> in Dubai
                </span>
            </div>
        </footer>
    );
}