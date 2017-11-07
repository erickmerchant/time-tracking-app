const html = require('bel')
const raw = require('bel/raw')
const format = require('./format')
const icons = require('feather-icons')

module.exports = function ({state, dispatch, next}) {
  const input = html`<input autofocus onkeyup=${search} value="" name="input" placeholder="Type to search. Press enter to add." class="auto padding-2 margin-1 bold border-radius border-gray background-white placeholder-gray" />`

  input.isSameNode = function (target) {
    return true
  }

  return html`
  <body class="flex column margin-0 background-white font-size-medium max-height-100vh dark-gray">
    <form onsubmit=${add} class="flex row padding-2 background-light-gray">
      ${input}
    </form>
    <main class="auto overflow-auto">${
        state.tasks.length
        ? html`<div class="margin-0">
            ${state.tasks.map((task) => {
              return html`<div class="grid items-center padding-2">
                <div class="${task.isActive ? 'border-left-large-blue' : 'border-left-large-gray'} padding-2"><strong>${task.title}</strong></div>
                <div>
                  ${icon('clock')}
                  ${format(task)}
                </div>
                <div>
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
    <footer class="background-light-gray padding-2 font-size-small bold">
      <span class="margin-horizontal-2"><span class="padding-horizontal-1 margin-right-1 white background-blue border-blue border-radius">${state.stats.active}</span> Active</span>
      <span class="margin-horizontal-2"><span class="padding-horizontal-1 margin-right-1 white background-gray border-gray border-radius">${state.stats.inactive}</span> Inactive</span>
    </footer>
  </body>`

  function search (e) {
    if (e.key === 'Escape') {
      this.value = ''

      dispatch('search', this.value)
    } else {
      dispatch('search', this.value)
    }
  }

  function add (e) {
    e.preventDefault()

    dispatch('add', state.term)
  }
}

function icon (which) {
  return raw(icons.toSvg(which, {'class': 'icon margin-horizontal-1', 'stroke-width': 3}))
}
