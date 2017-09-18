const ift = require('@erickmerchant/ift')('')
const {route} = require('@erickmerchant/router')()
const html = require('bel')
const format = require('./format')
const classes = {
  body: 'border-box flex column margin-0 background-white font-size-medium max-height-100vh dark-gray',
  form: 'padding-2 font-size-large background-light-gray mobile-column',
  formField: 'full-width flex row',
  input: 'auto padding-2 margin-1 border-radius border-gray background-white placeholder-gray',
  main: 'auto overflow-scroll',
  results: 'padding-2 margin-0 flex column desktop-padding-right-0',
  noResults: 'padding-1 align-center',
  item: 'margin-1 padding-1 flex wrap items-center',
  column1: 'padding-1 bold width-half mobile-align-center desktop-align-left',
  column2: 'padding-1 align-center width-half',
  clock: 'icon margin-horizontal-1',
  help: 'background-light-gray padding-2 font-size-small'
}
const icons = {
  clock: require('geomicons-open/src/clock')
}

module.exports = function ({state, dispatch, next}) {
  const input = html`<input autofocus onkeyup="${search}" onfocus="${() => dispatch('help', 'input')}" onblur="${() => dispatch('help', false)}" value="" name="input" placeholder="What are you doing?" class="${classes.input}" />`

  input.isSameNode = function (target) {
    return true
  }

  return html`
  <body class="${classes.body}">
    <form onsubmit="${add}" class="${classes.form}">
      <div class="${classes.formField}">
        ${input}
      </div>
    </form>
    <main class="${classes.main}">
      ${ift(state.tasks.length,
        () => html`<div class="${classes.results}">
            ${state.tasks.map((task) => {
              return html`<div tabindex="0" onkeydown="${modify(task)}" onfocus="${() => dispatch('help', 'task')}" onblur="${() => dispatch('help', false)}" class="${classes.item} ${ift(task.isActive, 'border-left-large-blue', 'border-left-large-gray')}">
                <div class="${classes.column1}">${task.title}</div>
                <div class="${classes.column2}">
                  <svg class="${classes.clock}" viewBox="0 0 32 32">
                    <path d="${icons.clock}">
                  </svg>
                  ${format(task)}
                </div>
              </div>`
            })}
          </div>`,
        ift(state.term === '',
          () => html`<p class="${classes.noResults}">You're not tracking anything yet.</p>`,
          () => html`<p class="${classes.noResults}">No results.</p>`
        )
      )}
    </main>
    <div class="${classes.help}">
      ${ift(state.help, () => route(state.help, (on) => {
        on('input', () => html`<span>Type to search. Press <kbd>return</kbd> to add. ${state.term !== '' ? html`<span>Press <kbd>esc</kbd> to clear the input.</span>` : ''} Use <kbd>tab</kbd> and <kbd>shift + tab</kbd> to navigate.</span>`)

        on('task', () => html`<span>Press <kbd>return</kbd> to toggle. Press <kbd>delete</kbd> to delete. Press <kbd>command + c</kbd> to copy (also resets time). Use <kbd>tab</kbd> and <kbd>shift + tab</kbd> to navigate.</span>`)

        on(() => html`<span>Use <kbd>tab</kbd> and <kbd>shift + tab</kbd> to navigate.</span>`)
      }), html`<span>Use <kbd>tab</kbd> and <kbd>shift + tab</kbd> to navigate.</span>`)}
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
        case e.key === 'c' && e.metaKey === true:
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
