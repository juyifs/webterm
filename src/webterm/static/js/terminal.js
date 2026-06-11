/**
 * WebTerm - xterm.js client with WebSocket connection
 */

// Theme definitions
const themes = {
    'catppuccin-mocha': {
        background: '#1e1e2e',
        foreground: '#cdd6f4',
        cursor: '#f5e0dc',
        cursorAccent: '#1e1e2e',
        selectionBackground: '#45475a',
        selectionForeground: '#cdd6f4',
        black: '#45475a',
        red: '#f38ba8',
        green: '#a6e3a1',
        yellow: '#f9e2af',
        blue: '#89b4fa',
        magenta: '#f5c2e7',
        cyan: '#94e2d5',
        white: '#bac2de',
        brightBlack: '#585b70',
        brightRed: '#f38ba8',
        brightGreen: '#a6e3a1',
        brightYellow: '#f9e2af',
        brightBlue: '#89b4fa',
        brightMagenta: '#f5c2e7',
        brightCyan: '#94e2d5',
        brightWhite: '#a6adc8',
    },
    'catppuccin-latte': {
        background: '#eff1f5',
        foreground: '#4c4f69',
        cursor: '#dc8a78',
        cursorAccent: '#eff1f5',
        selectionBackground: '#acb0be',
        selectionForeground: '#4c4f69',
        black: '#5c5f77',
        red: '#d20f39',
        green: '#40a02b',
        yellow: '#df8e1d',
        blue: '#1e66f5',
        magenta: '#ea76cb',
        cyan: '#179299',
        white: '#acb0be',
        brightBlack: '#6c6f85',
        brightRed: '#d20f39',
        brightGreen: '#40a02b',
        brightYellow: '#df8e1d',
        brightBlue: '#1e66f5',
        brightMagenta: '#ea76cb',
        brightCyan: '#179299',
        brightWhite: '#bcc0cc',
    },
    'dracula': {
        background: '#282a36',
        foreground: '#f8f8f2',
        cursor: '#f8f8f2',
        cursorAccent: '#282a36',
        selectionBackground: '#44475a',
        selectionForeground: '#f8f8f2',
        black: '#21222c',
        red: '#ff5555',
        green: '#50fa7b',
        yellow: '#f1fa8c',
        blue: '#bd93f9',
        magenta: '#ff79c6',
        cyan: '#8be9fd',
        white: '#f8f8f2',
        brightBlack: '#6272a4',
        brightRed: '#ff6e6e',
        brightGreen: '#69ff94',
        brightYellow: '#ffffa5',
        brightBlue: '#d6acff',
        brightMagenta: '#ff92df',
        brightCyan: '#a4ffff',
        brightWhite: '#ffffff',
    },
    'nord': {
        background: '#2e3440',
        foreground: '#d8dee9',
        cursor: '#d8dee9',
        cursorAccent: '#2e3440',
        selectionBackground: '#434c5e',
        selectionForeground: '#d8dee9',
        black: '#3b4252',
        red: '#bf616a',
        green: '#a3be8c',
        yellow: '#ebcb8b',
        blue: '#81a1c1',
        magenta: '#b48ead',
        cyan: '#88c0d0',
        white: '#e5e9f0',
        brightBlack: '#4c566a',
        brightRed: '#bf616a',
        brightGreen: '#a3be8c',
        brightYellow: '#ebcb8b',
        brightBlue: '#81a1c1',
        brightMagenta: '#b48ead',
        brightCyan: '#8fbcbb',
        brightWhite: '#eceff4',
    },
    'tokyo-night': {
        background: '#1a1b26',
        foreground: '#c0caf5',
        cursor: '#c0caf5',
        cursorAccent: '#1a1b26',
        selectionBackground: '#33467c',
        selectionForeground: '#c0caf5',
        black: '#15161e',
        red: '#f7768e',
        green: '#9ece6a',
        yellow: '#e0af68',
        blue: '#7aa2f7',
        magenta: '#bb9af7',
        cyan: '#7dcfff',
        white: '#a9b1d6',
        brightBlack: '#414868',
        brightRed: '#f7768e',
        brightGreen: '#9ece6a',
        brightYellow: '#e0af68',
        brightBlue: '#7aa2f7',
        brightMagenta: '#bb9af7',
        brightCyan: '#7dcfff',
        brightWhite: '#c0caf5',
    },
};

// CSS variables for each theme (for UI elements)
const themeCssVars = {
    'catppuccin-mocha': {
        '--ctp-base': '#1e1e2e',
        '--ctp-mantle': '#181825',
        '--ctp-surface0': '#313244',
        '--ctp-surface1': '#45475a',
        '--ctp-surface2': '#585b70',
        '--ctp-text': '#cdd6f4',
        '--ctp-subtext0': '#a6adc8',
        '--ctp-blue': '#89b4fa',
        '--ctp-green': '#a6e3a1',
        '--ctp-yellow': '#f9e2af',
        '--ctp-red': '#f38ba8',
    },
    'catppuccin-latte': {
        '--ctp-base': '#eff1f5',
        '--ctp-mantle': '#e6e9ef',
        '--ctp-surface0': '#ccd0da',
        '--ctp-surface1': '#bcc0cc',
        '--ctp-surface2': '#acb0be',
        '--ctp-text': '#4c4f69',
        '--ctp-subtext0': '#6c6f85',
        '--ctp-blue': '#1e66f5',
        '--ctp-green': '#40a02b',
        '--ctp-yellow': '#df8e1d',
        '--ctp-red': '#d20f39',
    },
    'dracula': {
        '--ctp-base': '#282a36',
        '--ctp-mantle': '#21222c',
        '--ctp-surface0': '#343746',
        '--ctp-surface1': '#44475a',
        '--ctp-surface2': '#6272a4',
        '--ctp-text': '#f8f8f2',
        '--ctp-subtext0': '#bfbfbf',
        '--ctp-blue': '#bd93f9',
        '--ctp-green': '#50fa7b',
        '--ctp-yellow': '#f1fa8c',
        '--ctp-red': '#ff5555',
    },
    'nord': {
        '--ctp-base': '#2e3440',
        '--ctp-mantle': '#272c36',
        '--ctp-surface0': '#3b4252',
        '--ctp-surface1': '#434c5e',
        '--ctp-surface2': '#4c566a',
        '--ctp-text': '#eceff4',
        '--ctp-subtext0': '#d8dee9',
        '--ctp-blue': '#81a1c1',
        '--ctp-green': '#a3be8c',
        '--ctp-yellow': '#ebcb8b',
        '--ctp-red': '#bf616a',
    },
    'tokyo-night': {
        '--ctp-base': '#1a1b26',
        '--ctp-mantle': '#16161e',
        '--ctp-surface0': '#232433',
        '--ctp-surface1': '#33467c',
        '--ctp-surface2': '#414868',
        '--ctp-text': '#c0caf5',
        '--ctp-subtext0': '#a9b1d6',
        '--ctp-blue': '#7aa2f7',
        '--ctp-green': '#9ece6a',
        '--ctp-yellow': '#e0af68',
        '--ctp-red': '#f7768e',
    },
};

