import { QuickPickItem, ThemeIcon } from 'vscode';
import { Server } from '../types/server';

export function serverToQuickPickItem(server: Server): QuickPickItem {
    return {
        label: `${server.name} (${server.username})`,
        detail: server.host,
        iconPath: new ThemeIcon('server')
    };
}
