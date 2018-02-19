const html = require('bel')
const raw = require('bel/raw')
const format = require('./format')
const icons = require('feather-icons').icons

module.exports = function ({state, dispatch, next}) {
  return html`
  <body class="flex column margin-0 background-white font-size-medium max-height-100vh dark-gray">
    <form onsubmit=${add} class="padding-3 full-width fit-width background-light-gray">
      <input autofocus onkeyup=${escapeMaybe} oninput=${setTerm} value="${state.term}" name="input" placeholder="Press enter to add." class="full-width fit-width padding-2 bold border-radius border-gray background-white placeholder-gray" />
    </form>
    <main class="auto overflow-auto">${
  state.tasks.length
    ? html`<div class="margin-0">
          ${state.tasks.map(function (task) {
    return html`<div class="grid columns-3 items-center padding-2">
              <div class="${task.isActive ? 'border-left-large-blue' : 'border-left-large-gray'} padding-2"><strong>${task.title}</strong></div>
              <div>
                ${icon('clock')}
                ${format(task, state.now)}
              </div>
              <div class="align-right">
                <button class="background-white border-none margin-1" type="button" onclick=${() => dispatch('toggle', task.uuid)}>${
  task.isActive
    ? icon('pause')
    : icon('play')
}</button>
                <button class="background-white border-none margin-1" type="button" onclick=${() => dispatch('copy', task.uuid)}>${icon('copy')}</button>
                <button class="background-white border-none margin-1" type="button" onclick=${() => dispatch('remove', task.uuid)}>${icon('delete')}</button>
              </div>
            </div>`
  })}
        </div>`
    : html`<p class="padding-1 align-center">${
      state.term === ''
        ? `You're not tracking anything yet.`
        : `No results.`
    }</p>`
}</main>
    <footer class="background-light-gray padding-2 bold">
      <span class="dark-gray padding-vertical-1">${icon('clock')} <span class="padding-right-1">${format(state.tasks, state.now)}</span></span>
    </footer>
  </body>`

  function setTerm (e) {
    dispatch('term', this.value)
  }

  function escapeMaybe (e) {
    if (e.key === 'Escape') {
      this.value = ''

      dispatch('term', '')
    }
  }

  function add (e) {
    e.preventDefault()

    dispatch('add', state.term)

    this.input.value = ''

    dispatch('term', '')
  }
}

function icon (which) {
  return raw(icons[which].toSvg({'class': 'icon margin-horizontal-1', 'stroke-width': 3}))
}
