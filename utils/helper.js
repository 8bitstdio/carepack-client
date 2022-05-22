import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import { server } from "/config";
import { getTokenCookie, removeWalletCookie } from './auth-cookies';

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
})

export const getAccount = async (ctx, isProtected=true, enabled=false) => {
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

  if(!enabled) {
    return {
      redirect : {
        destination : '/',
        permanent : true,
      }
    }
  }

  if (isEmpty(token) && isProtected) {
    removeWalletCookie(ctx.res);
    return {
      redirect : {
        destination : '/',
        permanent : true,
      }
    }
  }

  if (isEmpty(account) && isProtected) {
      return {
          redirect : {
              destination : '/signup/create',
              permanent : true,
          }
      }
  }

  return {
    props: {
      account,
    }
  };
}

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
}