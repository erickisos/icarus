import { IrcClient } from '@ctrl/irc';
import { IrcConnection } from '../types/irc';

export class IrcService {
    client: IrcClient;
    connection: IrcConnection;
    onMessageCallback: (channel: string, from: string, message: string) => void;

    constructor(connection: IrcConnection, onMessageCallback: (channel: string, from: string, message: string) => void) {
        this.connection = connection;
        this.client = new IrcClient(connection.server, connection.username, {
            port: connection.port,
            secure: true,
            channels: []
        });
        this.onMessageCallback = onMessageCallback;
    }

    joinChannel(channel: string) {
        if (!channel.startsWith('#')) {
            channel = `#${channel}`;
        }

        let channelCommand = channel;
        if (this.connection.password) {
            channelCommand = `${channel} ${this.connection.password}`;
        }
        this.client.join(channelCommand);
        this.client.addListener(`message${channel}`, (from: string, message: string) => {
            this.onMessageCallback(channel, from, message);
        });
    }

    getChannels() {
        return this.client.channellist;
    }

    leaveChannel(channel: string) {
        // TODO [EI]: Add the part command to leave a channel.
    }

    sendMessage(channel: string, message: string) {
        this.client.say(channel, message);
    }


}
