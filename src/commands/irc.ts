import { ExtensionContext, QuickPickItem, ThemeIcon, window, workspace } from 'vscode';
import { Providers } from '../providers';
import { IrcServerConnection, IrcServerNode } from '../providers/irc';

export async function addServer(context: ExtensionContext, providers: Providers) {
    const host = await askForInput({ field: 'host', placeholder: 'irc.example.com', password: false, value: '', validateInput: validateHost });
    if (!host || host.trim().length === 0) {
        return;
    }
    const port = await askForInput({ field: 'port', placeholder: '6667', password: false, value: '6667', validateInput: validatePort });
    if (!port || port.trim().length === 0) {
        return;
    }
    const username = await askForInput({ field: 'username', placeholder: 'username', password: false, value: '', validateInput: validateUsername });
    if (!username || username.trim().length === 0) {
        return;
    }
    const password = await askForInput({ field: 'password', placeholder: 'password', password: true });
    const name = await askForInput({ field: 'name', placeholder: 'name' });

    const ircServerConnection: IrcServerConnection = {
        host: host,
        port: parseInt(port),
        name: name || host,
        username: username,
        password: password || '',
        channels: []
    };
    console.log(ircServerConnection);
    persistIrcServerConnection(context, providers, ircServerConnection);
}


export async function editServer(context: ExtensionContext, providers: Providers, ircServerNode?: IrcServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    const ircServerConnection = ircServerNode.ircServerConnection;
    const host = await askForInput({ field: 'host', placeholder: 'irc.example.com', password: false, value: ircServerConnection.host, validateInput: validateHost });
    if (!host || host.trim().length === 0) {
        return;
    }
    const port = await askForInput({ field: 'port', placeholder: '6667', password: false, value: ircServerConnection.port.toString(), validateInput: validatePort });
    if (!port || port.trim().length === 0) {
        return;
    }
    const username = await askForInput({ field: 'username', placeholder: 'username', password: false, value: ircServerConnection.username, validateInput: validateUsername });
    if (!username || username.trim().length === 0) {
        return;
    }
    const password = await askForInput({ field: 'password', placeholder: 'password', password: true, value: ircServerConnection.password });
    const name = await askForInput({ field: 'name', placeholder: 'name', value: ircServerConnection.name });

    ircServerConnection.host = host;
    ircServerConnection.port = parseInt(port);
    ircServerConnection.name = name || host;
    ircServerConnection.username = username;
    ircServerConnection.password = password || '';
    console.log(ircServerConnection);
    persistIrcServerConnection(context, providers, ircServerConnection);
}

export async function removeServer(context: ExtensionContext, providers: Providers, ircServerNode?: IrcServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    const ircServerConnection = ircServerNode.ircServerConnection;
    const isConfirmed = await window.showInformationMessage(`Icarus: Removing server ${ircServerConnection.name} (${ircServerConnection.username})`, { modal: true, detail: 'This action cannot be undone, we will disconnect you from the server and delete the configuration, do you want to proceed?' }, 'Proceed');
    if (isConfirmed) {
        removeIrcServerConnection(context, providers, ircServerConnection);
    }
}

export async function connectServer(context: ExtensionContext, providers: Providers, ircServerNode?: IrcServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    console.log(ircServerNode);
}

export async function disconnectServer(context: ExtensionContext, providers: Providers, ircServerNode?: IrcServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    console.log(ircServerNode);
}

// TODO [EI]: Reorganize the next Utility functions into a separated file.
async function userPickServer(context: ExtensionContext, providers: Providers): Promise<IrcServerNode | undefined> {
    const ircServerNodes: IrcServerNode[] = providers?.servers?.getChildren() ?? [];
    const quickPickServers: QuickPickItem[] = ircServerNodes.map((ircServerNode: IrcServerNode) => ircServerNodeToQuickPickItem(ircServerNode));
    const selectedServer = await window.showQuickPick(quickPickServers, { placeHolder: 'Select a server', ignoreFocusOut: true, canPickMany: false });
    if (!selectedServer) {
        return;
    }
    const username = selectedServer.label.split(' ')[1].replace('(', '').replace(')', '');
    return ircServerNodes.find((ircServerNode) => {
        return selectedServer.label === `${ircServerNode.ircServerConnection.name} (${username})`;
    });
}

