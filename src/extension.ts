import { ExtensionContext, commands, window, workspace } from 'vscode';
import { icarusCommands } from './commands';
import { Providers } from './providers';
import { IrcServerConnection, IrcServerTreeProvider } from './providers/irc';

export function activate(context: ExtensionContext) {
	const servers: IrcServerConnection[] = [];
	const configServers = loadServersFromConfig() || [];
	const contextServers: IrcServerConnection[] = context.globalState?.get('ircServerConnections') || [];

	// Add servers from context (We assume are the most up to date)
	servers.push(...configServers);
	// Add servers from config only if they don't exist in context
	servers.push(...contextServers.filter((server) => !servers.some((s) => s.host === server.host && s.username === server.username)));

	const providers: Providers = {
		servers: new IrcServerTreeProvider(servers),
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
export function deactivate() {
	// Save all the servers to the workspace configuration.
}

function loadServersFromConfig(): IrcServerConnection[] | undefined {
	const config = workspace.getConfiguration('icarus');
	const configuredServers: IrcServerConnection[] | null | undefined = config.get('configuredServers');
	console.log(configuredServers);
	return configuredServers?.map<IrcServerConnection>((server) => {
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
