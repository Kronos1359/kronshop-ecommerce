import { UserManager } from "oidc-client-ts";

const cognitoAuthConfig = {
    authority: "https://cognito-idp.eu-north-1.amazonaws.com/eu-north-1_t7JZOITVr",
    client_id: "2632d00djblsehn5blb3776jtl",
    redirect_uri: "http://localhost:5173/",
    response_type: "code",
    scope: "phone openid email"
};

export const userManager = new UserManager(cognitoAuthConfig);

export const login = () => {
    return userManager.signinRedirect();
};

export const handleLoginCallback = () => {
    return userManager.signinCallback();
};

export const logout = () => {
    return userManager.signoutRedirect();
};

export const getUser = () => {
    return userManager.getUser();
};