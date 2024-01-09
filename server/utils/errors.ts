import { H3Error } from 'h3'

export const YachtError = (error: any, from?: string) => {
    if (error instanceof H3Error) {
        YachtLog(error.data, error)
    } else if (error.reason === "server error" && String(error.message).includes("failed: port is already allocated")) {
        YachtLog({ title: 'DockerError', level: 'error', message: error.message, from: from, vertical: true })
    }
    else {
        console.log('instanceof', typeof error)
        console.log('name', error.name)
        console.log('cause', error.cause)
        console.log('stack', error.stack)
        console.log('message', error.message)
        throw error
    }
}