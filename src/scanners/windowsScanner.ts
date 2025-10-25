import { exec } from 'child_process';
import { promisify } from 'util';
import { PortInfo } from '../models/portInfo';
import { extractIPAddress } from '../utils/addressExtractor';

const execAsync = promisify(exec);

/**
 * Scans open ports on Windows using netstat and wmic
 * @returns Array of PortInfo objects
 */
export async function scanPortsWindows(): Promise<PortInfo[]> {
    const ports: PortInfo[] = [];

    try {
        // Get network connections
        const { stdout } = await execAsync('netstat -ano');
        const lines = stdout.split('\n');

        // Map to store PID -> process info
        const pidToProcess = new Map<string, { name: string; args: string }>();

        // Get process list with command lines
        try {
            const { stdout: wmicOutput } = await execAsync('wmic process get ProcessId,Name,CommandLine /format:csv');
            const wmicLines = wmicOutput.split('\n').slice(1); // Skip header

            for (const line of wmicLines) {
                const parts = line.trim().split(',');
                if (parts.length >= 3) {
                    const cmdLine = parts[1] || '';
                    const name = parts[2] || '';
                    const pid = parts[3]?.trim() || '';

                    if (pid && name) {
                        pidToProcess.set(pid, { name, args: cmdLine });
                    }
                }
            }
        } catch (wmicError) {
            console.error('Error getting process info:', wmicError);
        }

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);

            if (parts.length >= 5 && (parts[0] === 'TCP' || parts[0] === 'UDP')) {
                const protocol = parts[0];
                const addressFull = parts[1];
                const pid = parts[4];

                // Extract port from address (format: 0.0.0.0:PORT or [::]:PORT)
                const portMatch = addressFull.match(/:(\d+)$/);
                if (portMatch && pid !== '0') {
                    const port = portMatch[1];
                    const address = extractIPAddress(addressFull);
                    const processInfo = pidToProcess.get(pid) || { name: 'Unknown', args: '' };

                    ports.push({
                        port,
                        pid,
                        processName: processInfo.name,
                        args: processInfo.args,
                        protocol,
                        address
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error scanning Windows ports:', error);
    }

    return ports;
}
