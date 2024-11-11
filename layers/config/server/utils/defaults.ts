import type { YachtConfig } from "#config/types";

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