import { H3Error } from 'h3'

export const YachtError = (error: any, from?: string, internal?: boolean, service?: string) => {
    if (error instanceof H3Error) {
        YachtLog(error.data, error)
        throw createError(error)
    } else if (error.reason === "server error" && String(error.message).includes("failed: port is already allocated")) {
        YachtLog({ title: 'Docker Error', level: 'error', message: error.message, from: from, vertical: true })
    }
    else if (error.code = 'ENOENT' && error.address == '/var/run/docker.sock') {
        YachtLog({ title: 'Docker Error', level: 'error', message: 'Docker is not running or the socket is not accessible!', from: from, dedupe: false })
    }
    else if (error.statusCode === 409) {
        YachtLog({ title: 'Docker Error', level: 'error', message: error.message, from: from, dedupe: false })
        throw createError(error)
    }
    else if (error.statusCode === 500) {
        YachtLog({ title: 'Docker Error', level: 'error', message: error.message, from: from, dedupe: false })
        throw createError(error)
    }
    else if (internal) {
        YachtLog({ title: `${service || 'Internal'} Error`, level: 'error', message: error.reason || error.message, from: from })
        throw createError(error)
    }
    else {
        console.log(JSON.stringify(error, null, 2))
        throw error
    }
}