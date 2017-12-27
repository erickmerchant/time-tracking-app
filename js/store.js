const {ipcRenderer} = require('electron')

module.exports = function (commit) {
  ipcRenderer.on('results', function (e, tasks) {
    commit(function (state) {
      state.tasks = tasks

      return state
    })
  })

  ipcRenderer.send('search', '')

  commit(function () {
    return {
      tasks: [],
      term: '',
      now: Date.now()
    }
  })

  let shouldTick = true

  tick()

  function tick () {
    if (shouldTick) {
      commit(function (state) {
        state.now = Date.now()

        return state
      })
    }

    shouldTick = true

    setTimeout(tick, 100)
  }

  return function (action, arg) {
    shouldTick = false

    commit(function (state) {
      switch (action) {
        case 'add':
          ipcRenderer.send('add', arg)
          break

        case 'remove':
          ipcRenderer.send('remove', arg)
          break

        case 'toggle':
          ipcRenderer.send('toggle', arg)
          break

        case 'copy':
          ipcRenderer.send('copy', arg)
          break

        case 'search':
          state.term = arg
          break
      }

      ipcRenderer.send('search', state.term)

      state.now = Date.now()

      return state
    })
  }
}
