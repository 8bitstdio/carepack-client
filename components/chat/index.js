import Composer from 'components/composer';

import styles from './chat.module.scss';

export default function Chat({ account }) {
    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <ul className={styles.updates}>
                    
                </ul>
                <Composer account={account} />
            </div>
        </div>
    );
}