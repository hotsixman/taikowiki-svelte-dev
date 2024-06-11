import type { Handle } from "@sveltejs/kit";

export default function allowCors(allowedOrigins: string[]){
    const handle:Handle = async ({event, resolve}) => {
        console.log(event.url.origin, allowedOrigins.includes(event.url.origin), allowedOrigins)
        if(allowedOrigins.includes(event.url.origin)){
            event.request.headers.set("Access-Control-Allow-Origin", event.url.origin);
            event.request.headers.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        }

        return await resolve(event);
    }
    return handle;
}