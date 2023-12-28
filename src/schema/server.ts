import { TreeItemCollapsibleState, TreeItem, ThemeIcon } from 'vscode';
import { ChannelNode } from '.';
import { Server } from '../types/server';
import { IrcTreeElement } from './base';

export class ServerNode implements IrcTreeElement {
    constructor(public readonly server: Server) { }

    get label(): string {
        return `${this.server.name} (${this.server.username})`;
    }

    get collapsibleState(): TreeItemCollapsibleState {
        return (this.server.channels ?? []).length > 0 ? TreeItemCollapsibleState.Expanded : TreeItemCollapsibleState.None;
    }

    getChildren(): ChannelNode[] {
        return this.server.channels?.map(channel => new ChannelNode(channel, this)) || [];
    }

    getTreeItem(): TreeItem {
        return {
            label: this.label,
            collapsibleState: this.collapsibleState,
            iconPath: new ThemeIcon('server'),
            contextValue: 'server'
        };
    }
}
