import { IrcService } from '../services/irc';
import { Channel } from './channel';

export interface Server {
    host: string,
    port: number,
    name: string,
    username: string,
    password?: string,
    channels?: Channel[],
    client?: IrcService
}


export class IrcServer implements Server {
    constructor(
        public readonly host: string,
        public readonly port: number,
        public readonly name: string,
        public readonly username: string,
        public readonly password?: string,
        public readonly channels?: Channel[],
        public readonly client?: IrcService
    ) { }

}

export const isConnected = (server: Server): boolean => {
    return server.client?.isConnected() === true;
};
