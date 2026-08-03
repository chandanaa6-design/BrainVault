const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

let backendProcess;

function startBackend() {

    let backendExecutable;
    let backendArgs;
    let backendOptions = {
        windowsHide: true
    };

    if (app.isPackaged) {

        backendExecutable = path.join(process.resourcesPath, "backend.exe");

        console.log("Resources Path:", process.resourcesPath);
        console.log("Backend Path:", backendExecutable);
        console.log("Exists:", fs.existsSync(backendExecutable));

        backendArgs = [];

    } else {

        // Development
        backendExecutable = "python";
        backendArgs = [
            "-m",
            "uvicorn",
            "app.main:app",
            "--host",
            "127.0.0.1",
            "--port",
            "8000"
        ];

        backendOptions.cwd = path.join(__dirname, "..", "backend");
    }

    console.log("Starting backend:", backendExecutable);

    backendProcess = spawn(
        backendExecutable,
        backendArgs,
        backendOptions
    );

    backendProcess.stdout.on("data", data => {
        console.log(data.toString());
    });

    backendProcess.stderr.on("data", data => {
        console.error(data.toString());
    });

    backendProcess.on("error", err => {
        console.error("Backend failed to start:");
        console.error(err);
    });

    backendProcess.on("exit", code => {
        console.log("Backend exited with code:", code);
    });
}

function createWindow() {

    const win = new BrowserWindow({
        width: 1400,
        height: 900,
        autoHideMenuBar: true
    });

    // Comment this line before releasing if you don't want DevTools.
    win.webContents.openDevTools();

    if (app.isPackaged) {
        win.loadFile(path.join(__dirname, "dist", "index.html"));
    } else {
        win.loadURL("http://localhost:5173");
    }
}

app.whenReady().then(() => {

    startBackend();

    setTimeout(() => {
        createWindow();
    }, 3000);

});

app.on("window-all-closed", () => {

    if (backendProcess) {
        backendProcess.kill();
    }

    app.quit();

});