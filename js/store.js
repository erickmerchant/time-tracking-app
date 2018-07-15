const {ipcRenderer} = require('electron')

module.exports = function (commit) {
  ipcRenderer.on('results', function (e, tasks) {
    commit(function (state) {
      state.tasks = tasks

      return state
    })
  })

  ipcRenderer.send('read')

  commit(function () {
    return {
      tasks: [],
      term: '',
      now: Date.now()
    }
  })

  let shouldTick = true

  tick()

  return {
    add (arg) {
      shouldTick = false

      ipcRenderer.send('add', arg)

      commit(function (state) {
        state.now = Date.now()

        return state
      })
    },
    remove (arg) {
      shouldTick = false

      ipcRenderer.send('remove', arg)

      commit(function (state) {
        state.now = Date.now()

        return state
      })
    },
    toggle (arg) {
      shouldTick = false

      ipcRenderer.send('toggle', arg)

      commit(function (state) {
        state.now = Date.now()

        return state
      })
    },
    copy (arg) {
      shouldTick = false

      ipcRenderer.send('copy', arg)

      commit(function (state) {
        state.now = Date.now()

        return state
      })
    },
    term (arg) {
      shouldTick = false

      commit(function (state) {
        state.term = arg

        state.now = Date.now()

        return state
      })
    }
  }

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
}
