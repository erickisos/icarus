import { window } from 'vscode';
import { Server } from '../types/server';
import { validateHost, validatePort, validateUsername } from '../validators';
import { Channel } from '../types/channel';

interface PartialOptions {
    value?: any
    shouldValidate?: boolean
    defaultValue?: string
    validateInput?: (value: string) => string | null
}

export const askForServer = async (target?: Server): Promise<Server> => {
    const partialServer: Partial<Server> = target ? {
        ...target
    } : {};
    return askForHost(partialServer, { shouldValidate: true, value: target?.host, validateInput: validateHost })
        .then((partial) => askForPort(partial, { defaultValue: '6667', value: target?.port, validateInput: validatePort }))
        .then((partial) => askForUsername(partial, { shouldValidate: true, value: target?.username, validateInput: validateUsername }))
        .then((partial) => askForPassword(partial, { value: target?.password }))
        .then((partial) => askForChannels(partial, { value: target?.channels }))
        .then((partial) => askForName(partial, { value: target?.name })) as Promise<Server>;
};

const askForHost = async (partialServer?: Partial<Server>, partialOptions?: PartialOptions): Promise<Partial<Server>> => {
    partialServer = partialServer ?? {};

    const host = await window.showInputBox({
        title: 'Icarus: Add Server Config',
        prompt: 'Enter the host',
        placeHolder: 'irc.example.com',
        value: partialOptions?.value,
        ignoreFocusOut: true,
        validateInput: partialOptions?.validateInput
    });

    if (partialOptions?.shouldValidate && !host) {
        throw new Error('Host is required');
    }

    return {
        ...partialServer,
        host: host
    };
};

const askForPort = async (partialServer?: Partial<Server>, partialOptions?: PartialOptions): Promise<Partial<Server>> => {
    partialServer = partialServer ?? {};

    const port = await window.showInputBox({
        title: 'Icarus: Add Server Config',
        prompt: 'Enter the port',
        placeHolder: '6667',
        value: partialOptions?.value,
        ignoreFocusOut: true,
        validateInput: partialOptions?.validateInput
    }) ?? partialOptions?.defaultValue;

    if (partialOptions?.shouldValidate && !port) {
        throw new Error('Port is required');
    }

    const parsedPort = parseInt(port as string);
    return {
        ...partialServer,
        port: parsedPort
    };
};

const askForUsername = async (partialServer?: Partial<Server>, partialOptions?: PartialOptions): Promise<Partial<Server>> => {
    partialServer = partialServer ?? {};

    const username = await window.showInputBox({
        title: 'Icarus: Add Server Config',
        prompt: 'Enter the username',
        placeHolder: 'username',
        value: partialOptions?.value,
        ignoreFocusOut: true,
        validateInput: partialOptions?.validateInput
    });

    if (partialOptions?.shouldValidate && !username) {
        throw new Error('Username is required');
    }

    return {
        ...partialServer,
        username: username?.trim()
    };
};


const askForPassword = async (partialServer?: Partial<Server>, partialOptions?: PartialOptions): Promise<Partial<Server>> => {
    partialServer = partialServer ?? {};

    const password = await window.showInputBox({
        title: 'Icarus: Add Server Config',
        prompt: '(Optional) Enter the password if any or leave blank',
        placeHolder: 'password',
        value: partialOptions?.value,
        ignoreFocusOut: true,
        password: true
    });

    if (partialOptions?.shouldValidate && !password) {
        throw new Error('Password is required');
    }

    return {
        ...partialServer,
        password: password?.trim()
    };
};

const askForChannels = async (partialServer?: Partial<Server>, partialOptions?: PartialOptions): Promise<Partial<Server>> => {
    partialServer = partialServer ?? {};

    const channels = await window.showInputBox({
        title: 'Icarus: Add Server Config',
        prompt: '(Optional) Enter the channels to join if any or leave blank',
        placeHolder: '#channel1,#channel2,#channel3',
        value: channelsToString(partialOptions?.value),
        ignoreFocusOut: true
    });

    if (partialOptions?.shouldValidate && !channels) {
        throw new Error('Channels are required');
    }

    return {
        ...partialServer,
        channels: channelsFromString(channels)
    };
};

const askForName = async (partialServer?: Partial<Server>, partialOptions?: PartialOptions): Promise<Partial<Server>> => {
    partialServer = partialServer ?? {};

    const name = await window.showInputBox({
        title: 'Icarus: Add Server Config',
        prompt: '(Optional) Enter the name of the server',
        placeHolder: 'example',
        value: partialOptions?.value,
        ignoreFocusOut: true
    });

    if (partialOptions?.shouldValidate && !name) {
        throw new Error('Name is required');
    }

    return {
        ...partialServer,
        name: name?.trim() || `${partialServer.host}`
    };
};


const channelsFromString = (channels: string | undefined): Channel[] | undefined => {
    return channels?.split(',').map(channel => ({ name: channel.trim() })) ?? [];
};

const channelsToString = (channels?: Channel[]) => {
    return channels?.map(channel => channel.name).join(',');
};
