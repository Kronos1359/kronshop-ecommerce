import { Amplify } from "aws-amplify";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: "eu-north-1_t7JZOITVr",
            userPoolClientId: "2632d00djblsehn5blb3776jtl"
        }
    }
});