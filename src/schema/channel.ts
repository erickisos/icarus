import { TreeItemCollapsibleState, TreeItem, ThemeIcon } from 'vscode';
import { ServerNode, UserNode } from '.';
import { Channel } from '../types/channel';
import { IrcTreeElement } from '.';

export class ChannelNode implements IrcTreeElement {
    constructor(public readonly channel: Channel, public readonly parent: ServerNode) { }

    get label(): string {
        return this.channel.name;
    }

    get collapsibleState(): TreeItemCollapsibleState {
        if (this.channel.users === undefined) {
            return TreeItemCollapsibleState.None;
        }
        return this.channel.users.length > 0 ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.Collapsed;
    }

    getChildren(): UserNode[] {
        return this.channel.users?.map(user => new UserNode(user, this)) ?? [];
    }

    getTreeItem(): TreeItem {
        return {
            label: this.label,
            collapsibleState: this.collapsibleState,
            iconPath: new ThemeIcon('command'),
            contextValue: 'channel'
        };
    }

    getParent(): ServerNode {
        return this.parent;
    }
}
