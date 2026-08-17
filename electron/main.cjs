const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let backendProcess;

function startBackend() {
  const backendExe = path.join(
    process.resourcesPath,
    "backend",
    "NexDocBackend.exe",
  );

  backendProcess = spawn(backendExe, [], {
    windowsHide: true,
  });

  backendProcess.on("error", (error) => {
    console.error("Failed to start backend:", error);
  });
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1200,
    minHeight: 800,
  });

  const indexPath = path.join(app.getAppPath(), "dist", "index.html");
  win.loadFile(indexPath);
}

app.whenReady().then(() => {
  startBackend();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
