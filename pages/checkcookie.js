import React from "react";
import Cookies from 'js-cookie';

export function getCookie(cook){
    const cookie = Cookies.get(cook);
    return cookie;
}

