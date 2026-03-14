interface Window {
    electronAPI?: {
        // windows api control
        controlWindow: (action: 'minimize' | 'maximize' | 'close') => void;
    }
}
