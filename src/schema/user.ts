import { TreeItemCollapsibleState, TreeItem, ThemeIcon } from 'vscode';
import { User } from '../types/user';
import { IrcTreeElement } from './base';

export class UserNode implements IrcTreeElement {
    constructor(public readonly user: User) { }

    get label(): string {
        return this.user.name;
    }

    get collapsibleState(): TreeItemCollapsibleState {
        return TreeItemCollapsibleState.None;
    }

    getTreeItem(): TreeItem {
        // TODO: icon path variable depending on the user role.
        return {
            label: this.label,
            collapsibleState: this.collapsibleState,
            iconPath: new ThemeIcon('account'),
            contextValue: 'userNode'
        };
    }
}
