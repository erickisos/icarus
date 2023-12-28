import { Event, EventEmitter, ProviderResult, TreeDataProvider, TreeItem } from 'vscode';
import { ServerNode } from '../schema';
import { IrcTreeElement } from '../schema';
import { Server } from '../types/server';

export class IrcTreeProvider implements TreeDataProvider<IrcTreeElement> {
    private _onDidChangeTreeData: EventEmitter<IrcTreeElement | undefined | null> = new EventEmitter<IrcTreeElement | undefined | null>();
    readonly onDidChangeTreeData: Event<IrcTreeElement | undefined | null> = this._onDidChangeTreeData.event;

    constructor(public servers: Server[]) { }

    update(servers: Server[]) {
        this.servers = servers;
        this._onDidChangeTreeData.fire(undefined);
    }

    refresh(): void {
        this._onDidChangeTreeData.fire(undefined);
    }

    getTreeItem(element: IrcTreeElement): TreeItem | Thenable<TreeItem> {
        return element.getTreeItem();
    }

    getChildren(element?: IrcTreeElement | undefined): ProviderResult<IrcTreeElement[] | null> {
        if (!element) {
            return this.servers.map(server => new ServerNode(server));
        }
        if (element.getChildren) {
            return element.getChildren();
        }
        return null;
    }
}
