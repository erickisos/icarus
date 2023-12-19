import { EventEmitter, TreeDataProvider, TreeItem } from 'vscode';
import { IrcConnection } from '../types/irc';

export class ServerConnectionNode extends TreeItem {
    public connection: IrcConnection;

    constructor(server: IrcConnection) {
        super(`${server.name} (${server.username})`);
        this.connection = server;
        this.tooltip = `${server.address} (${server.port})`;
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
        return this.servers.map(server => new ServerConnectionNode(server));
    }

    getItems(): IrcConnection[] {
        return this.servers;
    }
}

