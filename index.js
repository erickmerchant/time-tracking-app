'use strict'
const {app, BrowserWindow, Menu} = require('electron')
const store = require('./js/storage')

require('electron-debug')()

let mainWindow

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

  var template = [
    {
      label: 'Time Tracker',
      submenu: [
        {role: 'quit'}
      ]
    },
    {
      label: 'Edit',
      submenu: [
        {role: 'cut'},
        {role: 'copy'},
        {role: 'paste'}
      ]
    }
  ]

  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
})

function createMainWindow () {
  const win = new BrowserWindow({
    width: 700,
    height: 500,
    backgroundColor: '#DFDFDF',
    show: false
  })

  win.loadURL(`file://${__dirname}/index.html`)

  win.once('ready-to-show', () => {
    win.show()
  })

  win.on('closed', () => {
    let tasks = store.get('tasks', [])

    tasks = tasks.map((task) => {
      if (task.isActive) {
        task.isActive = false

        task.totalTime += Date.now() - task.startTime
      }

      return task
    })

    store.set('tasks', tasks)

    mainWindow = null
  })

  return win
}
