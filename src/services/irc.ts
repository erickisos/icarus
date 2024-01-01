import { IrcClient, ChannelData } from '@ctrl/irc';
import { Server } from '../types/server';

export class IrcService {
    private connection: IrcClient | undefined;

    constructor(server: Server, private onMessage: (message: string) => void) {
        const { host, port, username, password } = server;
        this.connection = new IrcClient(host, username, { port, password, autoRejoin: true });
        this.connection.connect(3);
        console.log('Conectando a ', server);
        this.connection.addListener('raw', (message) => {
            console.log(message);
        });
    }

    isConnected(): boolean {
        const channels: Record<string, ChannelData> | undefined = this.connection?.chans;
        console.log(channels);
        return channels !== undefined;
    }

    joinChannel(channel: string) {
        this.connection?.join(channel);
        this.connection?.on('message', (from, to, message) => {
            this.onMessage(message);
        });
    }

    leaveChannel(channel: string) {
        this.connection?.emit('part', channel, this.connection.nick, 'Leaving the channel', 'Bye');
    }

    disconnect() {
        this.connection?.removeAllListeners();
    }
}
