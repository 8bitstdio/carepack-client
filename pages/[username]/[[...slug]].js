import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import NextImage from "next/image";
import { toast } from "react-toastify";
import { Tooltip } from "react-tippy";

import { useS3Upload } from "next-s3-upload";
import { get, isEmpty } from "lodash";

import Button from "components/button";
import AppLayout from "components/layout/AppLayout";
import Chat from "components/chat";
import Subscriber from "components/subscriber";
import Drops from "components/Drops";

import { truncate_address, getAccount } from "/utils/helper";
import { showSignMessage } from "utils/helper";
import { getLocalURL } from "utils/urls";
import { appItems, profileTabs } from "utils/common";

import styles from "/styles/Profile.module.scss";

export default function Profile(props) {
  let { uploadToS3, files } = useS3Upload();
  const coverInput = useRef(null);
  const profileInput = useRef(null);
  const { account, viewer, isSubscribed, followers, following } = props;
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const { slug } = router.query;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setIsUploading(false);
  }, [account, viewer]);

  const triggerUpload = (type) => (e) => {
    e.preventDefault();
    if (type === "cover") {
      coverInput.current.click();
    } else {
      profileInput.current.click();
    }
  };

  const renderPictureUploader = () => {
    return (
      <div className={styles.curtain} onClick={triggerUpload("profile")}>
        <i className={`${styles.icon} material-symbols-outlined`}>
          photo_camera
        </i>
        {files.map((file, index) => (
          <div key={index} className={styles.progress_holder}>
            <div
              className={styles.progress}
              style={{ width: `${file.progress}%` }}
            />
          </div>
        ))}
      </div>
    );
  };

  const handleUpload = (type) => async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    toast("Uploading Profile Picture", {
      type: "info",
    });

    if (type === "profile" && e.target.files.length > 0) {
      setIsUploading(true);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function (evt) {
        let img = new Image();
        img.src = evt.target.result;
        img.onload = async function () {
          if (img.width >= 175 && img.height >= 175) {
            const { url } = await uploadToS3(file);
            const data = {
              name: account.name,
              username: account.username,
              description: account.description,
              website: account.website,
              email: account.email,
              photo: url,
              wallet: account.wallet,
              id: account.id,
            };
            const response = await fetch(`${getLocalURL()}/api/editAccount`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            });
            const { success } = await response.json();
            if (success) {
              toast("Picture Updated", {
                type: "success",
              });
              refreshData();
            }
          }
        };
      };
    }
  };

  const currentTab = () => {
    if (isEmpty(slug)) {
      return "/";
    }
    return `/${slug[0]}`;
  };

  const renderTabs = () => {
    return profileTabs.map(({ name, href }, index) => (
      <li key={index} className={styles.item}>
        <Link href={`/${account.username}${href}`}>
          <a
            className={`${styles.text}${
              currentTab() === href ? " " + styles.selected : ""
            }`}
          >
            {name}
          </a>
        </Link>
      </li>
    ));
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = `${months[d.getMonth()]}`;
    const day = `0${d.getDate()}`.slice(-2);
    const year = d.getFullYear();
    return `${month} ${day}, ${year}`;
  };

  const isOwner = () => viewer.username === account.username;

  const renderChannels = () => {
    return <Chat account={viewer} />;
  };

  const followUser = async () => {
    const user_id = account.id;
    const subscriber_id = viewer.id;
    const response = await fetch(`${getLocalURL()}/api/account/follow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, subscriber_id }),
    });
    const { success } = await response.json();
    if (success) {
      refreshData();
    }
  };

  const unfollowUser = async () => {
    const user_id = account.id;
    const subscriber_id = viewer.id;
    const response = await fetch(`${getLocalURL()}/api/account/unfollow`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id, subscriber_id }),
    });
    const { success } = await response.json();
    if (success) {
      refreshData();
    }
  };

  const renderFollowButton = () => {
    return isSubscribed ? (
      <li className={styles.action}>
        <Button onClick={unfollowUser} type="default">
          Unfollow
        </Button>
      </li>
    ) : (
      <li className={styles.action}>
        <Button onClick={followUser}>Follow</Button>
      </li>
    );
  };

  const partnerUser = () => {
    alert(`Partner with ${account.username}`);
  };

  const onSuccess = () => {
    router.push("/settings");
  };

  const onFailure = () => {
    toast("Signature not signed", {
      type: "error",
    });
  };

  const renderActions = () => {
    const isLoggedIn = !isEmpty(props.viewer);
    return isOwner() ? (
      <li className={styles.action}>
        <Button
          asLink
          href="/settings"
          onClick={showSignMessage(onSuccess, onFailure)}
          type="white"
        >
          Edit Profile
        </Button>
      </li>
    ) : (
      <>
        {renderFollowButton()}
        {isLoggedIn && (
          <li className={styles.action}>
            <Button onClick={partnerUser} type="primary">
              Partner
            </Button>
          </li>
        )}
      </>
    );
  };

  const renderFollowers = () =>
    followers.map((sub, index) => <Subscriber sub={sub} key={index} />);

  const renderFollowing = () =>
    following.map((user, index) => <Subscriber sub={user} key={index} />);

  const renderDrops = () => {
    return <Drops />;
  };

  const renderContent = () => {
    const tab = currentTab();
    switch (tab) {
      case "/":
        return renderChannels();
      case "/drops":
        return renderDrops();
      case "/following":
        return renderFollowing();
      case "/followers":
        return renderFollowers();
      default:
        return renderChannels();
    }
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(account.wallet);
    toast("Wallet copied to clipboard", {
      type: "success",
      position: "top-right",
      theme: "light",
    });
  };

  return (
    <>
      <Head>
        <title>
          {account.name} (@{account.username}) - CarePack
        </title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout
        apps={appItems}
        account={viewer}
        title={account.name}
        hasBackButton
        appUrl={account.username}
        appName="Account"
      >
        <div className={styles.profile}>
          <div className={styles.main}>
            <div className={styles.header}>
              <div className={styles.details}>
                <div className={styles.avatar_holder}>
                  <div className={styles.avatar}>
                    {viewer.username === account.username &&
                      renderPictureUploader()}
                    {isUploading && (
                      <div className={styles.loader}>
                        <i
                          className={`${styles.icon} material-symbols-outlined`}
                        >
                          rotate_right
                        </i>
                      </div>
                    )}
                    {account.photo && (
                      <NextImage
                        src={account.photo}
                        width={175}
                        height={175}
                        className={styles.photo}
                        layout="fixed"
                        alt="verified"
                      />
                    )}
                  </div>
                </div>
                <div className={styles.user_info}>
                  <div className={styles.profileActions}>
                    <div className={styles.name}>
                      <h2 className={styles.text}>{account.name}</h2>
                      {account.isVerified && (
                        <Tooltip
                          html={
                            <span
                              style={{ fontWeight: "bold", fontSize: "15px" }}
                            >
                              Verified
                            </span>
                          }
                          position="right"
                          animation="fade"
                          theme="dark"
                        >
                          <NextImage
                            src="/images/verify.png"
                            width={20}
                            height={20}
                            className={styles.verified}
                            layout="fixed"
                            alt="Verified"
                          />
                        </Tooltip>
                      )}
                    </div>
                    <ul className={styles.actions}>{renderActions()}</ul>
                  </div>
                  <div className={styles.username}>
                    <span className={styles.text}>@{account.username}</span>
                    <span className={styles.joined}>
                      Joined {formatDate(account.created_at)}
                    </span>
                  </div>
                  <div className={styles.community}>
                    <Link href={`/${account.username}/partners`}>
                      <a className={styles.text}>
                        <span className={styles.number}>0</span>
                        <span className={styles.label}>Partners</span>
                      </a>
                    </Link>
                    <Link href={`/${account.username}/following`}>
                      <a className={styles.text}>
                        <span className={styles.number}>0</span>
                        <span className={styles.label}>Following</span>
                      </a>
                    </Link>
                    <Link href={`/${account.username}/followers`}>
                      <a className={styles.text}>
                        <span className={styles.number}>0</span>
                        <span className={styles.label}>Followers</span>
                      </a>
                    </Link>
                  </div>
                  <div className={styles.wallet}>
                    <Button type="plain" onClick={copyWallet}>
                      <i className={`${styles.icon} material-symbols-outlined`}>
                        account_balance_wallet
                      </i>
                      <span className={styles.text}>
                        {truncate_address(account.wallet)}
                      </span>
                    </Button>
                  </div>
                  {account.description && (
                    <div className={styles.description}>
                      {account.description}
                    </div>
                  )}
                  {account.website && (
                    <div className={styles.website}>
                      <Link href={account.website}>
                        <a className={styles.text} target="_blank">
                          {account.website.replace("http://", "")}
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ul className={styles.navigation}>{renderTabs()}</ul>
            <div className={styles.content}>{renderContent()}</div>
          </div>
          <div className={styles.rightCol}></div>
        </div>
      </AppLayout>
      <form style={{ display: "none" }}>
        <input
          type="file"
          onChange={handleUpload("profile")}
          ref={profileInput}
          accept="image/*"
        />
      </form>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { username } = ctx.params;

  const viewer = await getAccount(ctx, true, true);

  const response = await fetch(`${getLocalURL()}/api/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const data = await response.json();
  const account = get(data, "data", {});

  const getFollowers = async () => {
    const subs_r = await fetch(
      `${getLocalURL()}/api/account/followers?id=${account.id}&cursor=${0}`
    );
    return await subs_r.json();
  };

  const getFollowing = async () => {
    const result = await fetch(
      `${getLocalURL()}/api/account/following?id=${account.id}&cursor=${0}`
    );
    return await result.json();
  };

  const followersData = await getFollowers();
  const followingData = await getFollowing();

  const isSubscribed = followersData.data.some(
    (item) => item.id === viewer.props.account.id
  );

  if (isEmpty(account)) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      account,
      viewer: { ...viewer?.props?.account },
      isSubscribed,
      followers: followersData.data,
      following: followingData.data,
    },
  };
}
