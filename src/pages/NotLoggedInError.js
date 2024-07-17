import React from 'react';
import ErrorBoxWithLink from "./ErrorBoxWithLink.js";
const NotLoggedInError = () => {
    return (
    <ErrorBoxWithLink errorMessage="You are not logged in!" link="/login" linkText="Sign In" />
    )
}
export default NotLoggedInError;