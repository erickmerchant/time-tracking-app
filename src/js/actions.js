const {ipcRenderer, clipboard} = require('electron')
const format = require('./format')

module.exports = function ({dispatch, state}) {
  return {
    initialize () {
      ipcRenderer.send('search', '')

      ipcRenderer.on('search', function (e, tasks) {
        dispatch('add-tasks', {tasks})
      })
    },

    search () {
      dispatch('set-term', {term: this.value})

      ipcRenderer.send('search', this.value)
    },

    add (e) {
      e.preventDefault()

      dispatch('set-term', {term: state.term})

      ipcRenderer.send('add', state.term)

      ipcRenderer.send('search', state.term)
    },

    remove (task) {
      return () => {
        ipcRenderer.send('remove', task.uuid)

        ipcRenderer.send('search', state.term)
      }
    },

    pause (task) {
      return () => {
        ipcRenderer.send('pause', task.uuid)

        ipcRenderer.send('search', state.term)
      }
    },

    copy (task) {
      return () => {
        ipcRenderer.send('reset', task.uuid)

        ipcRenderer.send('search', state.term)

        clipboard.writeText(format(task))
      }
    },

    resume (task) {
      return () => {
        ipcRenderer.send('resume', task.uuid)

        ipcRenderer.send('search', state.term)
      }
    }
  }
}
