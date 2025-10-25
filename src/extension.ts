import * as vscode from 'vscode';
import { PortProvider } from './portProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Port Cleaner extension is now active');

    const portProvider = new PortProvider();

    // Register the tree view
    const treeView = vscode.window.createTreeView('portCleaner.portsView', {
        treeDataProvider: portProvider,
        showCollapseAll: false
    });

    // Register refresh command
    const refreshCommand = vscode.commands.registerCommand('portCleaner.refresh', () => {
        portProvider.refresh();
        vscode.window.showInformationMessage('Ports refreshed');
    });

    // Register kill process command
    const killCommand = vscode.commands.registerCommand('portCleaner.killProcess', async (item) => {
        if (item && item.pid) {
            const confirmation = await vscode.window.showWarningMessage(
                `Kill process ${item.processName} (PID: ${item.pid}) on port ${item.port}?`,
                'Yes', 'No'
            );

            if (confirmation === 'Yes') {
                const success = await portProvider.killProcess(item.pid);
                if (success) {
                    vscode.window.showInformationMessage(`Process ${item.pid} killed successfully`);
                    portProvider.refresh();
                } else {
                    vscode.window.showErrorMessage(`Failed to kill process ${item.pid}`);
                }
            }
        }
    });

    // Register toggle system processes command
    const toggleSystemCommand = vscode.commands.registerCommand('portCleaner.toggleSystemProcesses', async () => {
        const config = vscode.workspace.getConfiguration('portCleaner');
        const currentValue = config.get<boolean>('hideSystemProcesses', true);
        await config.update('hideSystemProcesses', !currentValue, vscode.ConfigurationTarget.Global);

        const status = !currentValue ? 'hidden' : 'visible';
        vscode.window.showInformationMessage(`System ports and processes are now ${status}`);
        portProvider.refresh();
    });

    // Register search command
    const searchCommand = vscode.commands.registerCommand('portCleaner.search', async () => {
        const currentFilter = portProvider.getSearchFilter();
        const searchTerm = await vscode.window.showInputBox({
            prompt: 'Search ports by port number, process name, or PID',
            placeHolder: 'e.g., 3000, node, chrome',
            value: currentFilter
        });

        if (searchTerm !== undefined) {
            portProvider.setSearchFilter(searchTerm);
            if (searchTerm) {
                vscode.window.showInformationMessage(`Filtering ports: "${searchTerm}"`);
            }
        }
    });

    // Register clear search command
    const clearSearchCommand = vscode.commands.registerCommand('portCleaner.clearSearch', () => {
        portProvider.clearSearch();
        vscode.window.showInformationMessage('Search filter cleared');
    });

    // Auto-refresh every 3 seconds
    const refreshTimer = setInterval(() => {
        portProvider.refresh();
    }, 3000);

    context.subscriptions.push(
        treeView,
        refreshCommand,
        killCommand,
        toggleSystemCommand,
        searchCommand,
        clearSearchCommand,
        { dispose: () => clearInterval(refreshTimer) }
    );

    // Auto-refresh on activation
    portProvider.refresh();
}

export function deactivate() {}
