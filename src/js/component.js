const ift = require('@erickmerchant/ift')('')
const html = require('yo-yo')
const format = require('./format')
const actions = require('./actions')
const classes = {
  body: 'border-box margin-0 background-white dark-gray font-size-medium',
  form: 'flex row padding-2 font-size-large background-light-gray border-bottom-light-gray mobile-column',
  input: 'auto padding-2 margin-1 border-radius border-gray background-white placeholder-gray',
  addButton: 'inline-block padding-2 margin-1 background-white border-radius border green bold mobile-font-size-medium',
  results: 'padding-2 margin-0 flex column desktop-padding-right-0',
  noResults: 'padding-1 align-center',
  item: 'margin-1 padding-1 flex wrap items-center',
  itemColumnOne: 'padding-1 bold mobile-width-half mobile-align-center desktop-width-third desktop-align-left',
  itemColumnTwo: 'padding-1 align-center mobile-width-half desktop-width-third',
  itemColumnThree: 'mobile-flex mobile-wrap mobile-margin-top-2 mobile-margin-horizontal-auto mobile-justify-center mobile-align-center desktop-align-right desktop-width-third',
  itemRemoveButton: 'inline-block padding-1 margin-1 background-white border-radius border red font-size-small bold',
  itemCopyButton: 'inline-block padding-1 margin-1 background-white border-radius border dark-gray font-size-small bold',
  itemPauseButton: 'inline-block padding-1 margin-1 background-white border-radius font-size-small border blue bold',
  itemResumeButton: 'inline-block padding-1 margin-1 background-white border-radius font-size-small border gray bold'
}

module.exports = function ({state, dispatch, next}) {
  const {search, add, remove, pause, copy, resume} = actions({dispatch, state})

  return html`
  <body class="${classes.body}">
    <form onsubmit="${add}" class="${classes.form}">
      <input onkeyup="${search}" name="input" placeholder="What are you doing?" class="${classes.input}" />
      <button type="submit" class="${classes.addButton}">
        Add
      </button>
    </form>
    ${ift(state.tasks.length,
      () => html`<div class="${classes.results}">
          ${state.tasks.map((task) => {
            return html`<div class="${classes.item} ${ift(task.isActive, 'border-left-large-blue', 'border-left-large-gray')}">
              <div class="${classes.itemColumnOne}">${task.title}</div>
              <div class="${classes.itemColumnTwo}">${format(task)}</div>
              <div class="${classes.itemColumnThree}">
                ${ift(task.isActive, () => html`<button type="button" onclick=${pause(task)} class="${classes.itemPauseButton}">
                  Pause
                </button>`)}
                ${ift(!task.isActive, () => html`<button type="button" onclick=${copy(task)} class="${classes.itemCopyButton}">
                  Copy
                </button>`)}
                ${ift(!task.isActive, () => html`<button type="button" onclick=${resume(task)} class="${classes.itemResumeButton}">
                  Resume
                </button>`)}
                <button type="button" onclick=${remove(task)} class="${classes.itemRemoveButton}">
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
}
