import { ExtensionContext, window } from 'vscode';
import { Providers } from '../providers';
import { IrcServerConnection } from '../providers/irc';

export async function addServer(context: ExtensionContext, providers: Providers, e: any) {
    const address = await askForInput({ field: 'address', placeholder: 'irc.example.com', password: false, value: '', validateInput: validateAddress });
    if (!address || address.trim().length === 0) {
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
        address: address,
        port: parseInt(port),
        name: name || address,
        username: username,
        password: password || '',
        channels: []
    };
    console.log(ircServerConnection);
    persistIrcServerConnection(context, providers, ircServerConnection);
}

function persistIrcServerConnection(context: ExtensionContext, providers: Providers, ircServerConnection: IrcServerConnection) {
    const ircServerConnections = providers?.servers?.getItems() || [];

    if (isConnectionPresent(ircServerConnection, ircServerConnections)) {
        window.showInformationMessage(`Icarus: Updating server info for ${ircServerConnection.name}`);
    }

    ircServerConnections.push(ircServerConnection);
    providers?.servers?.update(ircServerConnections);
    context.globalState?.update('ircServerConnections', ircServerConnections);
}

function isConnectionPresent(ircServerConnection: IrcServerConnection, ircServerConnections: IrcServerConnection[]) {
    return ircServerConnections.some((connection) => {
        return connection.address === ircServerConnection.address && connection.username === ircServerConnection.username;
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

function validateAddress(value: string) {
    // TODO [EI]: Add unit tests for this method.
    const addressRegex = /^([a-z0-9]+\.?)+$/i;

    if (!addressRegex.test(value)) {
        return 'Address must be a valid domain';
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

export async function editServer(context: ExtensionContext, providers: Providers, e: any) {
    console.log(e);

}

export async function removeServer(context: ExtensionContext, providers: Providers, e: any) {
    console.log(e);

}

export async function connectServer(context: ExtensionContext, providers: Providers, e: any) {
    console.log(e);

}

export async function disconnectServer(context: ExtensionContext, providers: Providers, e: any) {
    console.log(e);

}

export async function joinChannel(context: ExtensionContext, providers: Providers, e: any) {
    console.log(e);

}

export async function partChannel(context: ExtensionContext, providers: Providers, e: any) {
    console.log(e);

}

export async function sendMessage(context: ExtensionContext, providers: Providers, e: any) {
    console.log(e);

}

export async function sendAction(context: ExtensionContext, providers: Providers, e: any) {
    console.log(e);

}

