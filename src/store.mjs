const {ipcRenderer} = require('electron')

module.exports = function (commit) {
  ipcRenderer.on('results', (e, tasks) => {
    commit((state) => {
      state.tasks = tasks

      return state
    })
  })

  ipcRenderer.send('read')

  commit(() => {
    return {
      tasks: [],
      term: '',
      now: Date.now()
    }
  })

  let shouldTick = true

  tick()

  return {
    add(arg) {
      shouldTick = false

      ipcRenderer.send('add', arg)

      commit((state) => {
        state.now = Date.now()

        return state
      })
    },
    remove(arg) {
      shouldTick = false

      ipcRenderer.send('remove', arg)

      commit((state) => {
        state.now = Date.now()

        return state
      })
    },
    toggle(arg) {
      shouldTick = false

      ipcRenderer.send('toggle', arg)

      commit((state) => {
        state.now = Date.now()

        return state
      })
    },
    copy(arg) {
      shouldTick = false

      ipcRenderer.send('copy', arg)

      commit((state) => {
        state.now = Date.now()

        return state
      })
    },
    term(arg) {
      shouldTick = false

      commit((state) => {
        state.term = arg

        state.now = Date.now()

        return state
      })
    }
  }

  function tick() {
    if (shouldTick) {
      commit((state) => {
        state.now = Date.now()

        return state
      })
    }

    shouldTick = true

    setTimeout(tick, 100)
  }
}
