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
                    <Link href="/blog">Blog</Link>
                </li>
                <li>
                    <Link href="https://www.twitter.com/carepackio">
                        <a target='_blank'>Twitter</a>
                    </Link>
                </li>
                <li>
                    <Link href="/about">About</Link>
                </li>
            </ul>
        </footer>
    );
}