import { Message } from './message';

export interface Channel {
    name: string;
    topic: string;
    users: Array<string>;
    messages: Array<Message>;
}
