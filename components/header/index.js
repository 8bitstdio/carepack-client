import styles from "./styles.module.scss";

const Header = ({title, icon}) => {
    return (
        <header className={styles.header}>
            <span className={styles.title}>
                <i className={styles.icon}>{icon}</i>
                {title}
            </span>
        </header>
    );
}

export default Header;