const {ipcRenderer} = require('electron')

module.exports = function (commit) {
  ipcRenderer.on('results', function (e, tasks) {
    commit((state) => {
      state.tasks = tasks

      return state
    })
  })

  ipcRenderer.on('stats', function (e, stats) {
    commit((state) => {
      state.stats = stats

      return state
    })
  })

  ipcRenderer.send('search', '')

  commit(function () {
    return {
      tasks: [],
      stats: {
        active: 0,
        inactive: 0
      },
      term: ''
    }
  })

  tick()

  function tick () {
    commit((state) => state)

    setTimeout(tick, 1000)
  }

  return function (action, arg) {
    commit((state) => {
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

      return state
    })
  }
}
