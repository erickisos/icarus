import { OutputFileService } from '../services/file';
import { IrcTreeProvider } from './irc';

export interface Providers {
    tree: IrcTreeProvider,
    output: OutputFileService,
}
