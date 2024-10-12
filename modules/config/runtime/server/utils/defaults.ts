import type { YachtConfig } from "../../../types";

export const defaultYachtConfig: YachtConfig = {
    name: 'Yacht',
    servers: [{ name: 'local', options: { socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock' } }],
    auth: true,
    theme: {
        type: 'dark'
    },
    plugins: [],
    sessionTimeout: 60 * 60 * 24,
}

export const baseYachtConfig: Omit<YachtConfig, 'servers'> = {
    name: 'Yacht',
    // servers: [{ name: 'local', options: { socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock' } }],
    auth: true,
    theme: {
        type: 'dark'
    },
    plugins: [],
    sessionTimeout: 60 * 60 * 24,
}