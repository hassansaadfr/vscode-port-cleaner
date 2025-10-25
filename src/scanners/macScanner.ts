import { exec } from 'child_process';
import { promisify } from 'util';
import { PortInfo } from '../models/portInfo';
import { extractIPAddress } from '../utils/addressExtractor';

const execAsync = promisify(exec);

/**
 * Scans open ports on macOS using lsof
 * @returns Array of PortInfo objects
 */
export async function scanPortsMac(): Promise<PortInfo[]> {
    const ports: PortInfo[] = [];

    try {
        // Use lsof to get listening ports
        const { stdout } = await execAsync('lsof -iTCP -sTCP:LISTEN -n -P || lsof -iUDP -n -P');
        const lines = stdout.split('\n').slice(1); // Skip header

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);

            if (parts.length >= 9) {
                const processName = parts[0];
                const pid = parts[1];
                const protocol = parts[7];
                const addressFull = parts[8];

                // Extract port from address (format: *:PORT or IP:PORT)
                const portMatch = addressFull.match(/:(\d+)$/);
                if (portMatch) {
                    const port = portMatch[1];
                    const address = extractIPAddress(addressFull);

                    // Get full command line
                    let args = '';
                    try {
                        const { stdout: psOutput } = await execAsync(`ps -p ${pid} -o command=`);
                        args = psOutput.trim();
                    } catch (psError) {
                        args = processName;
                    }

                    ports.push({
                        port,
                        pid,
                        processName,
                        args,
                        protocol: protocol.includes('TCP') ? 'TCP' : 'UDP',
                        address
                    });
                }
            }
        }
    } catch (error) {
        console.error('Error scanning Mac ports:', error);
    }

    return ports;
}
