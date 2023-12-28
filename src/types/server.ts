import { Channel } from './channel';

export interface Server {
    host: string,
    port: number,
    name: string,
    username: string,
    password?: string,
    channels?: Channel[],
    isConnected?: boolean,
}
