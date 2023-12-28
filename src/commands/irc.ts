import { ExtensionContext, QuickPickItem, ThemeIcon, window, workspace } from 'vscode';
import { ChannelNode, ServerNode } from '../schema';
import { Providers } from '../providers';
import { Server } from '../types/server';

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

    const ircServerConnection: Server = {
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


export async function editServer(context: ExtensionContext, providers: Providers, ircServerNode?: ServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    const ircServerConnection = ircServerNode.server;
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

export async function removeServer(context: ExtensionContext, providers: Providers, ircServerNode?: ServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    const { server } = ircServerNode;
    const isConfirmed = await window.showInformationMessage(`Icarus: Removing server ${server.name} (${server.username})`, { modal: true, detail: 'This action cannot be undone, we will disconnect you from the server and delete the configuration, do you want to proceed?' }, 'Proceed');
    if (isConfirmed) {
        removeIrcServerConnection(context, providers, server);
    }
}

export async function connectServer(context: ExtensionContext, providers: Providers, ircServerNode?: ServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    // TODO: Change flag to true in isConnected.
    console.log(ircServerNode);

}

export async function disconnectServer(context: ExtensionContext, providers: Providers, ircServerNode?: ServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    console.log(ircServerNode);

}

export async function joinChannel(context: ExtensionContext, providers: Providers, ircServerNode?: ServerNode) {
    if (ircServerNode && !(ircServerNode instanceof ServerNode)) {
        return;
    }
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    const { server } = ircServerNode;
    console.log(ircServerNode);
    const channelName = (
        await window.showInputBox({
            title: `Icarus: Add Channel`,
            prompt: `Enter the channel name`,
            placeHolder: '#general',
            ignoreFocusOut: true,
        }) || ''
    ).trim();
    if (!channelName || channelName.length === 0) {
        return;
    }

    let isAlreadyJoined = server.channels?.find((channel) => channel.name === channelName);
    if (isAlreadyJoined) {
        window.showInformationMessage(`Icarus: You are already in ${channelName}`);
        return;
    }

    // TODO: Before pushing we need to actually connect to the channel.
    server.channels?.push({
        name: channelName,
        parent: server
    });
    persistIrcServerConnection(context, providers, server);
}

export async function leaveChannel(context: ExtensionContext, providers: Providers, channel: ChannelNode) {
    if (channel && !(channel instanceof ChannelNode)) {
        return;
    }
    console.log(channel);
}

export async function sendMessage(context: ExtensionContext, providers: Providers, target: any) {
    console.log(target);

}

export async function sendAction(context: ExtensionContext, providers: Providers, target: any) {
    console.log(target);

}

// TODO [EI]: Reorganize the next Utility functions into a separated file.
async function userPickServer(context: ExtensionContext, providers: Providers): Promise<ServerNode | undefined> {
    const servers: ServerNode[] = (providers?.tree?.getChildren() ?? []) as ServerNode[];
    const quickPickServers: QuickPickItem[] = servers.map((server: ServerNode) => serverToQuickPickItem(server.server));
    const selectedServer = await window.showQuickPick(quickPickServers, { placeHolder: 'Select a server', ignoreFocusOut: true, canPickMany: false });
    if (!selectedServer) {
        return;
    }
    return servers.find(({ server }) => {
        return selectedServer.label === `${server.name} (${server.username})`;
    });
}

// TODO: This is an adapter, all the adapters should handle internal types
function serverToQuickPickItem(server: Server): QuickPickItem {
    return {
        label: `${server.name} (${server.username})`,
        detail: server.host,
        iconPath: new ThemeIcon('server')
    };
}

function persistIrcServerConnection(context: ExtensionContext, providers: Providers, ircServerConnection: Server) {
    const ircServerConnections = providers?.tree?.servers || [];
    const index = isConnectionPresent(ircServerConnection, ircServerConnections);

    if (index !== -1) {
        window.showInformationMessage(`Icarus: Updating server info for ${ircServerConnection.name} (${ircServerConnection.username})`);
        ircServerConnections[index] = ircServerConnection;
    } else {
        window.showInformationMessage(`Icarus: Adding server ${ircServerConnection.name} (${ircServerConnection.username})`);
        ircServerConnections.push(ircServerConnection);
    }
    providers?.tree?.update(ircServerConnections);
    context.globalState?.update('ircServerConnections', ircServerConnections);
    workspace.getConfiguration('icarus').update('configuredServers', ircServerConnections);
}

function removeIrcServerConnection(context: ExtensionContext, providers: Providers, server: Server) {
    const ircServerConnections = providers?.tree?.servers || [];
    const index = isConnectionPresent(server, ircServerConnections);

    if (index === -1) {
        window.showInformationMessage(`Icarus: Server ${server.name} (${server.username}) not found`);
        return;
    }
    ircServerConnections.splice(index, 1);
    providers?.tree?.update(ircServerConnections);
    context.globalState?.update('ircServerConnections', ircServerConnections);
    workspace.getConfiguration('icarus').update('configuredServers', ircServerConnections);
}

function isConnectionPresent(ircServerConnection: Server, ircServerConnections: Server[]): number {
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
