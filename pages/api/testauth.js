const auth = async (req, res) => {
    const MAX_AGE = 99 * 365 * 24 * 60 * 60;
    const cookie = serialize("token", token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        sameSite: "lax",
    });
    res.setHeader("Set-Cookie", cookie);
}

export default auth;