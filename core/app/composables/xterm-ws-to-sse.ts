/**
 * Copyright (c) 2014, 2019 The xterm.js authors. All rights reserved.
 * @license MIT
 *
 * Implements the attach method, that attaches the terminal to a Server Sent Events stream, uses POST request to talk back to the server.
 */
// app/composables/xterm-ws-to-sse.ts (update the AttachAddon class)
import type { Terminal, ITerminalAddon } from '@xterm/xterm';

interface IAttachOptions {
  bidirectional?: boolean;
  send?: (data: ArrayBuffer | Uint8Array | string) => void;
  selector?: string;
}

interface IAttachApi {
  activate: (terminal: Terminal) => void;
  dispose: () => void;
}

export class AttachAddon implements ITerminalAddon, IAttachApi {
  private readonly _socket: EventSource;
  private readonly _bidirectional: boolean;
  private readonly _disposables: { dispose: () => void }[] = [];
  private readonly _send: (data: ArrayBuffer | Uint8Array | string) => void;
  private readonly _selector: string | undefined;

  constructor(socket: EventSource, options?: IAttachOptions) {
    this._socket = socket;
    this._bidirectional = (options && options.bidirectional !== undefined) ? options.bidirectional : true;
    this._send = (options && options.send) ? options.send : (() => {});
    this._selector = options?.selector;
  }

  public activate(terminal: Terminal): void {
    if (this._bidirectional) {
      this._disposables.push(
        terminal.onData(data => this._sendData(data))
      );
      this._disposables.push(
        terminal.onBinary(data => this._sendBinary(data))
      );
    }

    this._socket.addEventListener('message', (ev) => {
      try {
        const data = JSON.parse(ev.data);
        if (this._selector && data[this._selector]) {
          terminal.write(data[this._selector]);
        } else {
          terminal.write(ev.data);
        }
      } catch (error) {
        console.error('Failed to process message:', error);
        terminal.write(ev.data);
      }
    });
  }

  public dispose(): void {
    this._disposables.forEach(d => d.dispose());
  }

  private _sendData(data: string): void {
    if (this._checkOpenSocket()) {
      this._send(data);
    }
  }

  private _sendBinary(data: string): void {
    if (this._checkOpenSocket()) {
      this._send(data);
    }
  }

  private _checkOpenSocket(): boolean {
    if (this._socket.readyState !== EventSource.OPEN) {
      console.warn('Attempt to write to closed or connecting socket');
      return false;
    }
    return true;
  }
}
