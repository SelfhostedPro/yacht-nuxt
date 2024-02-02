import { type YachtConfig } from "~/types/config";

export const defaultConfig: YachtConfig = {
    base: {
      name: 'Yacht',
      servers: [
        {
          name: 'local',
          options: {
            socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock',
          },
        },
      ],
      auth: true,
      theme: {
        type: 'dark',
      },
      plugins: [],
      sessionTimeout: 3600,
    },
};

export const configPaths = {
    config: process.env.CONFIG_FILE || 'config.yml',
    secrets: process.env.SECRETS_FILE || '.secrets.json',
    ssh: process.env.SSH_PATH || '.ssh/',
    backups: {
      config: process.env.BACKUP_CONFIG_PATH || 'backups/config',
      instance: process.env.BACKUP_INSTANCE_PATH || 'backups/instance'
    },
    templates: process.env.TEMPLATE_PATH || 'templates/'
  }