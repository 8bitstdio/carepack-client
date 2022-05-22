export const setCookie = (cname, cvalue, exdays) => {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export const getCookie = (cname) => {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

export const setSessionToken = data => {
    const MAX_AGE = 60 * 60 * 8;
    const obj = {...data, maxAge: MAX_AGE, createdAt: new Date()};
    const token = jwt.sign(obj, process.env.TOKEN_SECRET, {
        expiresIn: MAX_AGE,
    });
    setCookie(`session_${wallet}`, token, new Date(Date.now() + MAX_AGE * 1000));
}