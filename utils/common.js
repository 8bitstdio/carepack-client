import { setCookie } from "/utils/cookies";
import { signMessage } from "./signature";

export const MAX_AGE = 99 * 365 * 24 * 60 * 60;

const handleLogout = async (callback) => {
  await fetch("/api/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
  setCookie("wallet", "", -1);
  callback && callback();
};

const AUTH_SIGNATURE_MESSAGE = `
    Welcome to Carepack.

    Click to sign in to your account and accept the CarePack Terms of Service.
    This will not trigger a blockchain transaction or cost any gas fees. 

    Your authentication will reset after 48 hours.
`;

export const appItems = [
  {
    name: "Explore",
    href: "/explore",
    icon: "explore",
  },
  {
    name: "Partnerships",
    href: "/partners",
    icon: "handshake",
  },
  {
    name: "Messages",
    href: "/inbox",
    icon: "inbox",
  },
  {
    name: "Notifications",
    href: "/notifications",
    icon: "notifications",
  },
  {
    name: "Profile",
    href: "/carepack",
    icon: "account_circle",
  },
  {
    name: "Settings",
    href: "/settings",
    icon: "settings",
    action: (callback) => async (evt) => {
      evt.preventDefault();
      callback && callback(evt);
    },
  },
  {
    name: "Logout",
    href: "/logout",
    icon: "logout",
    action: (callback) => async (evt) => {
      evt.preventDefault();
      await handleLogout(callback);
    },
  },
];

export const profileTabs = [
  {
    name: "Communities",
    href: "/",
  },
  {
    name: "Partners",
    href: "/partners",
  },
  {
    name: "NFTs",
    href: "/nfts",
  },
  {
    name: "Followers",
    href: "/followers",
  },
  {
    name: "Following",
    href: "/following",
  },
];

export const settingsMenu = [
  {
    name: "Profile",
    href: "/profile",
    icon: "account_circle",
  },
  {
    name: "Partners",
    href: "/partners",
    icon: "handshake",
  },
  {
    name: "Privacy",
    href: "/privacy",
    icon: "lock",
  },
];

export const shortcutsMenu = [
  {
    name: "Toggle This Menu",
    value: "?",
  },
  {
    name: "Close this menu",
    value: "Escape",
  },
  {
    name: "Search",
    value: "/",
  },
];
