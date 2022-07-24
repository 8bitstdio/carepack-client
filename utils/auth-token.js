import jwt from "jsonwebtoken";
import { getTokenCookie, MAX_AGE, setTokenCookie } from "./auth-cookies";

export const setLoginSession = (res, session, wallet) => {
  const createdAt = new Date();

  const obj = { ...session, iss: "Carepack", createdAt, maxAge: MAX_AGE };
  const token = jwt.sign(obj, process.env.TOKEN_SECRET, {
    expiresIn: MAX_AGE,
  });
  setTokenCookie(res, token, wallet);
};

export const renewLoginSession = async (res, wallet) => {
  const result = getLoginSession(res, wallet);
  if (!result) return;
  if (result === "invalid token") {
    res.clearCookie("token");
    res.clearCookie("wallet");
    return;
  } else {
    res.clearCookie("token");
    setLoginSession(res, result, wallet);
  }
};

export const getLoginSession = (req) => {
  const token = getTokenCookie(req);
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
    return decoded;
  } catch (e) {
    return e && "invalid token";
  }
};
