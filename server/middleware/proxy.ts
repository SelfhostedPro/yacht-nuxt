import { type ProxyOptions, getRequestURL, } from "h3"
interface ProxyRoutes {
    [url: string]: {
        protocol: string,
        host: string,
        websockets?: boolean
        options?: ProxyOptions
    }
}

const proxy_routes: ProxyRoutes = {
    "cockpit": {
        protocol: "http",
        host: "10.0.100.55:3000",
        websockets: true
    }
}

export default defineEventHandler(async (event) => {
    // Extends or modify the event
    const requestUrl = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true })
    const clientIP = getRequestIP(event)
    const headers = getProxyRequestHeaders(event)
    if (requestUrl.host in proxy_routes) {
        const { protocol, host } = proxy_routes[requestUrl.host]!
        console.log(`Proxying Request: ${requestUrl} => ${protocol}://${host}${requestUrl.pathname}`)
        return proxyRequest(event, `${protocol}://${host}${requestUrl.pathname}`, {
            fetchOptions: { ignoreResponseError: true },

            headers: {
                "X-Real-IP": clientIP,
                "X-Forwarded-For": clientIP,
                "X-Forwarded-Proto": protocol,
                "X-Forwarded-Host": requestUrl.host,
                "Connection": proxy_routes[requestUrl.host]!.websockets ? "upgrade" : undefined,
                ...headers
            }
        })
    }
})