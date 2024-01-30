import { getServer } from "../servers"
import { type Container, type ExecCreateOptions } from "dockerode"
import { PassThrough as StreamPassThrough } from "stream"


export const streamContainerStdout = async (server: string, id: string, send: (callback: (id: number) => any) => void, close: () => void, error: (message: string) => void, reqId: string) => {
    const _server = await getServer(server)
    // const _containerStream: StreamPassThrough = new StreamPassThrough()
    const _commandStream = new StreamPassThrough()
    if (!_server) throw createError('Server not found')
    // get the container
    const container: Container = _server.getContainer(id);
    // form container command to get shell
    const cmd: ExecCreateOptions = {
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: true,
        Tty: true,
        Cmd: ['/bin/bash'],
    };
    // Send the command to the container
    container.exec(cmd, (err, exec) => {
        if (err) {
            YachtError(err, '/services/containers/terminal - streamContainerStdout', true, 'Docker Terminal')
            error(err.message || 'Unable to create exec!')
            close()
        }
        const options = {
            Tty: true,
            follow: true,
            stream: true,
            stdin: true,
            stdout: true,
            stderr: true,
            hijack: true,
        };
        exec?.start(options, (err, stream) => {
            if (!stream) throw createError('Unable to create stream!')

            // Have container output sent back to client via SSE
            stream?.on('data', (chunk: Buffer) => {
                send(() => ({ id: reqId, data: chunk.toString('utf8') }))
            })

            // Have commands sent from command stream sent to container
            _commandStream.on('data', (chunk: Buffer) => {
                stream.write(chunk)
            })

            // If the container stream closes, close the command stream
            stream?.on('close', (...props: any) => {
                // Change this to append the ID and then add a selector to the client to close the correct stream
                send(() => ({ id: reqId, data: `Container Stream Closed: ${JSON.stringify(props)}` }))
                close()
                _commandStream.destroy()
                console.log('Container Stream Closed', props)
            })
            _commandStream?.on('close', (...props: any) => {
                send(() => `Command Stream Closed: ${JSON.stringify(props)}`)
                close()
                stream.destroy()
                console.log('Command Stream Closed', props)
            })
        })
    })
    return {
        stream: _commandStream
    }
}