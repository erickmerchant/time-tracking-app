'use strict'
const electron = require('electron')
const assert = require('assert')
const ipcMain = electron.ipcMain
const app = electron.app

const Store = require('electron-store')
const store = new Store({
  defaults: {
    tasks: [
      { title: 'Cooking' },
      { title: 'Cleaning' },
      { title: 'Dishes' },
      { title: 'Laundry' },
      { title: 'Blogging' },
      { title: 'Paying Bills' }
    ]
  }
})

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')()

// Prevent window being garbage collected
let mainWindow

function onClosed () {
  // Dereference the window
  // For multiple windows store them in an array
  mainWindow = null
}

function createMainWindow () {
  const win = new electron.BrowserWindow({
    width: 600,
    height: 400,
    backgroundColor: '#DDDDDD'
  })

  win.loadURL(`file://${__dirname}/index.html`)
  win.on('closed', onClosed)

  return win
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    mainWindow = createMainWindow()
  }
})

app.on('ready', () => {
  mainWindow = createMainWindow()
})

ipcMain.on('search', function (e, term) {
  assert.equal(typeof term, 'string')

  e.sender.send('search', store.get('tasks', []).filter((task) => task.title.toLowerCase().indexOf(term.toLowerCase()) > -1))
})
