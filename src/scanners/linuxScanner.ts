import { exec } from 'child_process';
import { promisify } from 'util';
import { PortInfo } from '../models/portInfo';
import { extractIPAddress } from '../utils/addressExtractor';

const execAsync = promisify(exec);

/**
 * Scans open ports on Linux using ss or netstat
 * @returns Array of PortInfo objects
 */
export async function scanPortsLinux(): Promise<PortInfo[]> {
    const ports: PortInfo[] = [];

    try {
        // Try ss first (more modern), fallback to netstat
        let stdout: string;
        try {
            const result = await execAsync('ss -tulpn');
            stdout = result.stdout;
        } catch (ssError) {
            const result = await execAsync('netstat -tulpn');
            stdout = result.stdout;
        }

        const lines = stdout.split('\n').slice(1); // Skip header

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);

            if (parts.length >= 5) {
                const protocol = parts[0];
                const addressFull = parts[4];

                // Extract port from address (format: 0.0.0.0:PORT or [::]:PORT)
                const portMatch = addressFull.match(/:(\d+)$/);
                if (portMatch) {
                    const port = portMatch[1];
                    const address = extractIPAddress(addressFull);

                    // Extract PID and process name from last column (format: users:(("process",pid=1234,fd=3)))
                    let pid = '';
                    let processName = 'Unknown';
                    let args = '';

                    const processInfo = parts[parts.length - 1];
                    const pidMatch = processInfo.match(/pid=(\d+)/);
                    const nameMatch = processInfo.match(/\("([^"]+)"/);

                    if (pidMatch) {
                        pid = pidMatch[1];
                    }
                    if (nameMatch) {
                        processName = nameMatch[1];
                    }

                    // Get full command line
                    if (pid) {
                        try {
                            const { stdout: cmdlineOutput } = await execAsync(`ps -p ${pid} -o command=`);
                            args = cmdlineOutput.trim();
                        } catch (psError) {
                            args = processName;
                        }
                    }

                    if (pid) {
                        ports.push({
                            port,
                            pid,
                            processName,
                            args,
                            protocol: protocol.toUpperCase(),
                            address
                        });
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error scanning Linux ports:', error);
    }

    return ports;
}
