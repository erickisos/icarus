import { User } from './user';

export interface Message {
    content: string,
    sender: User,
    timestamp: Date,
}
