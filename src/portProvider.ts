import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import { PortInfo } from './models/portInfo';
import { PortTreeItem } from './portTreeItem';
import { isSystemPort, isSystemProcess } from './filters/systemFilter';
import { scanPortsWindows } from './scanners/windowsScanner';
import { scanPortsMac } from './scanners/macScanner';
import { scanPortsLinux } from './scanners/linuxScanner';
import { extractBinaryName } from './utils/addressExtractor';

const execAsync = promisify(exec);

export class PortProvider implements vscode.TreeDataProvider<PortTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<PortTreeItem | undefined | null | void> = new vscode.EventEmitter<PortTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<PortTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private ports: PortInfo[] = [];
    private searchFilter: string = '';

    refresh(): void {
        this.scanPorts().then(() => {
            this._onDidChangeTreeData.fire();
        });
    }

    getTreeItem(element: PortTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: PortTreeItem): Thenable<PortTreeItem[]> {
        if (element) {
            // If this is a detail item, no children
            if (element.isDetail) {
                return Promise.resolve([]);
            }

            // If this is a parent port item, return detail children
            const cleanCommand = extractBinaryName(element.args || element.processName);

            return Promise.resolve([
                new PortTreeItem(
                    element.port,
                    element.pid,
                    element.processName,
                    element.args,
                    element.protocol,
                    element.address,
                    true,
                    `Protocol: ${element.protocol}`
                ),
                new PortTreeItem(
                    element.port,
                    element.pid,
                    element.processName,
                    element.args,
                    element.protocol,
                    element.address,
                    true,
                    `Port: ${element.port}`
                ),
                new PortTreeItem(
                    element.port,
                    element.pid,
                    element.processName,
                    element.args,
                    element.protocol,
                    element.address,
                    true,
                    `Process: ${cleanCommand}`
                ),
                new PortTreeItem(
                    element.port,
                    element.pid,
                    element.processName,
                    element.args,
                    element.protocol,
                    element.address,
                    true,
                    `PID: ${element.pid}`
                ),
                new PortTreeItem(
                    element.port,
                    element.pid,
                    element.processName,
                    element.args,
                    element.protocol,
                    element.address,
                    true,
                    `Address: ${element.address}`
                )
            ]);
        } else {
            let filteredPorts = this.ports;

            // Apply search filter if present
            if (this.searchFilter) {
                const searchLower = this.searchFilter.toLowerCase();
                filteredPorts = this.ports.filter(port => {
                    return port.port.includes(searchLower) ||
                           port.processName.toLowerCase().includes(searchLower) ||
                           port.args.toLowerCase().includes(searchLower) ||
                           port.pid.includes(searchLower);
                });
            }

            return Promise.resolve(
                filteredPorts.map(port =>
                    new PortTreeItem(
                        port.port,
                        port.pid,
                        port.processName,
                        port.args,
                        port.protocol,
                        port.address
                    )
                )
            );
        }
    }

    setSearchFilter(filter: string): void {
        this.searchFilter = filter;
        this._onDidChangeTreeData.fire();
    }

    clearSearch(): void {
        this.searchFilter = '';
        this._onDidChangeTreeData.fire();
    }

    getSearchFilter(): string {
        return this.searchFilter;
    }

    private async scanPorts(): Promise<void> {
        try {
            const platform = process.platform;
            let ports: PortInfo[] = [];

            if (platform === 'win32') {
                ports = await scanPortsWindows();
            } else if (platform === 'darwin') {
                ports = await scanPortsMac();
            } else if (platform === 'linux') {
                ports = await scanPortsLinux();
            }

            this.ports = this.deduplicatePorts(ports);
        } catch (error) {
            console.error('Error scanning ports:', error);
            vscode.window.showErrorMessage(`Error scanning ports: ${error}`);
            this.ports = [];
        }
    }

    private deduplicatePorts(ports: PortInfo[]): PortInfo[] {
        const seen = new Set<string>();
        const unique: PortInfo[] = [];

        // Check if system ports should be hidden
        const config = vscode.workspace.getConfiguration('portCleaner');
        const hideSystemPorts = config.get<boolean>('hideSystemProcesses', true);

        for (const port of ports) {
            const key = `${port.port}-${port.pid}`;
            if (!seen.has(key)) {
                // Skip system ports/processes if filtering is enabled
                if (hideSystemPorts) {
                    // Filter by port number
                    if (isSystemPort(port.port)) {
                        continue;
                    }
                    // Filter by process name
                    if (isSystemProcess(port.processName)) {
                        continue;
                    }
                }
                seen.add(key);
                unique.push(port);
            }
        }

        // Sort by port number
        return unique.sort((a, b) => parseInt(a.port) - parseInt(b.port));
    }

    async killProcess(pid: string): Promise<boolean> {
        try {
            const platform = process.platform;

            if (platform === 'win32') {
                await execAsync(`taskkill /F /PID ${pid}`);
            } else {
                await execAsync(`kill -9 ${pid}`);
            }

            return true;
        } catch (error) {
            console.error('Error killing process:', error);
            return false;
        }
    }
}
