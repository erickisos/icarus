import { ExtensionContext, QuickPickItem, window, workspace } from 'vscode';
import { serverToQuickPickItem } from '../adapters';
import { askForServer } from '../inputs';
import { Providers } from '../providers';
import { ChannelNode, ServerNode } from '../schema';
import { Channel } from '../types/channel';
import { Server, isConnected } from '../types/server';
import { IrcService } from '../services/irc';

export async function addServer(context: ExtensionContext, providers: Providers) {
    const server: Server = await askForServer();
    console.log(server);
    persistIrcServerConnection(context, providers, server);
}


export async function editServer(context: ExtensionContext, providers: Providers, ircServerNode?: ServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    const server = await askForServer(ircServerNode?.server);
    console.log(server);
    persistIrcServerConnection(context, providers, server, ircServerNode?.server);
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

    const { server } = ircServerNode;
    if (isConnected(server)) {
        window.showInformationMessage(`Icarus: You are already connected to ${server.name} (${server.username})`);
        return;
    }

    const ircClient = new IrcService(server, (message: string) => {
        console.log(message);
    });

    server.channels?.forEach((channel: Channel) => {
        ircClient.joinChannel(channel.name);
    });

    server.client = ircClient;

    persistIrcServerConnection(context, providers, server);
}

export async function disconnectServer(context: ExtensionContext, providers: Providers, ircServerNode?: ServerNode) {
    ircServerNode = ircServerNode ?? await userPickServer(context, providers);
    if (!ircServerNode) {
        return;
    }
    console.log(ircServerNode);

    const { server } = ircServerNode;
    if (!isConnected(server)) {
        window.showInformationMessage(`Icarus: You are not connected to ${server.name} (${server.username})`);
        return;
    }

    server.client?.disconnect();
    persistIrcServerConnection(context, providers, server);
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
    });
    persistIrcServerConnection(context, providers, server);
}

export async function leaveChannel(context: ExtensionContext, providers: Providers, channel: ChannelNode) {
    if (channel && !(channel instanceof ChannelNode)) {
        return;
    }
    console.log(channel);

    const isConfirmed = await window.showInformationMessage(`Icarus: Leaving channel ${channel.channel.name}`, { modal: true, detail: 'This action cannot be undone, we will disconnect you from the channel, do you want to proceed?' }, 'Proceed');

    const serverNode = channel.getParent();
    const server = {
        ...serverNode.server,
    };
    if (isConfirmed) {
        const channels = [
            ...server.channels?.filter((c: Channel) => c.name !== channel.channel.name) || []
        ];
        server.channels = channels;
        persistIrcServerConnection(context, providers, server);
    }
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
    const quickPickServers: QuickPickItem[] = servers.map(({ server }: ServerNode) => serverToQuickPickItem(server));
    const selectedServer = await window.showQuickPick(quickPickServers, { placeHolder: 'Select a server', ignoreFocusOut: true, canPickMany: false });
    if (!selectedServer) {
        return;
    }
    return servers.find(({ server }) => {
        return selectedServer.label === `${server.name} (${server.username})`;
    });
}

function persistIrcServerConnection(context: ExtensionContext, providers: Providers, server: Server, prevServer?: Server) {
    const servers = providers?.tree?.servers || [];
    const index = isConnectionPresent(prevServer ?? server, servers);

    if (index !== -1) {
        window.showInformationMessage(`Icarus: Updating server info for ${prevServer?.name} (${prevServer?.username})`);
        servers[index] = server;
    } else {
        window.showInformationMessage(`Icarus: Adding server ${server.name} (${server.username})`);
        servers.push(server);
    }
    providers?.tree?.update(servers);
    context.globalState?.update('ircServerConnections', servers);
    workspace.getConfiguration('icarus').update('configuredServers', servers.map((server: Server): Partial<Server> => {
        return {
            name: server.name,
            host: server.host,
            port: server.port,
            username: server.username,
            password: server.password,
        };
    }));
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
