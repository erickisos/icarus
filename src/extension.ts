
import { ExtensionContext, window, commands } from 'vscode';
import { icarusCommands } from './commands';
import { Providers } from './providers';
import { ServersTreeProvider } from './providers/irc';

export function activate(context: ExtensionContext) {
	const providers: Providers = {
		servers: new ServersTreeProvider(context.globalState?.get('servers') || [])
	};
	context.subscriptions.push(window.registerTreeDataProvider('ircServers', providers.servers));
	icarusCommands.forEach(({ command, callback }) => {
		context.subscriptions.push(
			commands.registerCommand(command, () => callback(context, providers))
		);
	});

	window.createOutputChannel('Icarus - Welcome', { log: true });
}

export function deactivate() {
	// TODO [EI]: Add the graceful disconnection from IRC servers.

}
