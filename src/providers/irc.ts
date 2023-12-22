import { EventEmitter, ThemeIcon, TreeDataProvider, TreeItem } from 'vscode';

export interface IrcChannel {
    name: string
}

export interface IrcServerConnection {
    host: string,
    port: number,
    name: string,
    username: string,
    password: string | undefined,
    channels: IrcChannel[],
}

export class IrcServerNode extends TreeItem {
    public ircServerConnection: IrcServerConnection;

    constructor(ircServerConnection: IrcServerConnection) {
        super(`${ircServerConnection.name} (${ircServerConnection.username})`);
        this.ircServerConnection = ircServerConnection;
        this.iconPath = new ThemeIcon('server');
    }
}

export class IrcServerTreeProvider implements TreeDataProvider<IrcServerNode> {
    private ircServerConnections: Array<IrcServerConnection> = [];
    private event = new EventEmitter<IrcServerNode | undefined | null | void>();

    readonly onDidChangeTreeData = this.event.event;

    constructor(ircServerConnections: Array<IrcServerConnection>) {
        this.ircServerConnections = ircServerConnections;
    }

    update(ircServerConnections: IrcServerConnection[]) {
        this.ircServerConnections = ircServerConnections;
        this.event.fire();
    }

    getTreeItem(element: IrcServerNode): TreeItem | Thenable<TreeItem> {
        return element;
    }

    getChildren(element?: IrcServerNode | undefined): IrcServerNode[] {
        return this.ircServerConnections.map(ircServerConnection => new IrcServerNode(ircServerConnection));
    }

    getItems() {
        return this.ircServerConnections;
    }
}
