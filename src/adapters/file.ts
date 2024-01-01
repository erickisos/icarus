import { TextEditor, workspace } from 'vscode';

let historyIndex: string[] | undefined;
let lastTextAtPrompt: string | undefined;

const RESULTS_DOC_NAME = 'output.icarus.irc';
const CHAT_HINT = 'Use `alt+enter` to evaluate your command';
const GREETINGS = [
    'This is the Icarus output window.',
    'It will show the selected channel and all the received messages',
    'Enjoy! ♥️'
];

const resetState = () => {
    historyIndex = undefined;
    lastTextAtPrompt = undefined;
};

const showReplHistoryEntry = (
    historyEntry: string | undefined,
    resultsEditor: TextEditor
) => {

};

const outputFileDir = () => {
    return workspace.workspaceFolders ? workspace.workspaceFolders[0]?.uri : undefined;
};
