const { NODE_ENV } = process.env;

export function getURL(isSecure = false) {
  const protocol = isSecure ? "https://" : "http://";
  return NODE_ENV === "production"
    ? `${protocol}api.carepack.io`
    : `${protocol}localhost:4000`;
}

export function getLocalURL(isSecure = false) {
  const protocol = isSecure ? "https://" : "http://";
  return NODE_ENV === "production"
    ? `${protocol}api.carepack.io`
    : `${protocol}localhost:3000`;
}
  

const apiURL = getURL();
export default apiURL;
