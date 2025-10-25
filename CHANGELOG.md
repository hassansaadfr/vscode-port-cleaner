# Change Log

All notable changes to the "Port Cleaner" extension will be documented in this file.

## [1.0.0] - 2025-01-25

### Initial Release

#### Features
- **Cross-Platform Port Scanning**: Monitor open ports on Windows, macOS, and Linux
- **Real-Time Auto-Refresh**: Automatically updates port list every 3 seconds
- **Smart System Filtering**: Filters 111+ system ports and 95+ system processes
  - Well-known ports (0-1023): SSH, HTTP, HTTPS, DNS, FTP, etc.
  - Registered system ports: MySQL, MS SQL, NFS, etc.
  - Platform-specific processes (kernel tasks, system daemons, etc.)
- **Search & Filter**: Quickly find ports by number, process name, or PID
- **Hierarchical Tree View**: Expandable port details showing:
  - Protocol (TCP/UDP)
  - Port number
  - Process name and PID
  - Binding address (IP)
  - Full command line arguments
- **Color-Coded Protocols**: Visual distinction with TCP (blue) and UDP (purple) icons
- **Process Management**: Kill processes directly from the extension with confirmation dialog
- **Configurable Settings**:
  - Toggle system port/process filtering on/off
  - Customize system port range threshold

#### Architecture
- Modular codebase with separated concerns:
  - Platform-specific scanners (Windows/macOS/Linux)
  - System port/process filters
  - IP address extraction utilities
  - Reusable constants and models

#### Supported Commands
- `portCleaner.refresh` - Manually refresh port list
- `portCleaner.search` - Search and filter ports
- `portCleaner.clearSearch` - Clear active filters
- `portCleaner.toggleSystemProcesses` - Show/hide system ports
- `portCleaner.killProcess` - Terminate process using a port

#### Requirements
- VS Code 1.75.0 or higher
- Operating System: Windows 10+, macOS 10.13+, or Linux (any modern distro)

---

## Future Enhancements

Planned features for upcoming releases:
- Export port list to CSV/JSON
- Port usage history and statistics
- Custom port monitoring with alerts
- Detailed network traffic information
- Dark/Light theme customization
