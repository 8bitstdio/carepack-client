import Image from "next/image";
import Link from "next/link";
import styles from "./subscriber.module.scss";

const Subscriber = ({ sub, showUsername }) => (
  <Link passHref href={`/${sub.username}`} className={styles.subscriber}>
    <div className={styles.photo}>
      {sub.photo && (
        <Image
          src={sub.photo}
          width={40}
          height={40}
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
      {showUsername && (
        <div className={styles.username}>
          <span className={styles.text}>@{sub.username}</span>
        </div>
      )}
    </div>
  </Link>
);

export default Subscriber;
