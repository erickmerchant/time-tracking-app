const {clipboard} = require('electron')
const ift = require('@erickmerchant/ift')('')
const html = require('yo-yo')
const format = require('./format')
const classes = {
  button: 'inline-block margin-1 background-white border-radius border bold',
  body: 'border-box margin-0 background-white dark-gray font-size-medium',
  form: 'flex row padding-2 font-size-large background-light-gray border-bottom-light-gray mobile-column',
  input: 'auto padding-2 margin-1 border-radius border-gray background-white placeholder-gray',
  add: 'padding-2 mobile-font-size-medium green',
  results: 'padding-2 margin-0 flex column desktop-padding-right-0',
  noResults: 'padding-1 align-center',
  item: 'margin-1 padding-1 flex wrap items-center',
  column1: 'padding-1 bold mobile-width-half mobile-align-center desktop-width-third desktop-align-left',
  column2: 'padding-1 align-center mobile-width-half desktop-width-third',
  column3: 'mobile-flex mobile-wrap mobile-margin-top-2 mobile-margin-horizontal-auto mobile-justify-center mobile-align-center desktop-align-right desktop-width-third',
  remove: 'padding-1 font-size-small red',
  log: 'padding-1 font-size-small dark-gray',
  pause: 'padding-1 font-size-small blue',
  resume: 'padding-1 font-size-small gray'
}

module.exports = function ({state, dispatch, next}) {
  return html`
  <body class="${classes.body}">
    <form onsubmit="${add}" class="${classes.form}">
      <input onkeyup="${search}" name="input" placeholder="What are you doing?" class="${classes.input}" />
      <button type="submit" class="${classes.button} ${classes.add}">
        Add
      </button>
    </form>
    ${ift(state.tasks.length,
      () => html`<div class="${classes.results}">
          ${state.tasks.map((task) => {
            return html`<div class="${classes.item} ${ift(task.isActive, 'border-left-large-blue', 'border-left-large-gray')}">
              <div class="${classes.column1}">${task.title}</div>
              <div class="${classes.column2}">${format(task)}</div>
              <div class="${classes.column3}">
                ${ift(task.isActive, () => html`<button type="button" onclick=${pause(task)} class="${classes.button} ${classes.pause}">
                  Pause
                </button>`)}
                ${ift(!task.isActive, () => html`<button type="button" onclick=${log(task)} class="${classes.button} ${classes.log}">
                  Log
                </button>`)}
                ${ift(!task.isActive, () => html`<button type="button" onclick=${resume(task)} class="${classes.button} ${classes.resume}">
                  Resume
                </button>`)}
                <button type="button" onclick=${remove(task)} class="${classes.button} ${classes.remove}">
                  Remove
                </button>
              </div>
            </div>`
          })}
        </div>`,
      ift(state.term === '',
        () => html`<p class="${classes.noResults}">You're not tracking anything yet.</p>`,
        () => html`<p class="${classes.noResults}">No results.</p>`
      )
    )}
  </body>`

  function search () {
    dispatch('search', this.value)
  }

  function add (e) {
    e.preventDefault()

    dispatch('add', state.term)
  }

  function remove (task) {
    return () => {
      dispatch('remove', task.uuid)
    }
  }

  function pause (task) {
    return () => {
      dispatch('pause', task.uuid)
    }
  }

  function log (task) {
    return () => {
      dispatch('reset', task.uuid)

      clipboard.writeText(format(task))
    }
  }

  function resume (task) {
    return () => {
      dispatch('resume', task.uuid)
    }
  }
}
