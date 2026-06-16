const { app, BrowserWindow, session } = require("electron");
const path = require("path");

function createWindow() {
  // 1. Criamos uma partição de sessão persistente para salvar cookies do YouTube
  const ses = session.fromPartition("persist:studyapp");

  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      session: ses, // Usando a sessão persistente aqui
      webviewTag: true,
    },
  });

  // 2. Definimos um User-Agent para o YouTube achar que somos um navegador comum
  win.webContents.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  );

  // 3. Liberação de permissões de mídia (Autoplay e Mídia)
  ses.setPermissionRequestHandler((webContents, permission, callback) => {
    if (permission === "media") {
      callback(true);
    } else {
      callback(false);
    }
  });

  win.loadFile(path.join(__dirname, "dist", "index.html"));
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
