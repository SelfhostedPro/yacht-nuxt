import { fetchEventSource, type FetchEventSourceInit } from '@microsoft/fetch-event-source'

export const useSse = async (sseUrl: string, options: FetchEventSourceInit) => {
  return await fetchEventSource(sseUrl, {
    ...options,
  })
}
