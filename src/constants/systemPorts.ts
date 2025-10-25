// Common system ports to filter out (based on IANA well-known ports and OS-specific ports)
export const SYSTEM_PORTS = {
    // Well-known ports (0-1023) - Common across all OSes - Based on RFC 1700
    common: [
        1,           // tcpmux
        5,           // rje
        7,           // echo
        9,           // discard
        11,          // systat
        13,          // daytime
        17,          // qotd
        18,          // msp
        19,          // chargen
        20, 21,      // FTP data/control
        22,          // SSH
        23,          // Telnet
        25,          // SMTP
        37,          // time
        39,          // rlp
        42,          // nameserver
        43,          // WHOIS
        49,          // TACACS
        50,          // re-mail-ck
        53,          // DNS
        67, 68,      // DHCP server/client
        69,          // TFTP
        70,          // Gopher
        79,          // Finger
        80,          // HTTP
        88,          // Kerberos
        101,         // hostname
        102,         // ISO-TSAP
        105,         // csnet-ns
        107,         // rtelnet
        109,         // POP2
        110,         // POP3
        111,         // SunRPC
        113,         // auth
        115,         // SFTP
        117,         // UUCP-path
        119,         // NNTP
        123,         // NTP
        137, 138, 139, // NetBIOS
        143,         // IMAP
        161, 162,    // SNMP/SNMP trap
        177,         // XDMCP
        179,         // BGP
        194,         // IRC
        199,         // SMUX
        201,         // AppleTalk
        209,         // QMTP
        210,         // Z39.50
        213,         // IPX
        220,         // IMAP3
        369, 370,    // Coda
        389,         // LDAP
        427,         // SLP
        443,         // HTTPS
        444,         // SNPP
        445,         // Microsoft-DS
        464,         // Kerberos password
        500,         // ISAKMP
        512,         // exec/comsat
        513,         // login/who
        514,         // shell/syslog
        515,         // LPD printer
        517, 518,    // talk/ntalk
        520,         // RIP/efs
        521,         // RIPng
        525,         // timed
        530,         // Courier
        531,         // conference
        532,         // netnews
        533,         // netwall
        540,         // UUCP
        543, 544,    // Kerberos login/shell
        546, 547,    // DHCPv6 client/server
        548,         // AFP over TCP
        554,         // RTSP
        556,         // remotefs
        563,         // NNTPS
        587,         // SMTP submission
        631,         // IPP/CUPS
        636,         // LDAPS
        674,         // ACAP
        694,         // ha-cluster
        749, 750,    // Kerberos admin/v4
        873,         // rsync
        992,         // Telnets
        993,         // IMAPS
        995          // POP3S
    ],

    // Registered ports (1024-49151) - Important system services
    registered: [
        1080,        // SOCKS proxy
        1433, 1434,  // MS SQL Server/Monitor
        1494,        // Citrix ICA
        1512,        // WINS
        1524,        // Ingres DBMS
        1701,        // L2TP
        1719, 1720,  // H.323
        1812, 1813,  // RADIUS
        1985,        // HSRP
        2049,        // NFS
        2102, 2103, 2104, // Zephyr
        2401,        // CVS
        2809,        // CORBA
        3306,        // MySQL/MariaDB
        4321,        // rwhois
        5999,        // CVSup
        6000,        // X11
        11371,       // PGP keyserver
        13720, 13721, 13724, 13782, 13783, // Symantec/Veritas
        22273        // wnn6
    ],

    // Windows-specific ports
    windows: [
        135,         // MS-RPC
        137, 138, 139, // NetBIOS (duplicate with common but kept for clarity)
        445,         // SMB over TCP (duplicate with common)
        3389,        // RDP
        5985, 5986   // WinRM
    ],

    // macOS-specific ports
    mac: [
        548,         // AFP (duplicate with common)
        3283,        // Apple Remote Desktop
        5353,        // mDNS/Bonjour
        5900         // VNC/Screen Sharing
    ],

    // Linux-specific ports
    linux: [
        111,         // RPC portmapper (duplicate with common)
        2049,        // NFS (duplicate with registered)
        5353,        // Avahi (mDNS)
        6000         // X11 (duplicate with registered)
    ]
};