const PERFORMANCE_PROFILES = {
    'low-latency': {
        label: 'Low Latency',
        inputFlushMinMs: 2,
        inputFlushMaxMs: 10,
        inputImmediateThreshold: 192,
        outputRenderChunkSize: 96 * 1024,
        fastScrollMultiplier: 7,
        scrollSensitivity: 1.8,
        fastScrollSensitivity: 7,
        smoothScrollDuration: 0,
    },
    balanced: {
        label: 'Balanced',
        inputFlushMinMs: 2,
        inputFlushMaxMs: 16,
        inputImmediateThreshold: 256,
        outputRenderChunkSize: 128 * 1024,
        fastScrollMultiplier: 8,
        scrollSensitivity: 2,
        fastScrollSensitivity: 8,
        smoothScrollDuration: 0,
    },
    throughput: {
        label: 'High Throughput',
        inputFlushMinMs: 4,
        inputFlushMaxMs: 24,
        inputImmediateThreshold: 512,
        outputRenderChunkSize: 196 * 1024,
        fastScrollMultiplier: 10,
        scrollSensitivity: 2.4,
        fastScrollSensitivity: 10,
        smoothScrollDuration: 0,
    },
    reading: {
        label: 'Reading / Fast Scroll',
        inputFlushMinMs: 4,
        inputFlushMaxMs: 24,
        inputImmediateThreshold: 512,
        outputRenderChunkSize: 220 * 1024,
        fastScrollMultiplier: 16,
        scrollSensitivity: 3,
        fastScrollSensitivity: 12,
        smoothScrollDuration: 0,
    },
};

/**
 * Toast Notification Manager
 */
class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
    }

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        // Icon based on type
        let icon = '';
        switch (type) {
            case 'success': icon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>'; break;
            case 'error': icon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>'; break;
            case 'warning': icon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>'; break;
            default: icon = '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/></svg>';
        }

        toast.innerHTML = `${icon}<span>${message}</span>`;
        this.container.appendChild(toast);

        // Remove after duration
        setTimeout(() => {
            toast.classList.add('hiding');
            toast.addEventListener('animationend', () => {
                toast.remove();
            });
        }, duration);
    }

    success(message) { this.show(message, 'success'); }
    error(message) { this.show(message, 'error', 4000); }
    info(message) { this.show(message, 'info'); }
    warning(message) { this.show(message, 'warning'); }
}

/**
 * Command Palette
 */
class CommandPalette {
    constructor(terminalApp) {
        this.app = terminalApp;
        this.overlay = document.getElementById('command-palette-overlay');
        this.input = document.getElementById('command-input');
        this.list = document.getElementById('command-list');
        this.isHidden = true;
        this.selectedIndex = 0;
        this.commands = [
            { id: 'toggle-explorer', name: 'Toggle File Explorer', action: () => this.app.toggleExplorer() },
            { id: 'open-settings', name: 'Open Settings', action: () => this.app.openSettings() },
            { id: 'cycle-performance', name: 'Cycle Performance Profile', action: () => this.app.cyclePerformanceProfile() },
            { id: 'reload-terminal', name: 'Reload Terminal', action: () => window.location.reload() },
            { id: 'clear-terminal', name: 'Clear Terminal', action: () => this.app.terminal.clear() },
            { id: 'scroll-top', name: 'Scroll To Top', action: () => this.app.terminal.scrollToTop() },
            { id: 'scroll-bottom', name: 'Scroll To Bottom', action: () => this.app.terminal.scrollToBottom() },
            { id: 'upload-file', name: 'Upload File', action: () => this.app.fileInput.click() },
            { id: 'toggle-pip', name: 'Toggle System Monitor', action: () => this.app.togglePip() },
            {
                id: 'copy-selection', name: 'Copy Selection', action: () => {
                    const selection = this.app.terminal.getSelection();
                    if (selection) {
                        navigator.clipboard.writeText(selection)
                            .then(() => this.app.toast.success('Copied to clipboard'))
                            .catch(() => this.app.toast.error('Failed to copy'));
                    } else {
                        this.app.toast.info('No selection to copy');
                    }
                }
            },
        ];

        this.initEvents();
    }

    initEvents() {
        // Toggle on Ctrl+Shift+P or Cmd+Shift+P
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
                e.preventDefault();
                this.toggle();
            }
            // Close on Escape
            if (e.key === 'Escape' && !this.isHidden) {
                this.hide();
            }
            // Navigation
            if (!this.isHidden) {
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.selectNext();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.selectPrev();
                } else if (e.key === 'Enter') {
                    e.preventDefault();
                    this.executeSelected();
                }
            }
        });

        // Close on click outside
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) this.hide();
        });

        // Filter commands
        this.input.addEventListener('input', () => this.renderList());
    }

    toggle() {
        if (this.isHidden) this.show(); else this.hide();
    }

    show() {
        this.isHidden = false;
        this.overlay.classList.remove('hidden');
        this.input.value = '';
        this.input.focus();
        this.renderList();
    }

    hide() {
        this.isHidden = true;
        this.overlay.classList.add('hidden');
        this.app.terminal.focus();
    }

    renderList() {
        const query = this.input.value.toLowerCase();
        const matches = this.commands.filter(cmd => cmd.name.toLowerCase().includes(query));

        this.list.innerHTML = matches.map((cmd, index) => `
            <div class="command-item ${index === 0 ? 'selected' : ''}" data-index="${index}">
                <span>${cmd.name}</span>
                ${index < 9 ? `<span class="command-shortcut">↵</span>` : ''}
            </div>
        `).join('');

        this.selectedIndex = 0;

        // Add click handlers
        this.list.querySelectorAll('.command-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                matches[index].action();
                this.hide();
            });
            item.addEventListener('mouseenter', () => {
                this.selectedIndex = index;
                this.updateSelection();
            });
        });
    }

    updateSelection() {
        const items = this.list.querySelectorAll('.command-item');
        items.forEach((item, index) => {
            if (index === this.selectedIndex) item.classList.add('selected');
            else item.classList.remove('selected');
        });

        // Scroll into view
        const selected = items[this.selectedIndex];
        if (selected) {
            selected.scrollIntoView({ block: 'nearest' });
        }
    }

    selectNext() {
        const count = this.list.children.length;
        if (count === 0) return;
        this.selectedIndex = (this.selectedIndex + 1) % count;
        this.updateSelection();
    }

    selectPrev() {
        const count = this.list.children.length;
        if (count === 0) return;
        this.selectedIndex = (this.selectedIndex - 1 + count) % count;
        this.updateSelection();
    }

    executeSelected() {
        const query = this.input.value.toLowerCase();
        const matches = this.commands.filter(cmd => cmd.name.toLowerCase().includes(query));
        if (matches[this.selectedIndex]) {
            matches[this.selectedIndex].action();
            this.hide();
        }
    }
}

/**
 * WebTerminal Main Class
 */
