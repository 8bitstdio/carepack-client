import { useEffect } from "react";
import isEmpty from "lodash/isEmpty";
import Router from "next/router";
import useSWR from "swr";

const fetcher = (url) =>
  fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((r) => r.json())
    .then((data) => ({
      user: data,
    }));

export function useUser(options) {
  const { redirectTo, redirectIfFound } = options;
  const { data, error } = useSWR("/api/me", fetcher);
  const user = data?.user;
  const finished = Boolean(data);
  const hasUser = Boolean(user);

  useEffect(() => {
    if (!redirectTo || !finished) return;
    if (
      (redirectTo && !redirectIfFound && !hasUser) ||
      (redirectIfFound && hasUser)
    ) {
      Router.push(redirectTo);
    }
  });

  return error ? [null, finished] : [user, finished];
}

