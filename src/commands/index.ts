import { ExtensionContext } from 'vscode';
import { connectToServer, disconnectFromServer } from './irc';
import { Providers } from '../providers';

interface Command {
    command: string;
    callback: (context: ExtensionContext) => Promise<void>;
}

export const icarusCommands = [
    { command: 'icarus.connect', callback: connectToServer },
    { command: 'icarus.openPanel', callback: (context: ExtensionContext, providers: Providers) => console.log('Icarus - Open Icarus') },
    { command: 'icarus.disconnect', callback: disconnectFromServer }
];
