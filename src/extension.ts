
import { IcarusSidebarProvider } from './views/IcarusSidebarProvider';
import { IrcConnection } from './types/irc';
import { passwordInputBox, portInputBox, serverInputBox, usernameInputBox } from './constants';
import { connectToServer, disconnectFromServer } from './commands/irc';
import { ExtensionContext, window, commands } from 'vscode';
import { icarusCommands } from './commands';
import { ServersTreeProvider } from './views/ServersTreeProvider';


const serversTreeProvider = new ServersTreeProvider([]);

export function activate(context: ExtensionContext) {
	const provider = new IcarusSidebarProvider(context.extensionUri);

	context.subscriptions.push(window.registerTreeDataProvider('ircServers', serversTreeProvider));
	context.subscriptions.push(
		window.registerWebviewViewProvider(IcarusSidebarProvider.viewType, provider));

	icarusCommands.forEach(({ command, callback }) => {
		context.subscriptions.push(
			commands.registerCommand(command, () => callback(context))
		);
	});

	window.createOutputChannel('Icarus - Welcome', { log: true });
}

export function deactivate() {
	// TODO [EI]: Add the graceful disconnection from IRC servers.
}
