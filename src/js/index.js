const {ipcRenderer} = require('electron')
const framework = require('@erickmerchant/framework')
const assert = require('assert')
const html = require('bel')
const diff = require('nanomorph')
const target = document.body

framework({target, store, component, diff})(function ({dispatch}) {
  ipcRenderer.on('search', function (e, tasks) {
    dispatch('add-tasks', {tasks})
  })

  dispatch()
})

function component ({state, dispatch, next}) {
  return html`
  <body class="min-height-100vh background-white dark-gray">
    <form class="typesize-x-large flex column">
      <input id="input" onkeyup="${search}" value="${state.term}" class="border-radius placeholder-light-gray padding-2 margin-1" placeholder="What are you doing?" />
    </form>
    <ul>${state.tasks.map((task) => html`<li>${task.title}</li>`)}</ul>
  </body>`

  function search (e) {
    if (e.keyCode === 13) {
      // add
      e.preventDefault()
    } else if(e.keyCode === 27) {
      // escape
    } else {
      // search
      dispatch('set-term', {term: this.value})

      ipcRenderer.send('search', this.value)
    }
  }
}

function store (state = {
  tasks: [],
  term: ''
}, action, args) {
  switch (action) {
    case 'set-term':
      state.term = args.term
      break
    case 'add-tasks':
      state.tasks = args.tasks
      break
  }

  return state
}
