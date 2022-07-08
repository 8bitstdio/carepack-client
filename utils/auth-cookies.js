import {parse, serialize} from 'cookie';

export const MAX_AGE = 99 * 365 * 24 * 60 * 60;

export const setTokenCookie = (res, token) => {
    const cookie = serialize('token', token, {
        maxAge: MAX_AGE,
        expires: new Date(Date.now() + MAX_AGE * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
    res.setHeader('Set-Cookie', `${cookie}`);
}

export const parseCookies = (req) => {
    if (req.cookies) return req.cookies;
    const cookies = req.headers?.cookie;
    return parse(cookies || '');
}

export const getTokenCookie = (req) => {
    const cookies = parseCookies(req);
    return cookies['token'];
}

export const getWalletCookie = (req) => {
    const cookies = parseCookies(req);
    return cookies['wallet'];
}

export const removeTokenCookie = (res) => {
    const cookie = serialize('token', '', {
        maxAge: -1,
        path: '/'
    });
    res.setHeader('Set-Cookie', cookie);
}

export const removeSessionCookie = (res) => {
    const cookie = serialize('cpsign', '', {
        maxAge: -1,
        path: '/'
    });
    res.setHeader('Set-Cookie', cookie);
}

export const removeCookies = (res) => {
    const token = serialize('token', '', {
        maxAge: -1,
        path: '/'
    });
    const session = serialize('cpsign', '', {
        maxAge: -1,
        path: '/'
    });
    const wallet = serialize('wallet', '', {
        maxAge: -1,
        path: '/'
    });
    res.setHeader('Set-Cookie', [token, session, wallet]);
}

export const removeWalletCookie = (res) => {
    const cookie = serialize('wallet', '', {
        maxAge: -1,
        path: '/'
    });
    res.setHeader('Set-Cookie', cookie);
}