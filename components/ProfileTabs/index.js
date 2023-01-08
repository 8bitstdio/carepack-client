import Link from "next/link";
import isEmpty from "lodash/isEmpty";

import Home from "components/ProfileTabs/tabs/home";
import Drops from "components/ProfileTabs/tabs/Drops";
import Partners from "components/Partners";
import Subscriber from "components/Subscriber";
import { profileTabs } from "utils/common";

import styles from "./profile_tabs.module.scss";

const ProfileTabs = ({ slug, account }) => {
  const renderSubscribers = () =>
    account.subscribers.map((sub, index) => (
      <Subscriber sub={sub} key={index} />
    ));

  const renderSubscribed = () =>
    account.subscribed.map((user, index) => (
      <Subscriber sub={user} key={index} />
    ));

  const renderDrops = () => {
    return <Drops />;
  };

  const renderHome = () => {
    return <Home />;
  };

  const renderPartners = () => {
    return <Partners />;
  };

  const renderContent = () => {
    const tab = getCurrentTab();
    switch (tab) {
      case "/":
        return renderHome();
      case "/drops":
        return renderDrops();
      case "/partners":
        return renderPartners();
      case "/subscribed":
        return renderSubscribed();
      case "/subscribers":
        return renderSubscribers();
      default:
        return renderDrops();
    }
  };

  const getCurrentTab = () => {
    if (isEmpty(slug)) {
      return "/";
    }
    return `/${slug[0]}`;
  };

  const renderTabs = () => {
    return profileTabs.map(({ name, href }, index) => (
      <li key={index} className={styles.item}>
        <Link
          href={`/${account.username}${href}`}
          className={`${styles.text}${
            getCurrentTab() === href ? " " + styles.selected : ""
          }`}
        >
          {name}
        </Link>
      </li>
    ));
  };

  return (
    <div className={styles.main}>
      <ul className={styles.navigation}>{renderTabs()}</ul>
      <div className={styles.content}>{renderContent()}</div>
    </div>
  );
};

export default ProfileTabs;
