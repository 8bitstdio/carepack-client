import Link from 'next/link'
import { Button } from 'react-bootstrap';

import styles from 'styles/error.module.scss';

export default function FourOhFour() {
  return <div className={styles.error}>
    <h1 className={styles.title}>404</h1>
    <h5 className={styles.subtitle}>
       {`We couldn't navigate to the page you were looking for. We tried everything!! It Seems like it either was moved or the page no longer exists. Sorry.`}
    </h5>
    <Button type="primary" as="a" href="/">Go Back Home</Button>
  </div>
}
