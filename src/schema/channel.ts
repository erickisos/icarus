import { TreeItemCollapsibleState, TreeItem, ThemeIcon } from 'vscode';
import { UserNode } from '.';
import { Channel } from '../types/channel';
import { IrcTreeElement } from './base';

export class ChannelNode implements IrcTreeElement {
    constructor(public readonly channel: Channel) { }

    get label(): string {
        return this.channel.name;
    }

    get collapsibleState(): TreeItemCollapsibleState {
        return (this.channel.users ?? []).length > 0 ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed;
    }

    getChildren(): UserNode[] {
        return this.channel.users?.map(user => new UserNode(user)) ?? [];
    }

    getTreeItem(): TreeItem {
        return {
            label: this.label,
            collapsibleState: this.collapsibleState,
            iconPath: new ThemeIcon('command'),
            contextValue: 'channelNode'
        };
    }
}
