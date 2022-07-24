import { removeCookies } from "../../utils/auth-cookies";
import { getLoginSession } from "../../utils/auth-token";

const logout = async (req, res) => {
  try {
    const session = await getLoginSession(req);
    if (session) {
      removeCookies(res);
      res.statusCode = 200;
      res.json({
        success: true,
        message: "logged out",
      });
    }
  } catch (e) {
    console.log(e);
  }

  res.end();
};

export default logout;
