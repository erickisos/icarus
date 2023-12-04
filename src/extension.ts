import * as vscode from 'vscode';
import { IcarusSidebarProvider } from './services/IcarusSidebarProvider';

export function activate(context: vscode.ExtensionContext) {
	const provider = new IcarusSidebarProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(IcarusSidebarProvider.viewType, provider));

	context.subscriptions.push(
		vscode.commands.registerCommand('icarus.openIcarus', () => {
		}));

	// context.subscriptions.push(
	// 	vscode.commands.registerCommand('calicoColors.clearColors', () => {
	// 		provider.clearColors();
	// 	}));
}
