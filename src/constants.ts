import { InputBoxOptions } from 'vscode';

export const serverInputBox: InputBoxOptions = {
    prompt: "Enter the IRC server to connect to",
    placeHolder: "irc.freenode.net",
    ignoreFocusOut: true,
};

export const portInputBox: InputBoxOptions = {
    prompt: "Enter the port to connect to",
    placeHolder: "6667",
    ignoreFocusOut: true,
};

export const usernameInputBox: InputBoxOptions = {
    prompt: "Enter your username",
    placeHolder: "example",
    ignoreFocusOut: true,
};

export const passwordInputBox: InputBoxOptions = {
    prompt: "[Optional] Enter your password",
    placeHolder: "password",
    ignoreFocusOut: true,
    password: true,
};

export const serverNameInputBox: InputBoxOptions = {
    prompt: 'Enter the name for this configuration',
    placeHolder: 'Freenode',
    ignoreFocusOut: true,
};
