const ift = require('@erickmerchant/ift')('')
const {route} = require('@erickmerchant/router')()
const html = require('bel')
const raw = require('bel/raw')
const format = require('./format')
const icons = require('feather-icons')
const release = require('os').release()
const isDarwin = /Macintosh/.test(release)
const deleteKey = isDarwin ? 'delete' : 'backspace'
const returnKey = isDarwin ? 'return' : 'enter'
const commandKey = isDarwin ? 'command' : 'ctrl'

module.exports = function ({state, dispatch, next}) {
  const input = html`<input autofocus onkeyup=${search} onfocus=${() => dispatch('help', 'input')} onblur=${() => dispatch('help', '')} value="" name="input" placeholder="Type to search. Press ${returnKey} to add." class="auto padding-2 margin-1 bold border-radius border-gray background-white placeholder-gray" />`

  input.isSameNode = function (target) {
    return true
  }

  return html`
  <body class="flex column margin-0 background-white font-size-medium max-height-100vh dark-gray">
    <form onsubmit=${add} class="flex row padding-2 background-light-gray">
      ${input}
    </form>
    <main class="auto overflow-auto">
      ${ift(state.tasks.length,
        () => html`<div class="padding-2 margin-0 flex column">
            ${state.tasks.map((task) => {
              return html`<div tabindex="0" onkeydown=${modify(task)} onfocus=${() => dispatch('help', 'task')} onblur=${() => dispatch('help', '')} class="margin-1 padding-1 flex wrap items-center ${ift(task.isActive, 'border-left-large-blue', 'border-left-large-gray')}">
                <div class="padding-1 bold width-2">${task.title}</div>
                <div class="padding-1 width-1">
                  ${icon('clock')}
                  ${format(task)}
                </div>
              </div>`
            })}
          </div>`,
        html`<p class="padding-1 align-center">${ift(state.term === '',
          () => `You're not tracking anything yet.`,
          () => `No results.`
        )}</p>`
      )}
    </main>
    <div class="background-light-gray padding-2 font-size-small overflow-ellipsis nowrap">
      ${icon('help-circle')}
      ${route(state.help, (on) => {
        on('input', () => state.term !== '' ? html`<span>Press <kbd>esc</kbd> to clear the input.</span>` : html``)

        on('task', () => html`<span>Press <kbd>${returnKey}</kbd> to toggle. Press <kbd>${deleteKey}</kbd> to delete. Press <kbd>${commandKey} + c</kbd> to copy (also resets time). </span>`)

        on(() => html`<span>Use <kbd>tab</kbd> and <kbd>shift + tab</kbd> to navigate.</span>`)
      })}
    </div>
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

  function modify (task) {
    return function (e) {
      switch (true) {
        case e.key === 'c' && (isDarwin ? e.metaKey : e.ctrlKey) === true:
          dispatch('copy', task.uuid)
          break

        case e.key === 'Backspace':
          dispatch('remove', task.uuid)
          break

        case e.key === 'Enter':
          dispatch('toggle', task.uuid)
          break
      }
    }
  }
}

function icon (which) {
  return raw(icons.toSvg(which, {'class': 'icon margin-horizontal-1', 'stroke-width': 3}))
}
