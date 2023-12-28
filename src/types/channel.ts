import { Message } from './message';
import { Server } from './server';
import { User } from './user';

export interface Channel {
    name: string,
    users?: User[],
    messages?: Message[]
    parent: Server,
}
