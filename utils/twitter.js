import { getSession } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import Twitter from 'twitter-lite';
import { isEmpty } from "lodash";

const twitter = async (req) => {
    const session = await getSession({req});
    const token = await getToken({
        req,
        secret: process.env.NEXTAUTH_SECRET
    });
    if (isEmpty(token) || isEmpty(session)) {
        return {client: null, token: null, session: null};
    }
    const client = new Twitter({
        version: "2",
        extension: false,
        consumer_key: process.env.TWITTER_CLIENT_ID, // from Twitter.
        consumer_secret: process.env.TWITTER_CLIENT_SECRET, // from Twitter.
        access_token_key: token.twitter.access_token, // from your User (oauth_token)
        access_token_secret: token.twitter.refresh_token, // from your User (oauth_token_secret)
        bearer_token: token.twitter.access_token,
    });

    return {
        session,
        token,
        client,
    };
}

export default twitter;