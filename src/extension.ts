import { ExtensionContext, commands, window, workspace } from 'vscode';
import { icarusCommands } from './commands';
import { Providers } from './providers';
import { IrcTreeProvider } from './providers/irc';
import { Server } from './types/server';
import { OutputFileService } from './services/file';

export function activate(context: ExtensionContext) {
	const servers: Server[] = [];
	const configServers = loadServersFromConfig() || [];
	const contextServers: Server[] = context.globalState?.get('ircServerConnections') || [];

	// Add servers from context (We assume are the most up to date)
	servers.push(...configServers);
	// Add servers from config only if they don't exist in context
	servers.push(...contextServers.filter((server) => !servers.some((s) => s.host === server.host && s.username === server.username)));

	const providers: Providers = {
		tree: new IrcTreeProvider(servers),
		output: new OutputFileService(),
	};

	context.subscriptions.push(
		window.registerTreeDataProvider('icarusServers', providers.tree)
	);

	icarusCommands.forEach(({ name, callback }) => {
		console.log('Registering command', name);
		context.subscriptions.push(commands.registerCommand(name, (e) => callback(context, providers, e)));
	});

	window.createOutputChannel('Icarus IRC', { log: true });
}

// This method is called when your extension is deactivated
export function deactivate() {
	// Save all the servers to the workspace configuration.
}

function loadServersFromConfig(): Server[] | undefined {
	const config = workspace.getConfiguration('icarus');
	const configuredServers: Server[] | null | undefined = config.get('configuredServers');
	console.log(configuredServers);
	return configuredServers?.map<Server>((server) => {
		return {
			name: server.name,
			host: server.host,
			port: server.port,
			username: server.username,
			password: server.password,
			channels: server.channels || [],
		};
	});
}
