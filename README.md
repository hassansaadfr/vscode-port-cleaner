# Port Cleaner

A powerful VS Code extension to view, manage, and monitor open network ports across Windows, macOS, and Linux.

## Features

- **Real-time Port Monitoring**: Automatically refreshes every 3 seconds to show the latest port status
- **Cross-Platform Support**: Works seamlessly on Windows, macOS, and Linux
- **Smart System Filtering**: Automatically filters out 111+ system ports and 95+ system processes
- **Kill Process**: Terminate processes using specific ports with a single click
- **Search & Filter**: Quickly find ports by port number, process name, or PID
- **Hierarchical View**: Expandable tree view showing detailed information for each port
- **Color-Coded Protocols**: Visual distinction between TCP (blue) and UDP (purple) connections
- **IP Address Display**: Shows actual binding addresses (0.0.0.0, 127.0.0.1, etc.)

## Usage

1. Install the extension
2. Click on the Port Cleaner icon in the Activity Bar
3. View all open ports in the sidebar
4. Expand any port to see detailed information:
   - Protocol (TCP/UDP)
   - Port Number
   - Process Name
   - Process ID (PID)
   - Binding Address

### Commands

- **Refresh**: Manually refresh the port list
- **Search**: Filter ports by port number, process name, or PID
- **Clear Search**: Remove active search filters
- **Toggle System Filter**: Show/hide system ports and processes
- **Kill Process**: Right-click on any port to terminate its process

## Configuration

Open VS Code Settings and search for "Port Cleaner":

- `portCleaner.hideSystemProcesses` (default: `true`): Hide system ports and processes from the list
- `portCleaner.systemPortMax` (default: `1023`): Maximum port number considered as system port

## System Filtering

The extension intelligently filters:

### Port Numbers

- Well-known ports (0-1023): SSH, HTTP, HTTPS, DNS, FTP, etc.
- Registered system ports (1024+): MySQL, MS SQL, NFS, etc.
- Platform-specific ports: RDP (Windows), AFP/Bonjour (macOS), X11 (Linux)

### System Processes

- **macOS**: kernel_task, launchd, mDNSResponder, WindowServer, etc.
- **Windows**: System, svchost.exe, lsass.exe, services.exe, etc.
- **Linux**: systemd, init, dbus-daemon, NetworkManager, etc.

## Project Structure

```
src/
├── constants/
│   ├── systemPorts.ts         # 111+ system ports definitions
│   └── systemProcesses.ts     # 95 system process names
├── models/
│   └── portInfo.ts            # Port information interface
├── filters/
│   └── systemFilter.ts        # System port/process filtering logic
├── scanners/
│   ├── windowsScanner.ts      # Windows port scanner (netstat)
│   ├── macScanner.ts          # macOS port scanner (lsof)
│   └── linuxScanner.ts        # Linux port scanner (ss/netstat)
├── utils/
│   └── addressExtractor.ts    # IP address and binary name extraction
├── portTreeItem.ts            # Tree view item representation
├── portProvider.ts            # Main data provider
└── extension.ts               # Extension entry point
```

## Requirements

- VS Code 1.75.0 or higher
- Operating System: Windows, macOS, or Linux

## Installation

### From VSIX

1. Download the latest `.vsix` file from releases
2. Open VS Code
3. Press `Cmd+Shift+P` (macOS) or `Ctrl+Shift+P` (Windows/Linux)
4. Type "Install from VSIX"
5. Select the downloaded file

### From Marketplace

Search for "Port Cleaner" in the VS Code Extensions marketplace

## Development

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch for changes
npm run watch

# Package extension
npx @vscode/vsce package
```

## License

MIT License - see [LICENSE](LICENSE) file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Repository

https://github.com/hassansaadfr/vscode-port-cleaner

## Author

hassansaadfr

## Changelog

### 1.0.0

- Initial release
- Cross-platform port scanning
- Auto-refresh every 3 seconds
- System port/process filtering
- Search functionality
- Kill process capability
- Hierarchical tree view
- Color-coded protocol display
- IP address extraction
