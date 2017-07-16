const {ipcRenderer} = require('electron')

module.exports = function (seed) {
  seed(function (commit) {
    ipcRenderer.on('search', function (e, tasks) {
      commit((state) => {
        state.tasks = tasks

        return state
      })
    })

    ipcRenderer.send('search', '')

    return {
      tasks: [],
      term: ''
    }
  })

  return function (commit, action, arg) {
    switch (action) {
      case 'add':
        ipcRenderer.send('add', arg)
        break

      case 'remove':
        ipcRenderer.send('remove', arg)
        break

      case 'pause':
        ipcRenderer.send('pause', arg)
        break

      case 'reset':
        ipcRenderer.send('reset', arg)
        break

      case 'resume':
        ipcRenderer.send('resume', arg)
        break
    }

    commit((state) => {
      if (action === 'search') {
        state.term = arg
      }

      ipcRenderer.send('search', state.term)

      return state
    })
  }
}
