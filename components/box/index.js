import styles from './box.module.scss';

const Box = props => (
    <div className={props.className ? `${styles.box} ${props.className}`: styles.box}>
        {props.children}
    </div>
);

export default Box;