class WebTerminal {
    constructor() {
        this.terminal = null;
        this.fitAddon = null;
        this.webLinksAddon = null;
        this.socket = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 10;
        this.reconnectDelay = 1000;
        this.isConnected = false;

        // Components
        this.toast = new ToastManager();
        this.commandPalette = null;

        // UI Elements
        this.statusElement = document.getElementById('connection-status');
        this.cpuElement = document.getElementById('cpu-usage');
        this.memElement = document.getElementById('mem-usage');
        this.gpuElement = document.getElementById('gpu-usage');
        this.perfIndicator = document.getElementById('perf-indicator');
        this.perfMetrics = document.getElementById('perf-metrics');
        this.themeSelect = document.getElementById('theme-select');
        this.loadingOverlay = document.getElementById('loading-overlay');

        // Settings
        this.settingsModal = document.getElementById('settings-modal');
        this.settingsBtn = document.getElementById('settings-btn');
        this.settingsClose = document.getElementById('settings-close');
        this.settingsSave = document.getElementById('settings-save');
        this.settingFontSize = document.getElementById('setting-font-size');
        this.settingCursorStyle = document.getElementById('setting-cursor-style');
        this.settingCursorBlink = document.getElementById('setting-cursor-blink');
        this.settingPerformanceProfile = document.getElementById('setting-performance-profile');
        this.settingCursorColorEnabled = document.getElementById('setting-cursor-color-enabled');
        this.settingCursorColorRgb = document.getElementById('setting-cursor-color-rgb');
        this.settingCursorColorOpacity = document.getElementById('setting-cursor-color-opacity');

        // State
        this.currentTheme = localStorage.getItem('webterm-theme') || 'catppuccin-mocha';
        const savedSettings = localStorage.getItem('webterm-settings');
        this.settings = savedSettings ? JSON.parse(savedSettings) : {
            fontSize: 14,
            performanceProfile: 'balanced',
            cursorStyle: 'block',
            cursorBlink: true,
            cursorColorEnabled: false,
            cursorColorRgb: '',
            cursorColorOpacity: 100
        };

        if (!Object.prototype.hasOwnProperty.call(this.settings, 'cursorColorEnabled')) {
            this.settings.cursorColorEnabled = Boolean((this.settings.cursorColorRgb || '').trim());
        }

        if (!Object.prototype.hasOwnProperty.call(this.settings, 'performanceProfile')) {
            this.settings.performanceProfile = 'balanced';
        }

        if (!PERFORMANCE_PROFILES[this.settings.performanceProfile]) {
            this.settings.performanceProfile = 'balanced';
        }

        if (!Object.prototype.hasOwnProperty.call(this.settings, 'cursorColorRgb')) {
            this.settings.cursorColorRgb = '';
        }

        if (!Object.prototype.hasOwnProperty.call(this.settings, 'cursorColorOpacity')) {
            this.settings.cursorColorOpacity = 100;
        }

        const normalizedStoredCursorColor = this.normalizeHexColorInput(this.settings.cursorColorRgb);
        this.settings.cursorColorRgb = normalizedStoredCursorColor === null ? '' : normalizedStoredCursorColor;
        const normalizedStoredOpacity = this.normalizeOpacityInput(this.settings.cursorColorOpacity);
        this.settings.cursorColorOpacity = normalizedStoredOpacity === null ? 100 : normalizedStoredOpacity;

        // PiP panel elements
        this.pipPanel = document.getElementById('stats-pip');
        this.pipClose = document.querySelector('.pip-close');
        this.pipCpuBar = document.getElementById('pip-cpu-bar');
        this.pipCpuCores = document.getElementById('pip-cpu-cores');
        this.pipMemBar = document.getElementById('pip-mem-bar');
        this.pipMemDetails = document.getElementById('pip-mem-details');
        this.pipProcesses = document.getElementById('pip-processes');
        this.pipVisible = false;

        // File explorer elements
        this.explorerToggle = document.getElementById('explorer-toggle');
        this.fileExplorer = document.getElementById('file-explorer');
        this.explorerPath = document.getElementById('explorer-path');
        this.fileList = document.getElementById('file-list');
        this.uploadBtn = document.getElementById('upload-btn');
        this.refreshBtn = document.getElementById('refresh-btn');
        this.backBtn = document.getElementById('back-btn');
        this.fileInput = document.getElementById('file-input');
        this.dropZone = document.getElementById('drop-zone');
        this.explorerVisible = false;
        this.currentPath = '~';
        this.pathHistory = [];

        // Clipboard state
        this.autoCopyEnabled = true;
        this.lastAutoCopiedSelection = '';
        this.autoCopyTimer = null;

        // Buffer trailing partial ANSI sequences between websocket chunks.
        this.outputSanitizeRemainder = '';

        // Input micro-batching reduces per-keystroke websocket overhead
        // while keeping typing latency effectively real-time.
        this.inputBuffer = '';
        this.inputFlushTimer = null;
        this.inputFlushIntervalMs = 8;
        this.inputFlushMinMs = 2;
        this.inputFlushMaxMs = 16;
        this.inputImmediateThreshold = 256;
        this.rttMs = 30;
        this.rttPingTimer = null;
        this.perfMetricsTimer = null;

        // Binary protocol reduces JSON overhead for high-frequency terminal I/O.
        this.protocolVersion = 2;
        this.binaryProtocolEnabled = false;
        this.binaryProtocolReady = false;
        this.binOutputFrame = 0x01;
        this.binInputFrame = 0x10;
        this.textEncoder = new TextEncoder();
        this.textDecoder = new TextDecoder();

        // Render output in frame-sized chunks for smoother UI during heavy streaming.
        this.pendingTerminalOutput = '';
        this.outputRenderScheduled = false;
        this.outputRenderChunkSize = 128 * 1024;

        // Large text navigation tuning.
        this.fastScrollMultiplier = 8;
    }

    init() {
        // Apply Settings Logic
        this.initSettings();

        // Initialize terminal with saved settings
        this.terminal = new Terminal({
            theme: this.getEffectiveTheme(this.currentTheme),
            fontFamily: "'JetBrainsMono Nerd Font Mono', 'Menlo', 'Monaco', 'Consolas', monospace",
            fontSize: this.settings.fontSize,
            lineHeight: 1.2,
            cursorBlink: this.settings.cursorBlink,
            cursorStyle: this.settings.cursorStyle,
            cursorInactiveStyle: 'block',
            scrollback: 10000,
            scrollSensitivity: 2,
            fastScrollSensitivity: 8,
            fastScrollModifier: 'alt',
            smoothScrollDuration: 0,
            convertEol: false,
            allowProposedApi: true,
        });

        // Apply CSS variables for current theme
        this.applyCssTheme(this.currentTheme);
        this.themeSelect.value = this.currentTheme;

        // Initialize addons
        this.fitAddon = new FitAddon.FitAddon();
        this.webLinksAddon = new WebLinksAddon.WebLinksAddon();

        this.terminal.loadAddon(this.fitAddon);
        this.terminal.loadAddon(this.webLinksAddon);

        // Load clipboard addon if available
        if (typeof ClipboardAddon !== 'undefined') {
            this.clipboardAddon = new ClipboardAddon.ClipboardAddon();
            this.terminal.loadAddon(this.clipboardAddon);
        }

        // Open terminal in container
        const container = document.getElementById('terminal');
        this.terminal.open(container);
        this.fitAddon.fit();
        this.terminal.focus();

        const ensureTerminalFocus = () => this.terminal.focus();
        container.addEventListener('mousedown', ensureTerminalFocus);
        container.addEventListener('wheel', ensureTerminalFocus, { passive: true });
        this.initFastScrollShortcuts();

        if (this.perfIndicator) {
            this.perfIndicator.addEventListener('click', () => this.cyclePerformanceProfile());
        }

        this.applyPerformanceProfile(this.settings.performanceProfile, false);
        this.updatePerformanceBadge();

        // Initialize Command Palette
        this.commandPalette = new CommandPalette(this);

        // Set up clipboard support with keyboard shortcuts
        this.setupClipboard();

        // Handle input
        this.terminal.onData((data) => {
            this.queueInput(data);
        });

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());
        this.terminal.onResize(({ rows, cols }) => {
            this.send({ type: 'resize', rows: rows, cols: cols });
        });

