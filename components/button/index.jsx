import Link from "next/link";
import styles from "./button.module.scss";

const Button = (props) => {
  const handleClick = (e) => {
    props.onClick && props.onClick(e);
  };

  const isNegative = () => {
    return props.isNegative ? ` ${styles.negative}` : "";
  };

  const getType = () => {
    return props.type ? ` ${styles[props.type]}` : "";
  };

  const getStyle = () => {
    return props.className ? ` ${props.className}` : "";
  };

  return props.asLink ? (
    <Link
      href={props.href ? props.href : "/"}
      className={`${styles.button}${isNegative()}${getType()}${getStyle()}`}
      onClick={handleClick}
      id={props.id}
      passHref
    >
      {props.children}
    </Link>
  ) : (
    <button
      disabled={props.disabled}
      id={props.id}
      type="submit"
      className={`${styles.button}${isNegative()}${getType()}${getStyle()}`}
      onClick={handleClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
