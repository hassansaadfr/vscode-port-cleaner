import * as vscode from 'vscode';
import { SYSTEM_PORTS } from '../constants/systemPorts';
import { SYSTEM_PROCESS_NAMES } from '../constants/systemProcesses';

/**
 * Checks if a port number is a system port
 * @param portNumber The port number as a string
 * @returns true if the port is a system port, false otherwise
 */
export function isSystemPort(portNumber: string): boolean {
    const port = parseInt(portNumber);
    const platform = process.platform;

    // Build list of system ports to check
    // Include common well-known ports and registered system service ports
    let systemPorts: number[] = [...SYSTEM_PORTS.common, ...SYSTEM_PORTS.registered];

    // Add platform-specific ports
    if (platform === 'win32') {
        systemPorts = systemPorts.concat(SYSTEM_PORTS.windows);
    } else if (platform === 'darwin') {
        systemPorts = systemPorts.concat(SYSTEM_PORTS.mac);
    } else if (platform === 'linux') {
        systemPorts = systemPorts.concat(SYSTEM_PORTS.linux);
    }

    // Check if port is in the system ports list
    if (systemPorts.includes(port)) {
        return true;
    }

    // Also check custom range from configuration (for additional filtering)
    const config = vscode.workspace.getConfiguration('portCleaner');
    const maxSystemPort = config.get<number>('systemPortMax', 1023);

    // If port is in well-known range (0-1023), also consider it as system port
    return port >= 0 && port <= maxSystemPort;
}

/**
 * Checks if a process name is a system process
 * @param processName The process name to check
 * @returns true if the process is a system process, false otherwise
 */
export function isSystemProcess(processName: string): boolean {
    const platform = process.platform;
    let systemProcesses: string[] = [];

    // Get platform-specific system process names
    if (platform === 'win32') {
        systemProcesses = SYSTEM_PROCESS_NAMES.windows;
    } else if (platform === 'darwin') {
        systemProcesses = SYSTEM_PROCESS_NAMES.mac;
    } else if (platform === 'linux') {
        systemProcesses = SYSTEM_PROCESS_NAMES.linux;
    }

    // Check if process name matches any system process (case-insensitive)
    const lowerProcessName = processName.toLowerCase();
    return systemProcesses.some(sysProc =>
        lowerProcessName.includes(sysProc.toLowerCase())
    );
}
