const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const path = require('node:path');

const menuItems = [
    {
        label: "About",
        submenu: [
            {
                label: "About",
            }
        ]
    },

    {
        label: "File",
        submenu: [
            {
                label: "Github",
                click: async ()=> {
                    // await shell.openExternal("https://instagram.com")
                    const window2 = new BrowserWindow({
                        height: 300,
                        width: 400,
                        show: false,
                    });

                    window2.loadURL("https://github.com");
                    window2.once("ready-to-show", ()=> window2.show());
                },
            },
            {
                type: "separator",
            },
            {
                label: "Exit",
                click: () => app.quit(),
            }
        ]
    },
    
    {
        label: "window",
        submenu: [
            {
                role: "Minimize"
            },
            {
                role: "close",
            }
        ]
    },

    {
        label: "Open Camera",
        submenu: [
           {
            label: "Open Camera",
            click: async ()=> {
                const window2 = new BrowserWindow({
                    height: 500,
                    width: 800,
                    show: false,
                    webPreferences: {
                        preload: path.join(__dirname, 'cameraPreload.js')
                      },
                });
                ipcMain.on("closeWindow2", ()=>{
                    window2.close();
                })

                window2.loadFile("camera.html");
                window2.once("ready-to-show", ()=> window2.show());
            },
           }
        ]
    },
];

const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu);

const createWindow = () => {

    const win = new BrowserWindow({
        height: 500,
        width: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
          },
    });

    ipcMain.on("set-image", (event, data) => {
        win.webContents.send("get-image", data);
       });

    win.loadFile("index.html");
}

app.whenReady().then(()=>{
    createWindow();
})

