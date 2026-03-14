const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  controlWindow: (action) => {
    console.log("[PRELOAD] Sending action:", action);
    ipcRenderer.send("window-control", action);
  },
  saveProducts: (items) => ipcRenderer.invoke("save-products", items),
  loadProducts: () => ipcRenderer.invoke("load-products"),
  savePasscode: (code) => ipcRenderer.invoke("save-passcode", code),
  loadPasscode: () => ipcRenderer.invoke("load-passcode"),
});
