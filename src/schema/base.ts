import { TreeItem, TreeItemCollapsibleState, ThemeIcon } from 'vscode';

export interface IrcTreeElement extends TreeItem {
    label: string;
    collapsibleState: TreeItemCollapsibleState;
    iconPath?: string | ThemeIcon;

    getChildren?(): IrcTreeElement[];
    getParent?(): IrcTreeElement | undefined;
    getTreeItem(): TreeItem | Thenable<TreeItem>;
}
