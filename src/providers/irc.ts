import { EventEmitter, TreeDataProvider, TreeItem } from 'vscode';
import { IrcConnection } from '../types/irc';

export class ServerNode extends TreeItem {
    public server: IrcConnection;

    constructor(server: IrcConnection) {
        super(`${server.serverName} (${server.username})`);
        this.server = server;
    }
}

export class ServersTreeProvider implements TreeDataProvider<TreeItem> {
    private servers: Array<IrcConnection> = [];
    private event = new EventEmitter<TreeItem>();

    readonly onDidChangeTreeData = this.event.event;

    constructor(servers: Array<IrcConnection>) {
        this.servers = servers;
    }

    update(servers: IrcConnection[]) {
        this.servers = servers;
        console.log(this.servers);
        this.event.fire();
    }

    getTreeItem(element: TreeItem): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: TreeItem | undefined): TreeItem[] | Thenable<TreeItem[]> {
        return this.servers.map(server => new ServerNode(server));
    }

    getItems(): IrcConnection[] {
        return this.servers;
    }
}

