import { useEffect, useState } from "react";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { isEmpty } from "lodash";

import AppLayout from "components/layout/AppLayout";

import apiURL, { getLocalURL } from "/utils/urls";
import twitter from "utils/twitter";
import { getAccount } from "/utils/helper";
import { appItems } from "utils/common";
import { getSubscribers, getSubscribed, getTimeOfDay } from "utils/helper";

import styles from "/styles/explore.module.scss";

export default function ExplorePage(props) {
  const { account } = props;
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Home - CarePack</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AppLayout
        apps={appItems}
        account={account}
        title="Home"
        subscribed={account.subscribed}
      >
        <div className={styles.explore}>
          
        </div>
      </AppLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const accountData = await getAccount(ctx, true, true);
  const { data: users } = await fetch(`${apiURL}/api/users`).then((res) =>
    res.json()
  );

  const { client } = await twitter(ctx.req);
  let twitterResults = {};
  const subscribers = await getSubscribers(accountData?.props?.account);
  const subscribed = await getSubscribed(accountData?.props?.account);
  if (client) {
    try {
      const scope =
        "public_metrics,verified,description,id,withheld,created_at,username,profile_image_url,pinned_tweet_id,location,name,url";
      twitterResults = await client.get("users/me", {
        "user.fields": scope,
      });
    } catch (e) {
      console.log(e);
      return {
        ...accountData,
        props: {
          account: {
            ...accountData?.props?.account,
            subscribers: subscribers.data || [],
            subscribed: subscribed.data || [],
          },
          twitter: {
            isLoggedIn: false,
          },
          users,
        },
      };
    }
  }
  return {
    ...accountData,
    props: {
      account: {
        ...accountData?.props?.account,
        subscribers: subscribers.data || [],
        subscribed: subscribed.data || [],
      },
      twitter: {
        ...twitterResults?.data,
        isLoggedIn: !isEmpty(twitterResults?.data),
      },
      users,
    },
  };
}
