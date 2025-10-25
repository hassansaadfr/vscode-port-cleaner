/**
 * Extracts and normalizes IP address from a full address string (format: IP:PORT)
 * @param addressFull The full address string (e.g., "*:8080", "127.0.0.1:3000", "[::]:5000")
 * @returns The normalized IP address (replaces * with 0.0.0.0, extracts IPv6 from brackets)
 */
export function extractIPAddress(addressFull: string): string {
    // Extract IP address (before the port)
    const ipMatch = addressFull.match(/^(.+):(\d+)$/);
    let address = '0.0.0.0';

    if (ipMatch) {
        const ip = ipMatch[1];

        // Replace * with 0.0.0.0, or handle IPv6
        if (ip === '*') {
            address = '0.0.0.0';
        } else if (ip.startsWith('[') && ip.endsWith(']')) {
            // IPv6 format [::]:PORT -> extract ::
            address = ip.substring(1, ip.length - 1);
        } else {
            address = ip;
        }
    }

    return address;
}

/**
 * Extracts binary name from a command string
 * @param command The full command string with path and arguments
 * @returns Just the binary filename without path or arguments
 */
export function extractBinaryName(command: string): string {
    if (!command) {
        return 'Unknown';
    }

    // Split by spaces to get the first part (the binary path)
    const parts = command.trim().split(/\s+/);
    let binaryPath = parts[0];

    // Extract just the filename from the path
    // Handle both Unix (/) and Windows (\) path separators
    const pathParts = binaryPath.split(/[/\\]/);
    const binaryName = pathParts[pathParts.length - 1];

    // Return only the binary name, no arguments
    return binaryName;
}
