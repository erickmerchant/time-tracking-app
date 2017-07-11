module.exports = function (state = {
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
