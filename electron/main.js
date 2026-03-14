const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = process.env.NODE_ENV === "development";
let win;

const FILE_PATH = path.join(app.getPath("userData"), "inventory.json");
const PASSCODE_PATH = path.join(app.getPath("userData"), "passcode.json");

ipcMain.handle("save-passcode", (_e, code) => {
  console.log("set password!!");
  fs.writeFileSync(PASSCODE_PATH, JSON.stringify({ code }), "utf-8");
});

ipcMain.handle("load-passcode", () => {
  if (!fs.existsSync(PASSCODE_PATH)) return null;
  try {
    const { code } = JSON.parse(fs.readFileSync(PASSCODE_PATH, "utf-8"));
    return code ?? null;
  } catch {
    return null;
  }
});

ipcMain.handle("save-products", (_event, items) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(items, null, 2), "utf-8");
});

ipcMain.handle("load-products", () => {
  if (!fs.existsSync(FILE_PATH)) return [];
  try {
    return JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
  } catch {
    return [];
  }
});

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 650,
    minHeight: 550,
    minWidth: 512,
    frame: false,
    contextIsolation: true,
    nodeIntegration: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../out/index.html")}`,
  );
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.on("window-control", (event, action) => {
  console.log("[MAIN] Window action:", action);
  if (!win) return;

  if (action === "minimize") win.minimize();
  else if (action === "maximize")
    win.isMaximized() ? win.unmaximize() : win.maximize();
  else if (action === "close") win.close();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
