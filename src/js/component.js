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
  help: 'background-light-gray padding-2 font-size-small'
}
const commonHelp = 'Use TAB and SHIFT + TAB to navigate.'

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
                <div class="${classes.column2}">${format(task)}</div>
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
        on('input', () => `Type to search. Press ENTER to add. ${state.term !== '' ? 'Press BACKSPACE to clear the input.' : ''}. ${commonHelp}`)

        on('task', () => `Press ENTER to toggle. Press BACKSPACE to delete. Press METAKEY + C to copy (also resets time). ${commonHelp}`)

        on(() => commonHelp)
      }), commonHelp)}
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