        // Handle theme change
        this.themeSelect.addEventListener('change', (e) => {
            this.setTheme(e.target.value);
        });

        // Handle PiP panel toggle
        this.cpuElement.addEventListener('click', () => this.togglePip());
        this.memElement.addEventListener('click', () => this.togglePip());
        this.pipClose.addEventListener('click', () => this.hidePip());

        // Make PiP draggable
        this.initPipDrag();

        // File explorer setup
        this.initFileExplorer();

        // Connect to WebSocket
        this.connect();

        this.startPerfMetricsTicker();
    }

    initSettings() {
        // Populate inputs
        this.settingFontSize.value = this.settings.fontSize;
        this.settingPerformanceProfile.value = this.settings.performanceProfile;
        this.settingCursorStyle.value = this.settings.cursorStyle;
        this.settingCursorBlink.checked = this.settings.cursorBlink;
        this.settingCursorColorEnabled.checked = this.settings.cursorColorEnabled;
        this.settingCursorColorRgb.value = this.settings.cursorColorRgb || '';
        this.settingCursorColorOpacity.value = String(this.settings.cursorColorOpacity ?? 100);
        this.updateCursorColorControls();
        this.themeSelect.value = this.currentTheme;

        // Events
        this.settingsBtn.addEventListener('click', () => this.openSettings());
        this.settingsClose.addEventListener('click', () => this.settingsModal.classList.add('hidden'));
        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.settingsModal.classList.add('hidden');
        });

        this.settingCursorColorEnabled.addEventListener('change', () => {
            this.updateCursorColorControls();
        });

        this.settingsSave.addEventListener('click', () => {
            const cursorColorEnabled = this.settingCursorColorEnabled.checked;
            let normalizedColor = this.normalizeHexColorInput(this.settingCursorColorRgb.value);
            const normalizedOpacity = this.normalizeOpacityInput(this.settingCursorColorOpacity.value);
            if (cursorColorEnabled) {
                if (!normalizedColor) {
                    this.toast.error('Enter hex color when custom cursor color is enabled');
                    return;
                }
                if (normalizedColor === null) {
                    this.toast.error('Invalid hex color. Use format like #f5e0dc');
                    return;
                }
                if (normalizedOpacity === null) {
                    this.toast.error('Invalid opacity. Use 0-100');
                    return;
                }
            } else {
                if (normalizedColor === null) {
                    normalizedColor = this.settings.cursorColorRgb || '';
                }
            }

            this.settings.fontSize = parseInt(this.settingFontSize.value);
            this.settings.performanceProfile = this.settingPerformanceProfile.value;
            this.settings.cursorStyle = this.settingCursorStyle.value;
            this.settings.cursorBlink = this.settingCursorBlink.checked;
            this.settings.cursorColorEnabled = cursorColorEnabled;
            this.settings.cursorColorRgb = normalizedColor;
            this.settings.cursorColorOpacity = normalizedOpacity === null ? this.settings.cursorColorOpacity : normalizedOpacity;
            this.settingCursorColorRgb.value = normalizedColor;
            this.settingCursorColorOpacity.value = String(this.settings.cursorColorOpacity);

            // Save
            localStorage.setItem('webterm-settings', JSON.stringify(this.settings));

            // Apply
            this.terminal.options.fontSize = this.settings.fontSize;
            this.terminal.options.cursorStyle = this.settings.cursorStyle;
            this.terminal.options.cursorBlink = this.settings.cursorBlink;
            this.terminal.options.theme = this.getEffectiveTheme(this.currentTheme);
            this.applyCssTheme(this.currentTheme);
            this.applyPerformanceProfile(this.settings.performanceProfile, false);

            // Refit
            this.fitAddon.fit();

            this.settingsModal.classList.add('hidden');
            this.toast.success('Settings saved');
        });
    }

    updateCursorColorControls() {
        const enabled = this.settingCursorColorEnabled.checked;
        this.settingCursorColorRgb.disabled = !enabled;
        this.settingCursorColorOpacity.disabled = !enabled;
    }

    openSettings() {
        this.settingsModal.classList.remove('hidden');
    }

    applyPerformanceProfile(profileName, showToast = true) {
        const profile = PERFORMANCE_PROFILES[profileName] || PERFORMANCE_PROFILES.balanced;

        this.settings.performanceProfile = profileName in PERFORMANCE_PROFILES ? profileName : 'balanced';
        this.inputFlushMinMs = profile.inputFlushMinMs;
        this.inputFlushMaxMs = profile.inputFlushMaxMs;
        this.inputImmediateThreshold = profile.inputImmediateThreshold;
        this.outputRenderChunkSize = profile.outputRenderChunkSize;
        this.fastScrollMultiplier = profile.fastScrollMultiplier;

        if (this.terminal) {
            this.terminal.options.scrollSensitivity = profile.scrollSensitivity;
            this.terminal.options.fastScrollSensitivity = profile.fastScrollSensitivity;
            this.terminal.options.smoothScrollDuration = profile.smoothScrollDuration;
        }

        if (this.settingPerformanceProfile) {
            this.settingPerformanceProfile.value = this.settings.performanceProfile;
        }

        this.updatePerformanceBadge();
        if (showToast) {
            this.toast.info(`Performance profile: ${profile.label}`);
        }
    }

    cyclePerformanceProfile() {
        const profiles = Object.keys(PERFORMANCE_PROFILES);
        const currentIndex = Math.max(0, profiles.indexOf(this.settings.performanceProfile));
        const nextProfile = profiles[(currentIndex + 1) % profiles.length];
        this.applyPerformanceProfile(nextProfile, true);
        localStorage.setItem('webterm-settings', JSON.stringify(this.settings));
    }

    updatePerformanceBadge() {
        if (this.perfIndicator) {
            const profile = PERFORMANCE_PROFILES[this.settings.performanceProfile] || PERFORMANCE_PROFILES.balanced;
            this.perfIndicator.textContent = `PERF: ${profile.label}`;
        }
    }

    startPerfMetricsTicker() {
        this.stopPerfMetricsTicker();
        this.perfMetricsTimer = setInterval(() => this.updatePerfMetrics(), 800);
        this.updatePerfMetrics();
    }

    stopPerfMetricsTicker() {
        if (!this.perfMetricsTimer) {
            return;
        }
        clearInterval(this.perfMetricsTimer);
        this.perfMetricsTimer = null;
    }

    updatePerfMetrics() {
        if (!this.perfMetrics) {
            return;
        }

        const bufferedBytes = this.socket ? this.socket.bufferedAmount : 0;
        const queueBytes = this.pendingTerminalOutput.length;
        const protocol = this.binaryProtocolEnabled ? 'BIN' : 'JSON';
        this.perfMetrics.textContent = `RTT ${this.rttMs.toFixed(0)}ms | BUF ${Math.round(bufferedBytes / 1024)}KB | Q ${Math.round(queueBytes / 1024)}KB | ${protocol}`;
    }

    togglePip() {
        if (this.pipVisible) {
            this.hidePip();
        } else {
            this.showPip();
        }
    }

    showPip() {
        this.pipPanel.classList.remove('hidden');
        this.pipVisible = true;
        // Request detailed stats
        this.send({ type: 'stats_detail', enabled: true });
    }

    hidePip() {
        this.pipPanel.classList.add('hidden');
        this.pipVisible = false;
        // Disable detailed stats to reduce server load
        this.send({ type: 'stats_detail', enabled: false });
    }

    initPipDrag() {
        const header = this.pipPanel.querySelector('.pip-header');
        let isDragging = false;
        let startX, startY, startLeft, startBottom;

        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('pip-close')) return;
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = this.pipPanel.getBoundingClientRect();
            startLeft = rect.left;
            startBottom = window.innerHeight - rect.bottom;
            header.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            const newLeft = Math.max(0, Math.min(window.innerWidth - this.pipPanel.offsetWidth, startLeft + dx));
            const newBottom = Math.max(40, Math.min(window.innerHeight - this.pipPanel.offsetHeight - 32, startBottom - dy));
            this.pipPanel.style.left = `${newLeft}px`;
            this.pipPanel.style.right = 'auto';
            this.pipPanel.style.bottom = `${newBottom}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            header.style.cursor = 'move';
        });
    }

    setupClipboard() {
        // Shared copy helper for manual and auto-copy paths.
        const copyToClipboard = (text, { showSuccessToast = true } = {}) => {
            if (!text) return;

            navigator.clipboard.writeText(text)
                .then(() => {
                    if (showSuccessToast) {
                        this.toast.success('Copied to clipboard');
                    }
                })
                .catch((err) => {
                    console.error('Failed to copy:', err);
                    this.toast.error('Failed to copy to clipboard');
                });
        };

        // Handle OSC52 clipboard sequences (used by tmux set-clipboard).
        const registerOsc52Handler = () => {
            if (!this.terminal?.parser?.registerOscHandler) {
                return;
            }

            this.terminal.parser.registerOscHandler(52, (data) => {
                if (!data) return true;

                const separatorIndex = data.indexOf(';');
                if (separatorIndex === -1) return true;

                const payload = data.slice(separatorIndex + 1);
                if (!payload || payload === '?') return true;

                try {
                    const binary = atob(payload);
                    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
                    const text = new TextDecoder().decode(bytes);
                    copyToClipboard(text, { showSuccessToast: true });
                } catch (err) {
                    console.error('Failed to handle OSC52 clipboard payload:', err);
                }

                return true;
            });
        };

        registerOsc52Handler();

        // Custom key event handler for clipboard operations
        this.terminal.attachCustomKeyEventHandler((event) => {
            // Ctrl+Shift+X: Copy (user custom shortcut)
            if (event.ctrlKey && event.shiftKey && event.key === 'X') {
                if (event.type === 'keydown') {
                    const selection = this.terminal.getSelection();
                    if (selection) {
                        copyToClipboard(selection);
                    }
                }
                return false; // Prevent default
            }

            // Ctrl+Shift+V: Paste
            if (event.ctrlKey && event.shiftKey && event.key === 'V') {
                if (event.type === 'keydown') {
                    navigator.clipboard.readText().then(text => {
                        this.queueInput(text);
                        this.flushInputBuffer();
                    }).catch(err => {
                        console.error('Failed to paste:', err);
                        this.toast.error('Failed to read from clipboard');
                    });
                }
                return false; // Prevent default
            }

            // Let other keys pass through
            return true;
        });

        // Right-click context menu for copy/paste
        this.terminal.element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            const selection = this.terminal.getSelection();
            if (selection) {
                // If there's a selection, copy it
                copyToClipboard(selection);
            } else {
                // If no selection, paste
                navigator.clipboard.readText().then(text => {
                    this.queueInput(text);
                    this.flushInputBuffer();
                }).catch(err => this.toast.error('Failed to paste'));
            }
        });

        // Auto-copy when selection changes (e.g. mouse drag selection).
        this.terminal.onSelectionChange(() => {
            if (!this.autoCopyEnabled) return;

            const selection = this.terminal.getSelection();
            if (!selection || selection === this.lastAutoCopiedSelection) return;

            if (this.autoCopyTimer) {
                clearTimeout(this.autoCopyTimer);
            }

            this.autoCopyTimer = setTimeout(() => {
                const currentSelection = this.terminal.getSelection();
                if (!currentSelection || currentSelection !== selection) return;

                this.lastAutoCopiedSelection = currentSelection;
                copyToClipboard(currentSelection, { showSuccessToast: true });
            }, 80);
        });
    }

    setTheme(themeName) {
        if (!themes[themeName]) return;

        this.currentTheme = themeName;
        localStorage.setItem('webterm-theme', themeName);

        // Update terminal theme
        this.terminal.options.theme = this.getEffectiveTheme(themeName);

        // Update CSS variables for UI
        this.applyCssTheme(themeName);
    }

    applyCssTheme(themeName) {
        const vars = themeCssVars[themeName];
        if (!vars) return;

        const root = document.documentElement;
        for (const [key, value] of Object.entries(vars)) {
            root.style.setProperty(key, value);
        }

        // Keep cursor styling available to CSS overrides.
        root.style.setProperty('--wt-cursor', this.getEffectiveCursorColor(themeName));
    }

    normalizeHexColorInput(value) {
        if (typeof value !== 'string') {
            return '';
        }

        const input = value.trim();
        if (!input) {
            return '';
        }

        const hexMatch = input.match(/^#?([0-9a-f]{3}|[0-9a-f]{6})$/i);
        if (hexMatch) {
            let hex = hexMatch[1];
            if (hex.length === 3) {
                hex = hex.split('').map((c) => c + c).join('');
            }
            return `#${hex.toLowerCase()}`;
        }

        // Backward compatibility: normalize legacy RGB input to hex.
        let parts;
        const rgbMatch = input.match(/^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/i);
        if (rgbMatch) {
            parts = rgbMatch.slice(1, 4).map((v) => Number.parseInt(v, 10));
        } else {
            parts = input.split(',').map((v) => Number.parseInt(v.trim(), 10));
        }

        if (parts.length !== 3 || parts.some((v) => Number.isNaN(v) || v < 0 || v > 255)) {
            return null;
        }

        return `#${parts.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
    }

    normalizeOpacityInput(value) {
        const numberValue = Number.parseFloat(String(value).trim());
        if (Number.isNaN(numberValue) || numberValue < 0 || numberValue > 100) {
            return null;
        }
        return Math.round(numberValue);
    }

    hexToRgbComponents(hexColor) {
        const hex = hexColor.replace('#', '');
        return {
            r: Number.parseInt(hex.slice(0, 2), 16),
            g: Number.parseInt(hex.slice(2, 4), 16),
            b: Number.parseInt(hex.slice(4, 6), 16),
        };
    }

    applyOpacityToColor(hexColor, opacityPercent) {
        const { r, g, b } = this.hexToRgbComponents(hexColor);
        const alpha = Math.max(0, Math.min(1, opacityPercent / 100));
        return `rgba(${r}, ${g}, ${b}, ${alpha.toFixed(2)})`;
    }

    getEffectiveCursorColor(themeName) {
        if (!this.settings.cursorColorEnabled) {
            return themes[themeName].cursor;
        }

        const custom = this.normalizeHexColorInput(this.settings.cursorColorRgb);
        if (!custom) {
            return themes[themeName].cursor;
        }
        const opacity = this.normalizeOpacityInput(this.settings.cursorColorOpacity);
        if (opacity === null) {
            return custom;
        }

        return this.applyOpacityToColor(custom, opacity);
    }

    getEffectiveTheme(themeName) {
        return {
            ...themes[themeName],
            cursor: this.getEffectiveCursorColor(themeName),
        };
    }

    handleResize() {
        if (this.fitAddon) {
            this.fitAddon.fit();
        }
    }

    splitOutputRemainder(data) {
        if (!data) {
            return { processable: '', remainder: '' };
        }

        const lastEsc = data.lastIndexOf('\x1b');
        if (lastEsc === -1) {
            return { processable: data, remainder: '' };
        }

        const tail = data.slice(lastEsc);
        if (!tail.startsWith('\x1b[') && !tail.startsWith('\x1b]') && !tail.startsWith('\x1bPtmux;') && !tail.startsWith('\x1b\x1b[')) {
            return { processable: data, remainder: '' };
        }

        const csiComplete = /^\x1b\[[0-9;? ]*[ -/]*[@-~]/.test(tail);
        const oscComplete = tail.startsWith('\x1b]') && (tail.includes('\x07') || tail.includes('\x1b\\'));
        const tmuxComplete = tail.startsWith('\x1bPtmux;') && tail.includes('\x1b\\');
        const doubledCsiComplete = /^\x1b\x1b\[[0-9;? ]*[ -/]*[@-~]/.test(tail);

        if (csiComplete || oscComplete || tmuxComplete || doubledCsiComplete) {
            return { processable: data, remainder: '' };
        }

        return {
            processable: data.slice(0, lastEsc),
            remainder: tail,
        };
    }

    stripCursorControls(data) {
        if (!data) {
            return data;
        }

        let output = data;

        // Unwrap tmux passthrough and sanitize nested payload.
        output = output.replace(/\x1bPtmux;[\s\S]*?\x1b\\/g, (seq) => {
            const payload = seq.slice(7, -2).replace(/\x1b\x1b/g, '\x1b');
            return this.stripCursorControls(payload);
        });

        // Ignore cursor-shape controls so menu-selected style is authoritative.
        output = output.replace(/\x1b\[[0-9; ]* q/g, '');

        // Drop hide-cursor sequence (including tmux-doubled ESC variant).
        output = output.replace(/(?:\x1b\x1b|\x1b)\[\?25l/g, '');

        return output;
    }

    sanitizeTerminalOutput(data) {
        const combined = this.outputSanitizeRemainder + (data || '');
        this.outputSanitizeRemainder = '';

        const { processable, remainder } = this.splitOutputRemainder(combined);
        this.outputSanitizeRemainder = remainder;

        if (!processable) {
            return '';
        }

        const hadHideCursor = /(?:\x1b\x1b|\x1b)\[\?25l/.test(processable);
        let output = this.stripCursorControls(processable);

        if (hadHideCursor) {
            output += '\x1b[?25h';
        }

        return output;
    }

    connect() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/terminal`;

        this.setStatus('connecting', 'Connecting...');
        this.socket = new WebSocket(wsUrl);
        this.socket.binaryType = 'arraybuffer';
        this.binaryProtocolEnabled = false;
        this.binaryProtocolReady = false;
        this.textDecoder = new TextDecoder();
        this.stopRttPing();

        this.socket.onopen = () => {
            this.reconnectAttempts = 0;
            this.isConnected = true;
            this.setStatus('connected', 'Connected');
            this.loadingOverlay.classList.add('hidden');

            // Negotiate optional binary protocol (falls back to JSON automatically).
            this.send({ type: 'hello', version: this.protocolVersion, binary: true });
            this.startRttPing();

            // Send initial resize
            const { rows, cols } = this.terminal;
            this.send({ type: 'resize', rows: rows, cols: cols });
        };

        this.socket.onmessage = (event) => {
            if (event.data instanceof ArrayBuffer) {
                this.handleBinaryMessage(new Uint8Array(event.data));
                return;
            }

            try {
                const message = JSON.parse(event.data);

                if (message.type === 'output') {
                    this.enqueueTerminalOutput(message.data);
                } else if (message.type === 'protocol') {
                    this.binaryProtocolEnabled = Boolean(message.binary);
                    this.binaryProtocolReady = true;
                } else if (message.type === 'pong') {
                    this.updateRttFromPong(message.t);
                } else if (message.type === 'error') {
                    console.error('Server error:', message.message);
                    this.toast.error(message.message);
                } else if (message.type === 'stats') {
                    this.updateStats(message);
                } else if (message.type === 'cwd') {
                    this.loadDirectory(message.path);
                }
            } catch (e) {
                console.error('Failed to parse message:', e);
            }
        };

        this.socket.onclose = () => {
            this.isConnected = false;
            this.stopRttPing();
            this.setStatus('disconnected', 'Disconnected');
            this.attemptReconnect();
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
            this.isConnected = false;
        };
    }

    handleBinaryMessage(frame) {
        if (!frame || frame.length < 1) {
            return;
        }

        const frameType = frame[0];
        const payload = frame.slice(1);

        if (frameType === this.binOutputFrame) {
            const text = this.textDecoder.decode(payload, { stream: true });
            if (text) {
                this.enqueueTerminalOutput(text);
            }
        }
    }

    enqueueTerminalOutput(rawChunk) {
        const sanitized = this.sanitizeTerminalOutput(rawChunk);
        if (!sanitized) {
            return;
        }

        this.pendingTerminalOutput += sanitized;
        if (this.outputRenderScheduled) {
            return;
        }

        this.outputRenderScheduled = true;
        requestAnimationFrame(() => this.flushTerminalOutputFrame());
    }

    flushTerminalOutputFrame() {
        this.outputRenderScheduled = false;
        if (!this.pendingTerminalOutput) {
            return;
        }

        const chunk = this.pendingTerminalOutput.slice(0, this.outputRenderChunkSize);
        this.pendingTerminalOutput = this.pendingTerminalOutput.slice(chunk.length);
        this.terminal.write(chunk);

        if (this.pendingTerminalOutput) {
            this.outputRenderScheduled = true;
            requestAnimationFrame(() => this.flushTerminalOutputFrame());
        }
    }

    startRttPing() {
        this.stopRttPing();
        this.rttPingTimer = setInterval(() => {
            if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
                return;
            }
            this.send({ type: 'ping', t: performance.now() });
        }, 5000);
    }

    stopRttPing() {
        if (!this.rttPingTimer) {
            return;
        }
        clearInterval(this.rttPingTimer);
        this.rttPingTimer = null;
    }

    updateRttFromPong(sentAt) {
        if (typeof sentAt !== 'number') {
            return;
        }
        const sample = Math.max(1, performance.now() - sentAt);
        this.rttMs = this.rttMs * 0.8 + sample * 0.2;
    }

    updateInputFlushInterval() {
        const base = Math.round(this.rttMs / 4);
        let interval = Math.max(this.inputFlushMinMs, Math.min(this.inputFlushMaxMs, base));

        // If socket write buffer is growing, widen batching to reduce frame pressure.
        if (this.socket && this.socket.bufferedAmount > 256 * 1024) {
            interval = this.inputFlushMaxMs;
        }

        this.inputFlushIntervalMs = interval;
    }

    initFastScrollShortcuts() {
        const terminalElement = this.terminal.element;
        if (!terminalElement) {
            return;
        }

        // Shift+wheel accelerates long-text browsing without affecting normal scroll.
        terminalElement.addEventListener('wheel', (e) => {
            if (!e.shiftKey) {
                return;
            }

            e.preventDefault();
            const delta = e.deltaY > 0 ? 1 : -1;
            this.terminal.scrollLines(delta * this.fastScrollMultiplier);
        }, { passive: false });

        // Alt+PageUp/PageDown for fast jump in long outputs.
        terminalElement.addEventListener('keydown', (e) => {
            if (!e.altKey || (e.key !== 'PageUp' && e.key !== 'PageDown')) {
                if (e.altKey && e.key === 'Home') {
                    e.preventDefault();
                    this.terminal.scrollToTop();
                } else if (e.altKey && e.key === 'End') {
                    e.preventDefault();
                    this.terminal.scrollToBottom();
                }
                return;
            }

            e.preventDefault();
            const page = this.terminal.rows || 24;
            const direction = e.key === 'PageDown' ? 1 : -1;
            this.terminal.scrollLines(direction * page * 3);
        });
    }

    updateStats(stats) {
        // Update header stats
        if (this.cpuElement && stats.cpu !== undefined) {
            this.cpuElement.textContent = `CPU: ${stats.cpu.toFixed(1)}%`;
        }
        if (this.memElement && stats.memory !== undefined) {
            this.memElement.textContent = `MEM: ${stats.memory.toFixed(1)}%`;
        }
        if (this.gpuElement && stats.gpu_name !== undefined) {
            this.gpuElement.style.display = 'flex';
            this.gpuElement.title = stats.gpu_name;
            if (stats.gpu !== null && stats.gpu !== undefined) {
                this.gpuElement.textContent = `GPU: ${stats.gpu.toFixed(1)}%`;
            } else {
                this.gpuElement.textContent = `GPU: N/A`;
            }
        }

        // Update PiP panel if visible and detailed stats available
        if (this.pipVisible) {
            this.updatePipPanel(stats);
        }
    }

    updatePipPanel(stats) {
        // Update CPU bar
        if (this.pipCpuBar && stats.cpu !== undefined) {
            const fill = this.pipCpuBar.querySelector('.pip-bar-fill');
            const text = this.pipCpuBar.querySelector('.pip-bar-text');
            fill.style.width = `${stats.cpu}%`;
            text.textContent = `${stats.cpu.toFixed(1)}%`;
        }

        // Update CPU cores
        if (this.pipCpuCores && stats.cpu_cores) {
            this.pipCpuCores.innerHTML = stats.cpu_cores.map((usage, i) => `
                <div class="pip-core">
                    <div class="pip-core-label">Core ${i}</div>
                    <div class="pip-core-value">${usage.toFixed(0)}%</div>
                </div>
            `).join('');
        }

        // Update memory bar
        if (this.pipMemBar && stats.memory !== undefined) {
            const fill = this.pipMemBar.querySelector('.pip-bar-fill');
            const text = this.pipMemBar.querySelector('.pip-bar-text');
            fill.style.width = `${stats.memory}%`;
            text.textContent = `${stats.memory.toFixed(1)}%`;
        }

        // Update memory details
        if (this.pipMemDetails && stats.mem_total_fmt) {
            this.pipMemDetails.innerHTML = `
                <div class="pip-detail-row">
                    <span>Used</span>
                    <span class="pip-detail-value">${stats.mem_used_fmt}</span>
                </div>
                <div class="pip-detail-row">
                    <span>Free</span>
                    <span class="pip-detail-value">${stats.mem_free_fmt}</span>
                </div>
                <div class="pip-detail-row">
                    <span>Cached</span>
                    <span class="pip-detail-value">${stats.mem_cached_fmt}</span>
                </div>
                <div class="pip-detail-row">
                    <span>Total</span>
                    <span class="pip-detail-value">${stats.mem_total_fmt}</span>
                </div>
            `;
        }

        // Update processes
        if (this.pipProcesses && stats.processes) {
            this.pipProcesses.innerHTML = stats.processes.map(proc => `
                <div class="pip-process">
                    <span class="pip-process-name" title="${proc.name}">${proc.name}</span>
                    <span class="pip-process-cpu">${proc.cpu.toFixed(1)}%</span>
                    <span class="pip-process-mem">${proc.mem.toFixed(1)}%</span>
                </div>
            `).join('');
        }
    }

    attemptReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.setStatus('disconnected', 'Connection failed');
            this.terminal.write('\r\n\x1b[31m[Connection failed. Please refresh the page.]\x1b[0m\r\n');
            this.toast.error('Connection failed permanently. Please reload.');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        this.setStatus('connecting', `Reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);

        // Show loading overlay only on significant disconnects
        if (this.reconnectAttempts > 1) {
            this.loadingOverlay.classList.remove('hidden');
        }

        setTimeout(() => {
            if (this.socket.readyState === WebSocket.CLOSED) {
                this.connect();
            }
        }, Math.min(delay, 30000));
    }

    send(message) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(message));
        }
    }

    queueInput(data) {
        this.updateInputFlushInterval();
        this.inputBuffer += data;

        // Flush immediately for command submit and larger paste bursts.
        if (data.includes('\r') || data.includes('\n') || this.inputBuffer.length >= this.inputImmediateThreshold) {
            this.flushInputBuffer();
            return;
        }

        if (!this.inputFlushTimer) {
            this.inputFlushTimer = setTimeout(() => {
                this.flushInputBuffer();
            }, this.inputFlushIntervalMs);
        }
    }

    flushInputBuffer() {
        if (this.inputFlushTimer) {
            clearTimeout(this.inputFlushTimer);
            this.inputFlushTimer = null;
        }

        if (!this.inputBuffer) {
            return;
        }

        if (!this.sendBinaryInput(this.inputBuffer)) {
            this.send({ type: 'input', data: this.inputBuffer });
        }
        this.inputBuffer = '';
    }

    sendBinaryInput(data) {
        if (!this.binaryProtocolReady || !this.binaryProtocolEnabled) {
            return false;
        }

        if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
            return false;
        }

        try {
            const payload = this.textEncoder.encode(data);
            const frame = new Uint8Array(payload.length + 1);
            frame[0] = this.binInputFrame;
            frame.set(payload, 1);
            this.socket.send(frame);
            return true;
        } catch (e) {
            console.error('Failed to send binary input, falling back to JSON:', e);
            return false;
        }
    }

    setStatus(state, text) {
        if (this.statusElement) {
            this.statusElement.textContent = text;
            this.statusElement.className = state;
        }
    }

    // File Explorer Methods
    initFileExplorer() {
        // Toggle button
        this.explorerToggle.addEventListener('click', () => this.toggleExplorer());

        // Upload button
        this.uploadBtn.addEventListener('click', () => this.fileInput.click());

        // Refresh button
        this.refreshBtn.addEventListener('click', () => this.loadDirectory(this.currentPath));

        // Back button
        this.backBtn.addEventListener('click', () => this.goBack());

        // File input change
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.uploadFiles(e.target.files);
                e.target.value = ''; // Reset input
            }
        });

        // Drag and drop
        this.fileExplorer.addEventListener('dragenter', (e) => {
            e.preventDefault();
            this.dropZone.classList.remove('hidden');
        });

        this.dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            if (e.target === this.dropZone) {
                this.dropZone.classList.add('hidden');
            }
        });

        this.dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        this.dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            this.dropZone.classList.add('hidden');
            if (e.dataTransfer.files.length > 0) {
                this.uploadFiles(e.dataTransfer.files);
            }
        });
    }

    toggleExplorer() {
        if (this.explorerVisible) {
            this.hideExplorer();
        } else {
            this.showExplorer();
        }
    }

    showExplorer() {
        this.fileExplorer.classList.remove('hidden');
        this.explorerToggle.classList.add('active');
        this.explorerVisible = true;
        // Request current working directory from terminal
        this.send({ type: 'get_cwd' });
        // Refit terminal after layout change
        setTimeout(() => this.handleResize(), 50);
    }

    hideExplorer() {
        this.fileExplorer.classList.add('hidden');
        this.explorerToggle.classList.remove('active');
        this.explorerVisible = false;
        // Refit terminal after layout change
        setTimeout(() => this.handleResize(), 50);
    }

    async loadDirectory(path, addToHistory = true) {
        try {
            const url = path ? `/api/files?path=${encodeURIComponent(path)}` : '/api/files';
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Failed to load directory: ${response.statusText}`);
            }

            const data = await response.json();

            // Add current path to history before changing (if not going back)
            if (addToHistory && this.currentPath && this.currentPath !== data.path) {
                this.pathHistory.push(this.currentPath);
            }

            this.currentPath = data.path;
            this.updateBackButton();
            this.renderFileList(data);
        } catch (error) {
            console.error('Failed to load directory:', error);
            this.fileList.innerHTML = `<div class="file-item" style="color: var(--ctp-red);">Error: ${error.message}</div>`;
            this.toast.error(`Error loading files: ${error.message}`);
        }
    }

    goBack() {
        if (this.pathHistory.length > 0) {
            const previousPath = this.pathHistory.pop();
            this.loadDirectory(previousPath, false);
        }
    }

    updateBackButton() {
        this.backBtn.disabled = this.pathHistory.length === 0;
    }

    renderFileList(data) {
        // Update path display
        const displayPath = data.path.replace(/^\/Users\/[^/]+/, '~');
        this.explorerPath.textContent = displayPath;
        this.explorerPath.title = data.path;

        let html = '';

        // Add parent directory link if not at root
        if (data.parent) {
            html += `
                <div class="file-item parent-dir" data-path="${this.escapeHtml(data.parent)}" data-is-dir="true">
                    <span class="file-icon folder">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/>
                        </svg>
                    </span>
                    <span class="file-name">..</span>
                </div>
            `;
        }

        // Add files and folders
        for (const item of data.items) {
            const icon = item.is_dir ? this.getFolderIcon() : this.getFileIcon(item.name);
            const size = item.is_dir ? '' : this.formatSize(item.size);

            html += `
                <div class="file-item" data-path="${this.escapeHtml(item.path)}" data-is-dir="${item.is_dir}">
                    <span class="file-icon ${item.is_dir ? 'folder' : 'file'}">${icon}</span>
                    <span class="file-name" title="${this.escapeHtml(item.name)}">${this.escapeHtml(item.name)}</span>
                    <span class="file-size">${size}</span>
                </div>
            `;
        }

        this.fileList.innerHTML = html;

        // Add click handlers
        this.fileList.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', () => {
                const path = item.dataset.path;
                const isDir = item.dataset.isDir === 'true';

                if (isDir) {
                    this.loadDirectory(path);
                } else {
                    this.downloadFile(path);
                }
            });
        });
    }

    getFolderIcon() {
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M9.828 3h3.982a2 2 0 0 1 1.992 2.181l-.637 7A2 2 0 0 1 13.174 14H2.826a2 2 0 0 1-1.991-1.819l-.637-7a1.99 1.99 0 0 1 .342-1.31L.5 3a2 2 0 0 1 2-2h3.672a2 2 0 0 1 1.414.586l.828.828A2 2 0 0 0 9.828 3zm-8.322.12C1.72 3.042 1.95 3 2.19 3h5.396l-.707-.707A1 1 0 0 0 6.172 2H2.5a1 1 0 0 0-1 .981l.006.139z"/>
        </svg>`;
    }

    getFileIcon(filename) {
        return `<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M4 0h5.293A1 1 0 0 1 10 .293L13.707 4a1 1 0 0 1 .293.707V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.5 1.5v2a1 1 0 0 0 1 1h2l-3-3z"/>
        </svg>`;
    }

    formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    downloadFile(path) {
        const url = `/api/files/download?path=${encodeURIComponent(path)}`;
        const link = document.createElement('a');
        link.href = url;
        link.download = path.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.toast.success(`Downloading ${link.download}...`);
    }

    uploadFiles(files) {
        const formData = new FormData();
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        formData.append('path', this.currentPath);

        this.toast.info('Uploading files...');

        fetch('/api/files/upload', {
            method: 'POST',
            body: formData
        })
            .then(response => {
                if (!response.ok) throw new Error('Upload failed');
                return response.json();
            })
            .then(data => {
                this.toast.success(`Successfully uploaded ${files.length} file(s)`);
                this.loadDirectory(this.currentPath);
            })
            .catch(error => {
                console.error('Error uploading:', error);
                this.toast.error('Failed to upload files');
            });
    }
}

// Initialize terminal app
const terminalApp = new WebTerminal();
terminalApp.init();
