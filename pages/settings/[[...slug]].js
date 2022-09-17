import { useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { isEmpty } from "lodash";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { getAccount, getSubscribed, getSubscribers} from "utils/helper";
import { settingsMenu } from "utils/common";
import { ThemeContext } from "context/ThemeContext";
import Button from "components/button";
import { toast } from "react-toastify";
import { getLocalURL } from "utils/urls";
import { appItems } from "utils/common";
import AppLayout from "components/layout/AppLayout";

import styles from "/styles/Settings.module.scss";

export default function SettingsPage(props) {
  const { account } = props;
  const router = useRouter();
  const theme = useContext(ThemeContext);
  const { slug } = router.query;

  const getTab = () => {
    if (isEmpty(slug)) {
      return `/settings${settingsMenu[0].href}`;
    }
    return `/settings/${slug[0]}`;
  };

  const isSelected = (url) =>
    getTab() === `/settings${url}`
      ? `${styles.link} ${styles.selected}`
      : styles.link;

  const renderMenu = () =>
    settingsMenu.map((item, index) => (
      <li key={index} className={styles.item}>
        <Link href={`/settings${item.href}`}>
          <a className={isSelected(item.href)}>
            <div className={styles.holder}>
              <i className={`${styles.icon} material-symbols-outlined`}>
                {item.icon}
              </i>
              <span className={styles.text}>{item.name}</span>
            </div>
            <i className={`${styles.icon} material-symbols-outlined`}>
              chevron_right
            </i>
          </a>
        </Link>
      </li>
    ));

  const submitHandler = async (values) => {
    const response = await fetch(`${getLocalURL()}/api/editAccount`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: values.name,
        username: values.username,
        email: values.email,
        website: values.website,
        description: values.description,
        wallet: account.wallet,
        id: account.id,
        photo: account.photo,
        isPrivate: values.isPrivate,
      }),
    });
    const { success } = await response.json();
    if (success) {
      toast("Profile Updated", {
        type: "success",
        theme
      });
      router.push(`/${values.username}`);
    }
  };

  const renderProfileContent = () => {
    const copyWallet = () => {
      navigator.clipboard.writeText(account.wallet);
      toast("Wallet address copied", {
        type: "success",
        theme,
      });
    };
    return (
      <>
        <div className={styles.header}>
          <h1 className={styles.title}>Profile</h1>
        </div>
        <Formik
          initialValues={{
            name: account.name,
            email: account.email,
            username: account.username,
            description: account.description,
            website: account.website,
            isPrivate: account.isPrivate,
          }}
          onSubmit={submitHandler}
        >
          {({ handleSubmit, handleChange, values }) => (
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.input}>
                <label>Wallet</label>
                <div className={styles.value}>
                  <span className={styles.text}>{account.wallet}</span>
                  <i
                    onClick={copyWallet}
                    className={`${styles.icon} material-symbols-outlined`}
                  >
                    content_copy
                  </i>
                </div>
              </div>
              <div className={styles.input}>
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  onChange={handleChange}
                  value={values.name}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="email">Email</label>
                <input
                  type="text"
                  name="email"
                  id="email"
                  autoComplete="off"
                  onChange={handleChange}
                  value={values.email.replace(/\s/g, "")}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="off"
                  onChange={handleChange}
                  value={values.username.replace(/\s/g, "")}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="description">Description</label>
                <textarea
                  name="description"
                  id="description"
                  autoComplete="off"
                  onChange={handleChange}
                  value={values?.description}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  autoComplete="off"
                  name="website"
                  id="website"
                  onChange={handleChange}
                  value={values?.website?.replace(/\s/g, "")}
                />
              </div>
              <div className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="isPrivate"
                  id="isPrivate"
                  onChange={handleChange}
                  checked={values.isPrivate}
                />
                <label htmlFor="isPrivate">Private Account</label>
              </div>
              <Button className={styles.button} type="primary">
                Save
              </Button>
            </form>
          )}
        </Formik>
      </>
    );
  };

  const renderTabContent = () => {
    if (slug[0] === "profile") {
      return renderProfileContent();
    }
  };

  return (
    <>
      <Head>
        <title>
          CarePack: Partner and Transact with businesses securely on the
          Blockchain.
        </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout
        apps={appItems}
        account={account}
        hasBackButton
        title="Settings"
        appUrl="settings"
        appName="Settings"
        following={account.following}
      >
        <div className={styles.main}>
          <div className={styles.sideBar}>
            <h2 className={styles.header}>Settings</h2>
            <ul className={styles.menu}>{renderMenu()}</ul>
          </div>
          <div className={styles.content}>{renderTabContent()}</div>
        </div>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { slug } = ctx.query;
  const signature = ctx.req.cookies["cpsign"];

  if (isEmpty(signature)) {
    return {
      redirect: {
        destination: "/?error=signature",
        permanent: true,
      },
    };
  }

  if (isEmpty(slug)) {
    return {
      redirect: {
        destination: "/settings/profile",
        permanent: true,
      },
    };
  }

  const accountData = await getAccount(ctx, true, true);
  const subscribed = await getSubscribed(accountData.props.account);
  const subscribers = await getSubscribers(accountData.props.account);
  return {
    ...accountData,
    props: {
      ...accountData.props,
      account: {
        ...accountData.props.account,
        subscribed: subscribed.data,
        subscribers: subscribers.data,
      }
    },
  };
}
