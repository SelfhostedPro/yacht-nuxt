import type { Container, ExecCreateOptions } from "dockerode";
import { PassThrough as StreamPassThrough } from "stream";

export const streamContainerStdout = async (
    server: string, 
    id: string, 
    send: (callback: (id: number) => unknown) => void, 
    close: () => void, 
    error: (message: string) => void, 
    reqId: string
) => {
    const _server = await getServer(server);
    const _commandStream = new StreamPassThrough();
    
    if (!_server) throw createError('Server not found');
    
    const container: Container = _server.getContainer(id);
    const cmd: ExecCreateOptions = {
        AttachStdout: true,
        AttachStderr: true,
        AttachStdin: true,
        Tty: true,
        Cmd: ['/bin/bash'],
    };

    container.exec(cmd, (execErr, exec) => {
        if (execErr) {
            createError(execErr);
            error(execErr.message || 'Unable to create exec!');
            return close();
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

        exec?.start(options, (startErr, stream) => {
            if (startErr) {
                error(startErr.message || 'Stream start error');
                return close();
            }
            if (!stream) {
                error('Unable to create stream!');
                return close();
            }

            stream.on('data', (chunk: Buffer) => {
                send(() => ({ id: reqId, data: chunk.toString('utf8') }));
            });

            _commandStream.on('data', (chunk: Buffer) => {
                stream.write(chunk);
            });

            // Using proper types for stream events
            stream.on('close', () => {
                send(() => ({ id: reqId, data: 'Container Stream Closed' }));
                close();
                _commandStream.destroy();
                console.log('Container Stream Closed');
            });

            _commandStream.on('close', () => {
                send(() => 'Command Stream Closed');
                close();
                stream.destroy();
                console.log('Command Stream Closed');
            });
        });
    });

    return {
        stream: _commandStream
    };
};
