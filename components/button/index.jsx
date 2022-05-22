import Link from 'next/link';
import styles from './button.module.scss';

const Button = props => {
    const handleClick = (e) => {
        if (props.onClick) {
            props.onClick(e);
        }
    }

    const isNegative = () => {
        return props.isNegative ? ` ${styles.negative}` : '';
    }

    const getType = () => {
        return props.type ? ` ${styles[props.type]}` : '';
    }

    return (
        <> {props.asLink ? (
            <Link 
                href={props.href?props.href:'/'}>
                    <a className={`${styles.button}${isNegative()}${getType()}`}
                        onClick={handleClick}
                        id={props.id}
                    >
                        {props.children}
                    </a>
            </Link>
        ): (
            <button
                disabled={props.disabled}
                id={props.id}
                type="submit"
                className={`${styles.button}${isNegative()}${getType()}`}
                onClick={handleClick}>
                    {props.children}
            </button>
        )}
        </>
    );
}

export default Button;
