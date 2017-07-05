const {ipcRenderer, clipboard} = require('electron')
const framework = require('@erickmerchant/framework')
const ift = require('@erickmerchant/ift')('')
const html = require('bel')
const diff = require('nanomorph')
const target = document.body
const UNITS = [
  {
    value: 1000 * 60 * 60 * 8 * 5,
    label: 'w'
  },
  {
    value: 1000 * 60 * 60 * 8,
    label: 'd'
  },
  {
    value: 1000 * 60 * 60,
    label: 'h'
  },
  {
    value: 1000 * 60,
    label: 'm'
  }
]
const classes = {
  root: 'border-box min-height-100vh margin-0 background-white dark-gray font-size-medium',
  form: 'flex row padding-2 font-size-large background-light-gray border-bottom border-light-gray border-1',
  input: 'auto padding-2 margin-1 border-radius border border-2 border-gray background-white placeholder-gray',
  buttons: {
    add: 'inline-block padding-2 margin-1 background-white border-radius border border-green green'
  },
  results: 'padding-2 margin-0 list-style-none',
  item: {
    root: 'margin-1 padding-0 border-left border-5',
    col1: 'inline-block width-3 padding-2',
    col2: 'inline-block width-2',
    col3: 'inline-block width-3 align-right',
    buttons: {
      remove: 'inline-block padding-1 margin-horizontal-1 background-white border-radius border border-red red font-size-small',
      copy: 'inline-block padding-1 margin-horizontal-1 background-white border-radius border border-dark-gray dark-gray font-size-small',
      pause: 'inline-block padding-1 margin-horizontal-1 background-white border-radius border font-size-small border-blue blue',
      resume: 'inline-block padding-1 margin-horizontal-1 background-white border-radius border font-size-small border-gray gray'
    }
  },
  noresults: 'padding-1 align-center'
}

framework({target, diff, component, store})(initialize)

function component ({state, dispatch, next}) {
  return html`
  <body class="${classes.root}">
    <form onsubmit="${add}" class="${classes.form}">
      <input onkeyup="${search}" value="${state.term}" name="input" placeholder="What are you doing?" class="${classes.input}" />
      <button type="submit" class="${classes.buttons.add}">
        Add
      </button>
    </form>
    ${ift(state.tasks.length,
      () => html`<ul class="${classes.results}">
          ${state.tasks.map((task) => {
            return html`<li class="${classes.item.root} ${ift(task.isActive, 'border-blue', 'border-gray')}" tabindex="0">
              <span class="${classes.item.col1}">${task.title}</span>
              <span class="${classes.item.col2}">${format(task)}</span>
              <span class="${classes.item.col3}">
                ${ift(task.isActive, () => html`<button type="button" onclick=${pause(task)} class="${classes.item.buttons.pause}">
                  Pause
                </button>`)}
                ${ift(!task.isActive, () => html`<button type="button" onclick=${copy(task)} class="${classes.item.buttons.copy}">
                  Copy
                </button>`)}
                ${ift(!task.isActive, () => html`<button type="button" onclick=${resume(task)} class="${classes.item.buttons.resume}">
                  Resume
                </button>`)}
                <button type="button" onclick=${remove(task)} class="${classes.item.buttons.remove}">
                  Remove
                </button>
              </span>
            </li>`
          })}
        </ul>`,
      ift(state.term === '',
        () => html`<p class="${classes.noresults}">You're not tracking anything yet.</p>`,
        () => html`<p class="${classes.noresults}">No results.</p>`
      )
    )}
  </body>`

  function search (e) {
    dispatch('set-term', {term: this.value})

    ipcRenderer.send('search', this.value)
  }

  function add (e) {
    e.preventDefault()

    dispatch('set-term', {term: state.term})

    ipcRenderer.send('add', state.term)

    ipcRenderer.send('search', state.term)
  }

  function remove (task) {
    return function (e) {
      ipcRenderer.send('remove', task.uuid)

      ipcRenderer.send('search', state.term)
    }
  }

  function pause (task) {
    return function (e) {
      ipcRenderer.send('pause', task.uuid)

      ipcRenderer.send('search', state.term)
    }
  }

  function copy (task) {
    return function (e) {
      clipboard.writeText(format(task))
    }
  }

  function resume (task) {
    return function (e) {
      ipcRenderer.send('resume', task.uuid)

      ipcRenderer.send('search', state.term)
    }
  }
}

function format (task) {
  let total = task.totalTime + (task.isActive ? Date.now() - task.startTime : 0)

  return UNITS.reduce((acc, unit) => {
    const curr = Math.floor(acc.total / unit.value)

    if (curr) acc.results.push(curr + unit.label)

    acc.total -= (curr * unit.value)

    return acc
  }, {
    total,
    results: []
  })
    .results
    .join(' ')
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

function initialize ({dispatch}) {
  ipcRenderer.send('search', '')

  ipcRenderer.on('search', function (e, tasks) {
    dispatch('add-tasks', {tasks})
  })

  tick()

  function tick () {
    dispatch('set-term', document.forms[0] != null ? document.forms[0].input.value : '')

    setTimeout(tick, 1000)
  }
}
