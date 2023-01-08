import { useEffect, useRef, useState, useContext } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import NextImage from "next/image";
import isEmpty from "lodash/isEmpty";
import get from "lodash/get";
import { useS3Upload } from "next-s3-upload";
import { toast } from "react-toastify";
import { Tooltip } from "react-tippy";

import { ThemeContext } from "context/ThemeContext";

import Button from "components/button";
import AppLayout from "components/layout/AppLayout";
import ProfileTabs from "components/ProfileTabs";

import {
  truncate_address,
  getAccount,
  getSubscribed,
  getSubscribers,
  showSignMessage,
} from "/utils/helper";
import { getLocalURL } from "utils/urls";
import { appItems } from "utils/common";

import styles from "/styles/Profile.module.scss";
import Subscriber from "components/Subscriber";
import { getSubCount } from "utils/helper";

export default function Profile(props) {
  let { uploadToS3, files } = useS3Upload();
  const theme = useContext(ThemeContext);
  const coverInput = useRef(null);
  const profileInput = useRef(null);
  const { account, viewer, isSubscribed } = props;
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const { slug } = router.query;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    setIsUploading(false);
    setIsCoverUploading(false);
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
        <i className={`${styles.icon} material-symbols-outlined`}>edit</i>
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

  const renderCoverUploader = () => {
    return (
      <div className={styles.curtain} onClick={triggerUpload("cover")}>
        <i className={`${styles.icon} material-symbols-outlined`}>edit</i>
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

    if (e.target.files.length > 0) {
      if (type === "profile") {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
          let img = new Image();
          img.src = evt.target.result;
          img.onload = async function () {
            if (img.width >= 175 && img.height >= 175) {
              try {
                toast("Uploading Profile Photo", {
                  type: "info",
                });
                setIsUploading(true);
                console.log("file to upload", file);
                const { url } = await uploadToS3(file);
                const data = {
                  name: account.name,
                  username: account.username,
                  description: account.description,
                  website: account.website,
                  email: account.email,
                  photo: url,
                  cover: account.cover,
                  wallet: account.wallet,
                  id: account.id,
                };
                const response = await fetch(
                  `${getLocalURL()}/api/editAccount`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                  }
                );
                const { success } = await response.json();
                if (success) {
                  toast("Picture Updated", {
                    type: "success",
                  });
                  refreshData();
                }
              } catch (error) {
                alert(`Something went wrong. ${error}`);
              }
            } else {
              alert("Photo image must be 175 by 175 minimum");
            }
          };
        };
      } else if (type === "cover") {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (evt) {
          let img = new Image();
          img.src = evt.target.result;
          img.onload = async function () {
            if (img.width >= 1500 && img.height >= 500) {
              toast("Uploading Cover Photo", {
                type: "info",
              });
              setIsCoverUploading(true);
              const { url } = await uploadToS3(file);
              const data = {
                name: account.name,
                username: account.username,
                description: account.description,
                website: account.website,
                email: account.email,
                cover: url,
                photo: account.photo,
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
                toast("Cover Updated", {
                  type: "success",
                });
                refreshData();
              }
            } else {
              alert("Cover image must be 1500 by 500 minimum");
            }
          };
        };
      }
    }
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
      toast("Subscription added", {
        theme,
        type: "success",
      });
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
      toast("Subscription removed", {
        theme,
        type: "success",
      });
      refreshData();
    }
  };

  const renderFollowButton = () => {
    return isSubscribed ? (
      <li className={styles.action}>
        <Button onClick={unfollowUser} type="actioned">
          Unsubscribe
        </Button>
      </li>
    ) : (
      <li className={styles.action}>
        <Button onClick={followUser}>Subscribe 9.99 AED</Button>
      </li>
    );
  };

  const partnerUser = () => {
    toast(`Partner with ${account.username}`, {
      theme,
    });
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
      </>
    );
  };

  const copyWallet = () => {
    navigator.clipboard.writeText(account.wallet);
    toast("Wallet copied to clipboard", {
      type: "success",
      theme,
    });
  };

  const renderSubscribers = () =>
    account.subscribers.map((sub, index) => (
      <Subscriber sub={sub} key={index} />
    ));

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
        account={viewer}
        appUrl={account.username}
        appName="Account"
        subscribed={viewer.subscribed}
      >
        <div className={styles.profile}>
          <div className={styles.main}>
            <div className={styles.cover}>
              <div className={styles.cover_holder}>
                <div className={styles.avatar}>
                  {viewer.username === account.username &&
                    renderCoverUploader()}
                  {isCoverUploading && (
                    <div className={styles.loader}>
                      <i className={`${styles.icon} material-symbols-outlined`}>
                        rotate_right
                      </i>
                    </div>
                  )}
                  {account.cover && (
                    <NextImage
                      src={account.cover}
                      className={styles.photo}
                      layout="fill"
                      objectFit="cover"
                      alt="verified"
                    />
                  )}
                </div>
              </div>
            </div>
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
                        width={120}
                        height={120}
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
                              style={{
                                fontWeight: "bold",
                                fontSize: "15px",
                                color: "#FFFFFF",
                              }}
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
                  </div>
                  <div className={styles.community}>
                    <div className={styles.text}>
                      <span className={styles.number}>
                        {account.subscriberCount}
                      </span>
                      <span className={styles.label}>
                        {account.subscriberCount > 1
                          ? "Subscribers"
                          : "Subscriber"}
                      </span>
                    </div>
                  </div>
                  {account.description && (
                    <div className={styles.description}>
                      {account.description}
                    </div>
                  )}
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
                  <div className={styles.joined}>
                    <i className={`${styles.icon} material-symbols-outlined`}>
                      calendar_month
                    </i>
                    <span className={styles.text}>
                      Joined {formatDate(account.created_at)}
                    </span>
                  </div>
                  {account.website && (
                    <div className={styles.website}>
                      <Link
                        passHref
                        href={account.website}
                        className={styles.text}
                        target="_blank"
                      >
                        {account.website.replace("http://", "")}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <ProfileTabs slug={slug} account={account} />
          </div>
        </div>
      </AppLayout>
      <form style={{ display: "none" }}>
        <input
          type="file"
          onChange={handleUpload("profile")}
          ref={profileInput}
          accept="image/*"
        />
        <input
          type="file"
          onChange={handleUpload("cover")}
          ref={coverInput}
          accept="image/*"
        />
      </form>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const { username } = ctx.params;

  const result = await getAccount(ctx, true, true);

  const response = await fetch(`${getLocalURL()}/api/account`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username }),
  });
  const data = await response.json();
  const account = get(data, "data", {});

  if (isEmpty(account)) {
    return {
      notFound: true,
    };
  }

  const subscribersData = await getSubscribers(account);
  const subscribedData = await getSubscribed(account);
  const subCount = await getSubCount(account);

  const viewerSubscriberData = await getSubscribers(result?.props?.account);
  const viewerSubscribedData = await getSubscribed(result?.props?.account);

  const isSubscribed = subscribersData.data.some(
    (item) => item.id === result.props?.account.id
  );

  if (isEmpty(account)) {
    return {
      notFound: true,
    };
  }

  return {
    ...result,
    props: {
      account: {
        ...account,
        subscribers: subscribersData.data,
        subscribed: subscribedData.data,
        subscriberCount: subCount.data.sub_count,
      },
      viewer: {
        ...result?.props?.account,
        subscribers: viewerSubscriberData.data,
        subscribed: viewerSubscribedData.data,
      },
      isSubscribed,
    },
  };
}