function ircServerNodeToQuickPickItem(ircServerNode: IrcServerNode): QuickPickItem {
    const ircServerConnection = ircServerNode.ircServerConnection;
    return {
        label: `${ircServerConnection.name} (${ircServerConnection.username})`,
        detail: ircServerConnection.host,
        iconPath: new ThemeIcon('server')
    };
}


function persistIrcServerConnection(context: ExtensionContext, providers: Providers, ircServerConnection: IrcServerConnection) {
    const ircServerConnections = providers?.servers?.getItems() || [];
    const index = isConnectionPresent(ircServerConnection, ircServerConnections);

    if (index !== -1) {
        window.showInformationMessage(`Icarus: Updating server info for ${ircServerConnection.name} (${ircServerConnection.username})`);
        ircServerConnections[index] = ircServerConnection;
    } else {
        window.showInformationMessage(`Icarus: Adding server ${ircServerConnection.name} (${ircServerConnection.username})`);
        ircServerConnections.push(ircServerConnection);
    }
    providers?.servers?.update(ircServerConnections);
    context.globalState?.update('ircServerConnections', ircServerConnections);
    workspace.getConfiguration('icarus').update('configuredServers', ircServerConnections);
}

function removeIrcServerConnection(context: ExtensionContext, providers: Providers, ircServerConnection: IrcServerConnection) {
    const ircServerConnections = providers?.servers?.getItems() || [];
    const index = isConnectionPresent(ircServerConnection, ircServerConnections);

    if (index === -1) {
        window.showInformationMessage(`Icarus: Server ${ircServerConnection.name} (${ircServerConnection.username}) not found`);
        return;
    }
    ircServerConnections.splice(index, 1);
    providers?.servers?.update(ircServerConnections);
    context.globalState?.update('ircServerConnections', ircServerConnections);
    workspace.getConfiguration('icarus').update('configuredServers', ircServerConnections);
}

function isConnectionPresent(ircServerConnection: IrcServerConnection, ircServerConnections: IrcServerConnection[]): number {
    return ircServerConnections.findIndex((connection) => {
        return connection.host === ircServerConnection.host && connection.username === ircServerConnection.username;
    });
}

async function askForInput({ field, placeholder, password, value, validateInput }: { field: string; isOptional?: boolean; placeholder?: string; password?: boolean; value?: string; validateInput?: (value: string) => string | null; }): Promise<string | null> {
    const inputValue = await window.showInputBox({
        title: `Icarus: Add Server Config`,
        prompt: `Enter the ${field}`,
        placeHolder: placeholder,
        value: value,
        ignoreFocusOut: true,
        password: password,
        validateInput: validateInput
    }) || '';

    return inputValue;
}

function isEmptyInput(value: string | null): boolean {
    // TODO [EI]: Add unit tests for this method.
    return !value || value.trim().length === 0;
}

function validateHost(value: string) {
    // TODO [EI]: Add unit tests for this method. Magic Number 3 is the minimum length of a domain considering the TLD.
    const hostRegex = /^([a-z0-9]+\.?){3,}$/i;

    if (!hostRegex.test(value)) {
        return 'Host must be a valid domain';
    }
    return null;
}

function validatePort(value: string) {
    // TODO [EI]: Add unit tests for this method.
    const portRegex = /^[0-9]+$/;

    if (!portRegex.test(value)) {
        return 'Port must be a valid number';
    }
    return null;
}

function validateUsername(value: string) {
    // TODO [EI]: Add unit tests for this method.
    const usernameRegex = /^[a-z0-9]+$/i;

    if (!usernameRegex.test(value)) {
        return 'Username must be alphanumeric';
    }
    return null;
}
