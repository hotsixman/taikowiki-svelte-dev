import type { Handle } from "@sveltejs/kit";
import { sequence } from "@sveltejs/kit/hooks";
import auth, { providers } from '@sveltekit-board/oauth'
import UserController from "$lib/module/common/user/user-controller.server";

import { config } from 'dotenv';
import checkPermissions from "$lib/module/server/hooks/permissionCheck.server";
import BanController from "$lib/module/server/hooks/ban-controller.server";
import allowCors from "$lib/module/server/hooks/allow-cors";
//import logger from "$lib/module/server/hooks/logger.server";

config();

const provider = {
    github: new providers.Github({
        clientId: process.env.GITHUB_CLIENT_ID ?? "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ""
    }),
    kakao: new providers.Kakao({
        clientId: process.env.KAKAO_CLIENT_ID ?? "",
        clientSecret: process.env.KAKAO_CLIENT_SECRET ?? ""
    })
}

const authHandle = auth(Object.values(provider), {
    key: process.env.AUTH_KEY ?? '',
    maxAge: 3600 * 24 * 7,
    autoRefreshMaxAge: true
})

const getUserData: Handle = async ({ event, resolve }) => {
    if (event.locals.user) {
        event.locals.userBasicData = await UserController.getBasicData(event.locals.user.provider, event.locals.user.providerId);
        event.locals.userData = await UserController.getData(event.locals.user.provider, event.locals.user.providerId);
    }

    return await resolve(event);
}

const checkPermission = checkPermissions([
    {
        path: '/admin/api',
        level: 9,
        rule: 'startsWith',
    },
    {
        path: '/admin',
        level: 9,
        rule: 'startsWith',
        redirectPath: '/auth/login'
    }
])

const cors = allowCors(["https://donderhiroba.jp"]);

Array.prototype.toSorted = function (compareFn?: any) {
    return [...this].sort(compareFn);
}

export const handle = sequence(BanController.checkIpHandle, cors, authHandle, getUserData, checkPermission);