const html = require('nanohtml')
const raw = require('nanohtml/raw')
const format = require('./format.mjs')
const icons = require('feather-icons').icons

module.exports = function ({state, dispatch, next}) {
  return html`<body class="flex column margin-0 background-white max-height-100vh black border-box">
    <form onsubmit=${add} class="padding-3 width-full max-width-full background-light-gray">
      <input autofocus onkeyup=${escapeMaybe} oninput=${setTerm} value="${state.term}" name="input" placeholder="Press enter to add." class="width-full max-width-full padding-2 bold border-radius border-solid border-3 border-dark-gray background-white black placeholder-light-gray" />
    </form>
    <main class="flex-auto overflow-auto">${main()}</main>
    <footer class="background-light-gray padding-2 bold">
      <span class="black padding-y-1">${icon('clock')} <span class="padding-right-1">${format(state.tasks, state.now)}</span></span>
    </footer>
  </body>`

  function main() {
    return state.tasks.length
      ? html`<div class="margin-0">
          ${state.tasks.map(item)}
        </div>`
      : html`<p class="padding-1 align-center">You're not tracking anything yet.</p>`
  }

  function item(task) {
    return html`<div class="grid columns-3 items-center padding-2">
      <div class="border-left-solid border-left-3 ${task.isActive ? 'border-blue' : 'border-light-gray'} padding-2"><strong>${task.title}</strong></div>
      <div>
        ${icon('clock')}
        ${format(task, state.now)}
      </div>
      <div class="align-right">
        <div class="items-center nowrap">
          <button class="border-solid border-dark-gray border-y-2 border-left-2 border-right-1 border-left-radius background-white dark-gray" type="button" onclick=${() => dispatch('toggle', task.uuid)}>${icon(task.isActive ? 'pause' : 'play')}</button>
          <button class="border-solid border-dark-gray border-y-2 border-x-1 background-white dark-gray" type="button" onclick=${() => dispatch('copy', task.uuid)}>${icon('copy')}</button>
          <button class="border-solid border-dark-gray border-y-2 border-right-2 border-left-1 border-right-radius background-white dark-gray" type="button" onclick=${() => dispatch('remove', task.uuid)}>${icon('delete')}</button>
        </div>
      </div>
    </div>`
  }

  function setTerm(e) {
    dispatch('term', this.value)
  }

  function escapeMaybe(e) {
    if (e.key === 'Escape') {
      this.value = ''

      dispatch('term', '')
    }
  }

  function add(e) {
    e.preventDefault()

    dispatch('add', state.term)

    this.input.value = ''

    dispatch('term', '')
  }
}

function icon(which) {
  return raw(icons[which].toSvg({class: 'icon margin-x-1', 'stroke-width': 3}))
}
