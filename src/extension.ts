import * as vscode from 'vscode';
import { IcarusSidebarProvider } from './views/IcarusSidebarProvider';
import { IrcConnection } from './types/irc';

export function activate(context: vscode.ExtensionContext) {
	const provider = new IcarusSidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(IcarusSidebarProvider.viewType, provider));

	context.subscriptions.push(
		vscode.commands.registerCommand('icarus.connect', async () => {
			// TODO [EI]: Add the connection to IRC servers.
			const server = await vscode.window.showInputBox({
				title: 'Icarus - Connect to IRC',
				prompt: 'Enter the IRC server to connect to',
				placeHolder: 'irc.example.com',
				ignoreFocusOut: true,
			});
			const port = await vscode.window.showInputBox({
				title: 'Icarus - Connect to IRC',
				prompt: 'Enter the port to connect to',
				placeHolder: '6667',
				ignoreFocusOut: true,
			});
			const username = await vscode.window.showInputBox({
				title: 'Icarus - Connect to IRC',
				prompt: 'Enter your username',
				placeHolder: 'example',
				ignoreFocusOut: true,
			});
			const password = await vscode.window.showInputBox({
				title: 'Icarus - Connect to IRC',
				prompt: '[Optional] Enter your password',
				placeHolder: 'password',
				ignoreFocusOut: true,
			});

			const connectionState: IrcConnection = {
				server: server!,
				port: parseInt(port!),
				username: username!,
				password: password!,
			};
			console.log(connectionState);
		})
	);

	context.subscriptions.push(
		vscode.commands.registerCommand('icarus.openIcarus', () => {
		})
	);
}

export function deactivate() {
	// TODO [EI]: Add the graceful disconnection from IRC servers.
}
