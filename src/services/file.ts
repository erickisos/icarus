import { Uri, workspace } from 'vscode';

export class OutputFileService {
    private outputFileUri: Uri | undefined;

    constructor(outputFile?: string) {
        console.log(workspace.workspaceFolders?.map(folder => folder.uri.path));
    }

    writeToOutputFile(newLines: string[]): void {

    }

    readLatestPrompt(): string[] {
        return [];
    }
}
