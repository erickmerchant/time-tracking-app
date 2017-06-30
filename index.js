'use strict'
const electron = require('electron')
const assert = require('assert')
const ipcMain = electron.ipcMain
const app = electron.app

const Store = require('electron-store')
const store = new Store({
  defaults: {
    tasks: []
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
    backgroundColor: '#DFDFDF',
    show: false
  })

  win.loadURL(`file://${__dirname}/index.html`)

  win.once('ready-to-show', () => {
    win.show()
  })

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

ipcMain.on('search', function (e, title) {
  assert.equal(typeof title, 'string')

  const tasks = store.get('tasks', [])

  const results = title.trim() !== '' ? tasks.filter((task) => task.title.toLowerCase().indexOf(title.toLowerCase()) > -1) : tasks

  e.sender.send('search', results)
})

ipcMain.on('add', function (e, title) {
  assert.equal(typeof title, 'string')

  let tasks = store.get('tasks', [])

  tasks = tasks.concat([{title}])

  store.set('tasks', tasks)
})
