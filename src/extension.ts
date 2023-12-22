import { ExtensionContext, commands, window } from 'vscode';
import { icarusCommands } from './commands';
import { Providers } from './providers';
import { IrcServerTreeProvider } from './providers/irc';

export function activate(context: ExtensionContext) {
	const providers: Providers = {
		servers: new IrcServerTreeProvider(context.globalState?.get('ircServerConnections') || []),
	};

	context.subscriptions.push(
		window.registerTreeDataProvider('icarusServers', providers.servers)
	);

	icarusCommands.forEach(({ name, callback }) => {
		console.log('Registering command', name);
		context.subscriptions.push(commands.registerCommand(name, (e) => callback(context, providers, e)));
	});

	window.createOutputChannel('Icarus IRC', { log: true });
}

// This method is called when your extension is deactivated
export function deactivate() { }
