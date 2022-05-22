import styles from './field-box.module.scss';

const FieldBox = props => {
    const { children, error, touched } = props;
    const renderErrorComponent = () => (
        <div className={`${styles.fieldBox} ${styles.error}`}>
            {children}
            <span className={styles.error_message}>{error}</span>
        </div>
    );
    const renderComponent = () => {
        return (
            <div className={styles.fieldBox}>
                {children}
            </div>
        )
    }
    return touched && error ? renderErrorComponent() : renderComponent();
}



export default FieldBox;
