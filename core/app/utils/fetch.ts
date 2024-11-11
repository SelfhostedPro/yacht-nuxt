import { fetchEventSource, type FetchEventSourceInit } from '@microsoft/fetch-event-source'

// export const fetchRequest = async (path: string, options) => {

// }

export const fetchSSE = async (sseUrl: string, options?: FetchEventSourceInit) => {
    return fetchEventSource(sseUrl, {
        ...options
    })
}
