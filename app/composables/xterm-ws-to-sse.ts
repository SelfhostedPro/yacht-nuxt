/**
 * Copyright (c) 2014, 2019 The xterm.js authors. All rights reserved.
 * @license MIT
 *
 * Implements the attach method, that attaches the terminal to a Server Sent Events stream, uses POST request to talk back to the server.
 */

import type { Terminal, IDisposable, ITerminalAddon } from '@xterm/xterm';
import type { AttachAddon as IAttachApi } from '@xterm/addon-attach';

interface IAttachOptions {
  bidirectional?: boolean;
  send?: (data: ArrayBuffer | Uint8Array | string) => void;
  selector?: string | undefined;
}

export class AttachAddon implements ITerminalAddon, IAttachApi {
  private _socket: EventSource;
  private _bidirectional: boolean;
  private _disposables: IDisposable[] = [];
  private _send: (data: ArrayBuffer | Uint8Array | string) => void;
  private _selector: string | undefined

  constructor(socket: EventSource, options?: IAttachOptions) {
    this._socket = socket;
    this._bidirectional = !(options && options.bidirectional === false);
    this._send = options && options.send || (() => { });
    this._selector = options && options.selector || undefined;
  }


  public activate(terminal: Terminal): void {
    let messageQueue: (string | ArrayBuffer)[] = [];
    let messageQueueTimeout: NodeJS.Timeout | undefined;

    // Create function to write to terminal and clear queue
    const throttledFunc = () => {
      for (const data of messageQueue) {
        if (data) terminal.write(typeof data === 'string' ? data : new Uint8Array(data));
      }
      messageQueue = [];
      if (messageQueueTimeout !== undefined) clearTimeout(messageQueueTimeout);
    }

    this._disposables.push(
      addSocketListener(this._socket, 'message',
        (ev) => {
          const parsedData: ArrayBuffer | string = this._selector ? JSON.parse(ev.data)[this._selector] : JSON.parse(ev.data);
          messageQueue.push(parsedData);
          messageQueueTimeout = setInterval(throttledFunc, 10) // Increase interval to reduce function calls
        })
    );

    if (this._bidirectional) {
      this._disposables.push(terminal.onData((data: any) => this._sendData(data)));
      this._disposables.push(terminal.onBinary((data: any) => this._sendBinary(data)));
    }

    this._disposables.push(addSocketListener(this._socket, 'error', () => this.dispose()));
  }

  public dispose(): void {
    for (const d of this._disposables) {
      d.dispose();
    }
  }

  private _sendData(data: string): void {
    if (!this._checkOpenSocket()) {
      return;
    }
    this._send(data);
  }

  private _sendBinary(data: string): void {
    if (!this._checkOpenSocket()) {
      return;
    }
    const buffer = new Uint8Array(data.length);
    for (let i = 0; i < data.length; ++i) {
      buffer[i] = data.charCodeAt(i) & 255;
    }
    this._send(buffer);
  }

  private _checkOpenSocket(): boolean {
    switch (this._socket.readyState) {
      case EventSource.OPEN:
        return true;
      case EventSource.CONNECTING:
        throw new Error('Attach addon was loaded before socket was open');
      case EventSource.CLOSED:
        throw new Error('Attach addon socket is closed');
      default:
        throw new Error('Unexpected socket state');
    }
  }
}

function addSocketListener<K extends keyof EventSourceEventMap>(socket: EventSource, type: K, handler: (this: EventSource, ev: EventSourceEventMap[K]) => any): IDisposable {
  socket.addEventListener(type, handler);
  return {
    dispose: () => {
      if (!handler) {
        // Already disposed
        return;
      }
      socket.removeEventListener(type, handler);
    }
  };
}