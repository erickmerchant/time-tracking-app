const ift = require('@erickmerchant/ift')('')
const html = require('bel')
const format = require('./format')
const classes = {
  body: 'border-box margin-0 background-white dark-gray font-size-medium',
  form: 'flex row padding-2 font-size-large background-light-gray border-bottom-light-gray mobile-column',
  input: 'auto padding-2 margin-1 border-radius border-gray background-white placeholder-gray',
  results: 'padding-2 margin-0 flex column desktop-padding-right-0',
  noResults: 'padding-1 align-center',
  item: 'margin-1 padding-1 flex wrap items-center',
  column1: 'padding-1 bold width-half mobile-align-center desktop-align-left',
  column2: 'padding-1 align-center width-half dark-gray'
}

module.exports = function ({state, dispatch, next}) {
  const input = html`<input onkeyup="${search}" onfocus="${help('input')}" value="" name="input" placeholder="What are you doing?" class="${classes.input}" />`

  input.isSameNode = function (target) {
    return true
  }

  return html`
  <body class="${classes.body}">
    <form onsubmit="${add}" class="${classes.form}">
      ${input}
    </form>
    ${ift(state.tasks.length,
      () => html`<div class="${classes.results}">
          ${state.tasks.map((task) => {
            return html`<div tabindex="0" onkeydown="${modify(task)}" onfocus="${help('task', task)}" class="${classes.item} ${ift(task.isActive, 'border-left-large-blue', 'border-left-large-gray')}">
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

  function help (type, arg) {
    return () => {
      // console.log(arguments)
    }
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

      console.log(e)
    }
  }
}
