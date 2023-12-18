import { ExtensionContext, QuickPickItem, window } from 'vscode';
import { serverInputBox, portInputBox, usernameInputBox, passwordInputBox, serverNameInputBox } from '../constants';
import { IrcConnection } from '../types/irc';

const commandLabels = {
    'icarus.connect': 'Icarus: Connect to Server'
}

export async function connectToServer(context: ExtensionContext): Promise<void> {
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

    const serverName = await window.showInputBox({
        ...serverNameInputBox,
        title: commandLabels['icarus.connect'],
    }) || server;

    addServerToState(context, server, port, username, password, serverName);
    console.log(context.globalState.get('servers'));
}

export async function disconnectFromServer(context: ExtensionContext): Promise<void> {
    // TODO [EI]: Add the servers list to the quick pick.
    const servers: QuickPickItem[] = (context.globalState.get('servers') || []).map((server: IrcConnection) => {
        return {
            label: server.serverName,
            detail: `${server.server} (${server.username})`,
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
                removeServerFromState(context, serverName, username);
            }
        });
    }
}
function addServerToState(context: ExtensionContext, server: string, port: string, username: string, password: string | undefined, serverName: string) {
    const servers: IrcConnection[] = context.globalState.get('servers') || [];

    // Check if the server is not already in the list (by server address + username)
    if (servers.find(s => s.server === server && s.username === username)) {
        window.showErrorMessage('You are already connected to this server with this username.');
        return;
    }

    try {
        servers.push({
            server: server,
            port: parseInt(port),
            username: username,
            password: password || '',
            serverName: serverName || server,
        });
        context.globalState.update('servers', servers);
    } catch (error) {
        window.showErrorMessage('Invalid port number.');
    }
}

function removeServerFromState(context: ExtensionContext, serverName: string, username: string) {
    const servers: IrcConnection[] = context.globalState.get('servers') || [];

    if (servers.find(s => s.serverName === serverName && s.username === username)) {
        const index = servers.findIndex(s => s.serverName === serverName && s.username === username);
        servers.splice(index, 1);
    }

    context.globalState.update('servers', servers);
}

