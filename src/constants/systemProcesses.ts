// System process names to filter out (only core internal system processes)
export const SYSTEM_PROCESS_NAMES = {
    // macOS internal system processes (daemons and core services only)
    mac: [
        'kernel_task', 'launchd', 'WindowServer', 'mds', 'mdworker',
        'apsd', 'cfprefsd', 'distnoted', 'UserEventAgent',
        'CommCenter', 'coreaudiod', 'bluetoothd', 'airportd', 'mDNSResponder',
        'syslogd', 'configd', 'systemstats', 'rapportd', 'trustd', 'sharingd',
        'netbiosd', 'accountsd', 'analyticsd', 'cloudd', 'coreduetd',
        'diagnosticd', 'fseventsd', 'logd', 'opendirectoryd', 'securityd',
        'socketfilterfw', 'remindd', 'nsurlsessiond', 'symptomsd',
        'usernoted', 'powerd', 'tccd', 'warmd', 'backupd', 'TimeMachine',
        'com.apple.controlcenter', 'ControlCenter'
    ],

    // Windows system processes (core OS processes only)
    windows: [
        'System', 'svchost.exe', 'lsass.exe', 'csrss.exe', 'smss.exe', 'services.exe',
        'wininit.exe', 'winlogon.exe', 'dwm.exe', 'spoolsv.exe', 'taskhost.exe',
        'RuntimeBroker.exe', 'SearchIndexer.exe', 'audiodg.exe', 'conhost.exe',
        'taskhostw.exe', 'sihost.exe', 'fontdrvhost.exe',
        'WmiPrvSE.exe', 'dllhost.exe', 'SearchProtocolHost.exe', 'SearchFilterHost.exe',
        'MsMpEng.exe', 'NisSrv.exe', 'SecurityHealthService.exe'
    ],

    // Linux internal system processes (system daemons only)
    linux: [
        'systemd', 'init', 'kthreadd', 'dbus-daemon', 'systemd-resolve', 'systemd-network',
        'NetworkManager', 'avahi-daemon', 'cupsd', 'rsyslogd', 'syslog', 'cron', 'atd',
        'dhclient', 'wpa_supplicant', 'polkitd', 'rtkit-daemon',
        'accounts-daemon', 'udisksd', 'upowerd', 'ModemManager', 'chronyd',
        'irqbalance', 'rpcbind', 'gssproxy', 'systemd-journal', 'systemd-logind',
        'systemd-udevd', 'systemd-timesync', 'systemd-resolved', 'systemd-timesyncd'
    ]
};
