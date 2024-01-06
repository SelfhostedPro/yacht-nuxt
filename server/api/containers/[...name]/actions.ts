import Docker from 'dockerode'

const containerAction = async (id: string, action: string) => {
    const docker = new Docker()
    const container = docker.getContainer(id)

    const actions: { [key: string]: (res: (value: unknown) => void) => Promise<any> } = {
        start: async (res) => container.start(res),
        stop: async (res) => container.stop(res),
        pause: async (res) => container.pause(res),
        unpause: async (res) => container.unpause(res),
        kill: async (res) => container.kill(res),
        remove: async (res) => container.remove({ force: true }, res),
        restart: async (res) => container.restart(res),
      };

    if (action in actions) {
        try {
            await new Promise((res) => actions[action](res));
            console.log(`${action} performed on ${id}`)
            return `${action} performed on ${id}`
        } catch (e) {
            if (e) console.log(e)
        }
    } else {
        throw new Error('Error: Action not found.')
    }
}

export default containerAction