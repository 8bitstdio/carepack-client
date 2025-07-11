import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import jwt from "jsonwebtoken";
import { server } from "/config";
import { getLocalURL } from "utils/urls";
import { getTokenCookie, MAX_AGE, removeWalletCookie } from "./auth-cookies";
import { signMessage } from "./signature";
import { getCookie, setCookie } from "./cookies";

export const truncate_address = (str) => {
  if (!str) return;
  if (str.length > 16) {
    return str.substr(0, 6) + "..." + str.substr(str.length - 4, str.length);
  }
  return str;
};

export const fetchDefaultOptions = () => ({
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
});

export const showSignMessage = (cb, failure) => async (evt) => {
  evt.preventDefault();
  const AUTH_SIGNATURE_MESSAGE = `
      Welcome to Carepack.

      Click to sign in to your account and accept the CarePack Terms of Service.
      This will not trigger a blockchain transaction or cost any gas fees. 

      Your authentication will reset after 48 hours.
  `;
  if (!isEmpty(getCookie("cpsign"))) {
    cb && cb();
    return;
  }
  const response = await signMessage(AUTH_SIGNATURE_MESSAGE);

  if (isEmpty(response.error)) {
    const createdAt = new Date();
    const obj = { ...response, iss: "Carepack", createdAt, maxAge: MAX_AGE };
    const token = jwt.sign(obj, process.env.NEXT_PUBLIC_TOKEN_SECRET, {
      expiresIn: MAX_AGE,
    });
    setCookie("cpsign", token, {
      maxAge: 24 * 60 * 60 * 1000,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    });
    cb && cb();
  } else {
    failure && failure();
  }
};

export const getAccount = async (ctx, isProtected = true, enabled = false) => {
  const token = getTokenCookie(ctx.req);
  const res = await fetch(`${server}/api/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      cookie: ctx.req.headers.cookie,
    },
  });
  const data = await res.json();
  const account = get(data, "data", null);

  if (!enabled) {
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  if (isEmpty(token) && isProtected) {
    removeWalletCookie(ctx.res);
    return {
      redirect: {
        destination: "/",
        permanent: true,
      },
    };
  }

  if (isEmpty(account) && isProtected) {
    return {
      redirect: {
        destination: "/signup/create",
        permanent: true,
      },
    };
  }

  return {
    props: {
      account,
    },
  };
};

export const getTimeOfDay = () => {
  var today = new Date();
  var curHr = today.getHours();
  var time = null;

  if (curHr > 5 && curHr < 12) {
    var time = "Good Morning";
  } else if (curHr < 18) {
    var time = "Good Afternoon";
  } else if (curHr < 22) {
    var time = "Good Evening";
  } else {
    var time = "Goodnight";
  }

  return time;
};

export const getSubscribers = async (account, cursor = 0) => {
  if (isEmpty(account)) return [];
  const subs_r = await fetch(
    `${getLocalURL()}/api/account/subscribers?id=${account.id}&cursor=${cursor}`
  );
  return await subs_r.json();
};

export const getSubscribed = async (account, cursor = 0) => {
  if (isEmpty(account)) return [];
  const result = await fetch(
    `${getLocalURL()}/api/account/subscribed?id=${account.id}&cursor=${cursor}`
  );
  return await result.json();
};

export const getSubCount = async (account) => {
  const result = await fetch(
    `${getLocalURL()}/api/account/analytics?id=${account.id}`
  );
  return await result.json();
};

// print todays date in format: Day of the week, day, month.
export const getTodaysDate = () => {
  const date = new Date();
  const day = date.getDay();
  const dayOfMonth = date.getDate();
  const month = date.getMonth();

  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return `${days[day]} ${dayOfMonth} ${months[month]}`;
};
