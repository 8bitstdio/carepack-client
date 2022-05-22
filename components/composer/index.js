import styles from './composer.module.scss'
const Composer = () => {
    return (
        <div className={styles.main}>
            <div className={styles.content}>
                <div className={styles.image}></div>
                <div className={styles.input}></div>
            </div>
        </div>
    );
}