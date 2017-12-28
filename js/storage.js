const {ipcMain, clipboard} = require('electron')
const assert = require('assert')
const uuidv1 = require('uuid/v1')
const format = require('./format')

const Store = require('electron-store')
const store = new Store({
  defaults: {
    tasks: []
  }
})

module.exports = store

ipcMain.on('read', function (e) {
  const tasks = store.get('tasks', [])

  e.sender.send('results', tasks)
})

ipcMain.on('add', function (e, title) {
  assert.equal(typeof title, 'string')

  let tasks = store.get('tasks', [])

  if (title.trim() !== '') {
    tasks = tasks.map(function (task) {
      if (task.isActive) {
        task.isActive = false

        task.totalTime += Date.now() - task.startTime
      }

      return task
    })

    tasks.unshift({
      uuid: uuidv1(),
      title,
      isActive: true,
      startTime: Date.now(),
      totalTime: 0
    })
  }

  store.set('tasks', tasks)

  e.sender.send('results', tasks)
})

ipcMain.on('remove', function (e, uuid) {
  assert.equal(typeof uuid, 'string')

  let tasks = store.get('tasks', [])

  tasks = tasks.filter((task) => task.uuid !== uuid)

  store.set('tasks', tasks)

  e.sender.send('results', tasks)
})

ipcMain.on('toggle', function (e, uuid) {
  assert.equal(typeof uuid, 'string')

  let tasks = store.get('tasks', [])

  let task = tasks.find((task) => task.uuid === uuid)

  if (task.isActive) {
    task.totalTime += task.isActive ? Date.now() - task.startTime : 0

    task.isActive = false
  } else {
    tasks.forEach(function (task) {
      if (task.isActive) {
        task.isActive = false

        task.totalTime += Date.now() - task.startTime
      }
    })

    task.startTime = !task.isActive ? Date.now() : task.startTime

    task.isActive = true
  }

  store.set('tasks', tasks)

  e.sender.send('results', tasks)
})

ipcMain.on('copy', function (e, uuid) {
  assert.equal(typeof uuid, 'string')

  let tasks = store.get('tasks', [])

  let task = tasks.find((task) => task.uuid === uuid)

  clipboard.writeText(format(task, Date.now()))

  task.startTime = Date.now()

  task.totalTime = 0

  store.set('tasks', tasks)

  e.sender.send('results', tasks)
})
