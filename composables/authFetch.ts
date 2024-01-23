// import { useAuthStore } from "~/stores/auth";
// import { useNotifyStore } from "~/stores/notifications";
// import { createFetch, useFetch } from "@vueuse/core";
// import { fetchEventSource, type FetchEventSourceInit } from '@microsoft/fetch-event-source'


// export const AuthFetch = createFetch({
//     options: {
//         async beforeFetch({ options, url }) {
//             const token = localStorage.getItem('auth-token')
//             if (token && url.startsWith('/api')) {
//                 options.headers['Authorization'] = `Bearer ${token}`
//             }
//             return { options }
//         },
//         async onFetchError(ctx) {
//             const authStore = useAuthStore()
//             const notify = useNotifyStore()
//             if (ctx.error.message === 'Failed to fetch') {
//                 notify.setError('Failed to fetch. Please check your connection and url and try again.')
//                 return ctx
//             }
//             switch (ctx.response.status) {
//                 case 401: {
//                     await authStore.refresh()
//                     const { data, response, error } = await useFetch(ctx.response.url).json()
//                     return { data: data.value, response: response.value, error: error.value }
//                 }
//                 case 409: {
//                     notify.setError(`Error 409: Conflict. ${ctx.data.message}`)
//                     break;
//                 }
//                 case 500: {
//                     notify.setError('Error 500: Internal Server Error. Please check the server logs for more information.');
//                     break;
//                 }
//                 default: {
//                     notify.setError(`Error ${ctx.response.status}: ${ctx.response.statusText}`);
//                     break;
//                 }
//             }
//             return ctx
//         },
//     }
// })

// export async function useFetchEventSource(url: string, options: FetchEventSourceInit) {
//     return fetchEventSource(url, {
//         async onopen(response) {
//             if (response.ok) {
//                 return
//             } else if (response.status === 401) {
//                 // const authStore = useAuthStore()
//                 // try {
//                 //     authStore.refresh()
//                 // } catch (e) {
//                 //     throw new Error(e)
//                 // }
//                 console.log(`${response.status}: ${response.statusText}`)
//             } else {
//                 console.log(`${response.status}: ${response.statusText}`)
//             }
//         },
//         ...options
//     })
// }