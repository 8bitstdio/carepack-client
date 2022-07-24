import isEmpty from "lodash/isEmpty";

import { getWalletCookie } from "../../utils/auth-cookies";
import { getLoginSession, setLoginSession } from "../../utils/auth-token";
import apiURL from "../../utils/urls";

const getUser = async (req, res) => {
  const session = getLoginSession(req);
  const wallet = getWalletCookie(req);
  const walletLower = wallet?.toLowerCase();
  // fetch user from database.
  if (!session?.address) {
    if (!isEmpty(wallet)) {
      // renew session
      const response = await fetch(
        `${apiURL}/api/users/wallet/${walletLower}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { data } = await response.json();
      if (data?.wallet) {
        const sess = {
          user_id: data?.id,
          username: data?.username,
          address: walletLower,
        };
        setLoginSession(res, sess, walletLower);
        res.json({
          message: "session restored",
          ...data,
          success: true,
        });
      } else {
        res.statusCode = 200;
        res.json({
          message: "Wallet doesn't exist.",
          success: false,
        });
      }
    } else {
      res.statusCode = 200;
      res.json({
        message: "Please login to continue",
        success: false,
        data: {},
      });
    }
  } else {
    const resp = await fetch(`${apiURL}/api/users/wallet/${walletLower}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await resp.json();
    res.statusCode = 200;
    res.json({
      ...data,
      success: true,
    });
  }
};

export default getUser;
