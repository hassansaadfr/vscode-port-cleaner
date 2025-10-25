import * as vscode from 'vscode';
import { extractBinaryName } from './utils/addressExtractor';

export class PortTreeItem extends vscode.TreeItem {
    public readonly port: string;
    public readonly pid: string;
    public readonly processName: string;
    public readonly args: string;
    public readonly protocol: string;
    public readonly address: string;
    public readonly isDetail: boolean;

    constructor(
        port: string,
        pid: string,
        processName: string,
        args: string,
        protocol: string,
        address: string,
        isDetail: boolean = false,
        detailLabel?: string
    ) {
        // If this is a detail item (child), show the labeled detail
        if (isDetail && detailLabel) {
            super(detailLabel, vscode.TreeItemCollapsibleState.None);
        } else {
            // Parent item - show summary
            const cleanCommand = extractBinaryName(args || processName);
            super(`Port ${port} - ${cleanCommand}`, vscode.TreeItemCollapsibleState.Collapsed);
        }

        // Initialize properties
        this.port = port;
        this.pid = pid;
        this.processName = processName;
        this.args = args;
        this.protocol = protocol;
        this.address = address;
        this.isDetail = isDetail;

        // Configure detail vs parent item
        if (isDetail) {
            this.contextValue = 'portDetail';
            this.iconPath = new vscode.ThemeIcon('circle-filled', new vscode.ThemeColor('descriptionForeground'));
        } else {
            // Rich tooltip with icons and formatting
            this.tooltip = new vscode.MarkdownString();
            this.tooltip.appendMarkdown(`### $(${protocol === 'TCP' ? 'plug' : 'radio-tower'}) Port Information\n\n`);
            this.tooltip.appendMarkdown(`**Port:** \`${port}\`  \n`);
            this.tooltip.appendMarkdown(`**Protocol:** ${protocol}  \n`);
            this.tooltip.appendMarkdown(`**Address:** ${address}  \n`);
            this.tooltip.appendMarkdown(`**PID:** ${pid}  \n`);
            this.tooltip.appendMarkdown(`**Process:** ${processName}  \n\n`);
            if (args) {
                this.tooltip.appendMarkdown(`**Full Command:**  \n\`${args}\`  \n`);
            }
            this.tooltip.isTrusted = true;

            this.contextValue = 'portItem';

            // Set icon and color based on protocol
            if (protocol === 'TCP') {
                this.iconPath = new vscode.ThemeIcon('plug', new vscode.ThemeColor('charts.blue'));
            } else if (protocol === 'UDP') {
                this.iconPath = new vscode.ThemeIcon('radio-tower', new vscode.ThemeColor('charts.purple'));
            } else {
                this.iconPath = new vscode.ThemeIcon('network', new vscode.ThemeColor('charts.green'));
            }
        }

        this.description = '';
    }
}
