import Link from 'next/link';

import styles from './footer.module.scss';

export default function Footer() {
    return (
        <footer className={styles.footer}>
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
        </footer>
    );
}