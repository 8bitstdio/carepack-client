import { isEmpty } from "lodash";
import NextAuth from "next-auth"
import TwitterProvider from 'next-auth/providers/twitter';

export const authOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      version: "2.0",
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days
  },
  session: {
    maxAge: 1000 * 60 * 60 * 24 * 60, // 60 days
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, user, account, profile, isNewUser}) {
      if (!isEmpty(account)) {
        if ( account.provider && !token[account.provider] ) {
          token[account.provider] = {}
        }
  
        if (account.provider &&account.access_token) {
          token[account.provider].access_token = account.access_token;
        }
  
        if (account.provider && account.refresh_token ) {
          token[account.provider].refresh_token = account.refresh_token; 
        }
      }

      return token
    },
  },
}

export default NextAuth(authOptions)
