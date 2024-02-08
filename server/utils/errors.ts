import { H3Error } from 'h3'
const logDockerError = (title: string, message: string, from?: string) => {
    YachtLog({ title: title, level: 'error', message: message, from: from, dedupe: false });
};
export const YachtError = (error: any, from?: string, internal?: boolean, service?: string) => {
    let isDockerError = false;

    if (error instanceof H3Error) {
        YachtLog(error.data, error);
        throw createError(error);
    } else if (error.reason === "server error" && String(error.message).includes("failed: port is already allocated")) {
        logDockerError('Docker Error', error.message, from);
        isDockerError = true;
    } else if (error.code === 'ENOENT' && error.address === '/var/run/docker.sock') {
        logDockerError('Docker Error', 'Docker is not running or the socket is not accessible!', from);
        isDockerError = true;
    } else if ([409, 500].includes(error.statusCode)) {
        logDockerError('Docker Error', error.message, from);
        isDockerError = true;
    }

    if (isDockerError) {
        throw createError(error);
    } else if (internal) {
        YachtLog({ title: `${service || 'Internal'} Error`, level: 'error', message: error.reason || error.message, from: from });
        throw createError(error);
    } else {
        console.log(JSON.stringify(error, null, 2));
        throw error;
    }
};