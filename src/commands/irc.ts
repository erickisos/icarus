import { ExtensionContext, QuickPickItem, window } from 'vscode';
import { serverInputBox, portInputBox, usernameInputBox, passwordInputBox, serverNameInputBox } from '../constants';
import { IrcConnection } from '../types/irc';
import { Providers } from '../providers';

const commandLabels = {
    'icarus.connect': 'Icarus: Connect to Server'
};

export async function connectToServer(context: ExtensionContext, providers: Providers): Promise<void> {
    const server = await window.showInputBox({
        ...serverInputBox,
        title: commandLabels['icarus.connect'],
    });

    if (!server) {
        window.showErrorMessage('You must enter a server address to connect to.');
        return;
    }

    const port = await window.showInputBox({
        ...portInputBox,
        title: commandLabels['icarus.connect'],
    }) || '6667';

    const username = await window.showInputBox({
        ...usernameInputBox,
        title: commandLabels['icarus.connect'],
    });

    if (!username) {
        window.showErrorMessage('You must enter a username.');
        return;
    }

    const password = await window.showInputBox({
        ...passwordInputBox,
        title: commandLabels['icarus.connect'],
    });

    const name = await window.showInputBox({
        ...serverNameInputBox,
        title: commandLabels['icarus.connect'],
    }) || server;

    addServerToState(context, providers, server, port, username, password, name);
    console.log(providers.servers);
}

export async function disconnectFromServer(context: ExtensionContext, providers: Providers): Promise<void> {
    // TODO [EI]: Add the servers list to the quick pick.
    const servers: QuickPickItem[] = (providers?.servers?.getItems() || []).map((server: IrcConnection) => {
        return {
            label: server.name,
            detail: `${server.address} (${server.username})`,
        };
    });
    const selectedServers = await window.showQuickPick(servers,
        { canPickMany: true, ignoreFocusOut: true, placeHolder: 'Are you sure you want to disconnect from all servers?' }
    );

    // TODO [EI]: Add the graceful disconnection from IRC servers.
    if (selectedServers) {
        selectedServers.forEach((server: QuickPickItem) => {
            const serverName = server.label;
            const username = server.detail?.split(' ')[1].replace('(', '').replace(')', '');

            if (serverName && username) {
                removeServerFromState(context, providers, serverName, username);
            }
        });
    }
}
function addServerToState(context: ExtensionContext, providers: Providers, server: string, port: string, username: string, password: string | undefined, name: string) {
    const servers: IrcConnection[] = providers?.servers?.getItems() || [];

    // Check if the server is not already in the list (by server address + username)
    if (servers.find(s => s.address === server && s.username === username)) {
        window.showErrorMessage('You are already connected to this server with this username.');
        return;
    }

    try {
        servers.push({
            address: server,
            port: parseInt(port),
            username: username,
            password: password || '',
            name: name || server,
        });
        context.globalState.update('servers', servers);
        providers.servers.update(servers);
    } catch (error) {
        window.showErrorMessage('Invalid port number.');
    }
}

function removeServerFromState(context: ExtensionContext, providers: Providers, name: string, username: string) {
    const servers: IrcConnection[] = providers?.servers?.getItems() || [];

    if (servers.find(s => s.name === name && s.username === username)) {
        const index = servers.findIndex(s => s.name === name && s.username === username);
        servers.splice(index, 1);
    }

    context.globalState.update('servers', servers);
    providers.servers.update(servers);
}
