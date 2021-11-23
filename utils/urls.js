const {
    NODE_ENV,
} = process.env;

function getURL(isSecure=false){
    const protocol = isSecure? "https://": "http://";
    return NODE_ENV === "production"? `${protocol}api.carepack.io` : `${protocol}localhost:5001`;
}

const origin = getURL();

export const GET_USER_APPS = `${origin}/settings/account/app/`;
export const CREATE_APP = `${origin}/settings/account/app/create`;
export const APP_DETAILS = `${origin}/settings/account/app/details/`;
export const LOG_LIST = `${origin}/settings/account/app/logs/`;
export const LOG_DETAILS = `${origin}/settings/account/app/logdetails/`;
export const UPDATE_USER = `${origin}/settings/account/user/update`;
export const ADD_APP_USER = `${origin}/settings/account/app/addUser`;
export const GET_USER_DETAILS = `${origin}/settings/mock/users`;  //not being used anywhere
export const CREATE_SETUP_INTENT = `${origin}/payments/card-wallet`;
export const GET_BILLING_DETAILS = `${origin}/mock/billing`;
export const SAVED_CARDS = `${origin}/payments/list-payment-methods`;
export const REGISTER = `${origin}/register`;
export const LOGIN = `${origin}/login`;
export const RECOVERY_REQUEST = `${origin}/account/recovery/request`;
export const RESET_PASSWORD = `${origin}/account/recovery`;
export const VERIFY_EMAIL = `${origin}/account/verify`;
export const APP_SERVICES = `${origin}/service/`;
export const SERVICE_LOGS = `${origin}/settings/account/app/logs/`;
