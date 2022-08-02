import Image from "next/image";
import Link from "next/link";
import styles from "./subscriber.module.scss";

const Subscriber = ({ sub }) => (
  <Link href={`/${sub.username}`}>
    <a className={styles.subscriber}>
      <div className={styles.photo}>
        {sub.photo && (
          <Image
            src={sub.photo}
            width={50}
            height={50}
            className={styles.photo}
            layout="fixed"
            alt="verified"
          />
        )}
      </div>
      <div className={styles.details}>
        <div className={styles.name}>
          <span className={styles.text}>{sub.name}</span>
          {sub.isVerified && (
            <span className={styles.verified}>
              <Image
                src="/images/verify.png"
                width={16}
                height={16}
                className={styles.verified}
                layout="fixed"
                alt="Verified"
              />
            </span>
          )}
        </div>
        <div className={styles.username}>
          <span className={styles.text}>@{sub.username}</span>
        </div>
      </div>
    </a>
  </Link>
);

export default Subscriber;
