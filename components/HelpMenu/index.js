import { shortcutsMenu } from "utils/common";
import styles from "./style.module.scss";
export default function HelpMenu({ onCurtainClick }) {
  const renderMenuItems = () =>
    shortcutsMenu.map(({ name, value }, index) => (
      <li key={index} className={styles.command_list__item}>
        <span className={styles.label}>{name}</span>
        <span className={styles.value}>{value}</span>
      </li>
    ));

  const handleCurtainClick = (e) => {
    onCurtainClick && onCurtainClick(e);
  };
  return (
    <div className={styles.helpMenu}>
      <div className={styles.curtain} onClick={handleCurtainClick} />
      <div className={styles.pane}>
        <div className={styles.header}>
          <h1>Shortcuts</h1>
        </div>
        <div className={styles.content}>
          <ul className={styles.command_list}>{renderMenuItems()}</ul>
        </div>
      </div>
    </div>
  );
}
