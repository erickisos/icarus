import { ExtensionContext } from 'vscode';
import { Providers } from '../providers';
import { addServer, connectServer, disconnectServer, editServer, removeServer } from './irc';

export interface Command {
    name: string,
    callback: (context: ExtensionContext, providers: Providers, e: any) => Promise<void>
}


export const icarusCommands: Command[] = [
    {
        name: 'icarus.addServer', callback: addServer
    },
    {
        name: 'icarus.editServer', callback: editServer
    },
    {
        name: 'icarus.removeServer', callback: removeServer
    },
    {
        name: 'icarus.connectServer', callback: connectServer
    },
    {
        name: 'icarus.disconnectServer', callback: disconnectServer
    }
];
