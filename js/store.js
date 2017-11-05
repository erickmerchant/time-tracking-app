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
