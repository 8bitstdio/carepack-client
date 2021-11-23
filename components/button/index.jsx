import Link from 'next/link';
import styles from './button.module.scss';

const Button = props => {
    const handleClick = (e) => {
        e.preventDefault();
        if (props.onClick) {
            props.onClick();
        }
    }
    return (
        <> {props.asLink ? (
            <Link 
                href={props.href?props.href:'/'}>
                    <a className={`${styles.button}`}
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
                className={`${styles.button}`}
                onClick={handleClick}>
                    {props.children}
            </button>
        )}
        </>
    );
}

export default Button;
