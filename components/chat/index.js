import Composer from "components/composer";

import styles from "./chat.module.scss";

export default function Chat({ account }) {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h4>Subscriber Chat</h4>
        </div>
        <ul className={styles.updates}></ul>
        <Composer account={account} />
      </div>
    </div>
  );
}

