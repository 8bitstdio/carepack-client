import { setCookie } from "/utils/cookies";

const handleLogout = async (callback) => {
    await fetch('/api/logout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    });
    setCookie('wallet', '', -1);
    callback && callback();
}

export const appItems = [
{
    name: 'home',
    href: '/home',
    icon: 'dashboard',
},{
    name: '',
    href: '/partners',
    icon: 'handshake',
}, {
    name: 'explore',
    href: '/explore',
    icon: 'explore',
}, {
    name: 'account',
    href: '/account',
    icon: 'account_circle',
}, {
    name: 'settings',
    href: '/settings',
    icon: 'settings',
}, {
    name: 'logout',
    href: '/logout',
    icon: 'logout',
    action: (callback) => async (evt) => {
        evt.preventDefault();
        await handleLogout(callback);
    }
}];